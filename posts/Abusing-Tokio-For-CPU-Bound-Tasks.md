---
title: Abusing Tokio for CPU-Bound Tasks (And Getting Away With It)
date: 2026-02-03 11:38:00 +0200
category: "Systems Programming"
tags: [rust, tokio, async, performance]
---

If you write async Rust, you have heard the golden rule. It is drilled into you from day one. Do not block the runtime. If you have heavy, CPU-bound workloads, you are supposed to ship them off to a dedicated thread pool and keep Tokio strictly for I/O.

But what if you are building an analytics engine, a database, or a heavy data processing pipeline? You are already using Tokio for network requests and communicating with object storage like AWS S3. Do you really need to bring in a completely separate task scheduler just to crunch some numbers?

I have spent a lot of time wrestling with custom task schedulers. They are incredibly easy to get working 99% of the way, and an absolute nightmare to perfect. You will spend weeks chasing race conditions, fixing task cancellation, and handling graceful shutdowns.

Instead of reinventing the wheel, we can just use Tokio. Yes, for CPU-bound tasks. Here is why it actually makes sense, why people will tell you not to do it, and how to actually pull it off without ruining your application.

## Why Tokio Actually Makes Sense

If you look past the "network applications only" branding, Tokio is just a highly optimized task scheduler. Using it for CPU workloads gives you several massive advantages:

* **Zero New Dependencies:** If you are doing network I/O, you already have it in your tree.
* **A World-Class Scheduler:** It uses a sophisticated work-stealing scheduler that is heavily tested across the entire Rust ecosystem.
* **First-Class Language Support:** You get native integration with `async/await`, plus a mature ecosystem of streams, channels, and async locking primitives.
* **Cache Locality:** Tokio typically keeps running tasks and the futures they run on the same executor thread, which is fantastic for CPU cache performance.

## The Purist Objections (And The Pragmatic Reality)

If you mention this approach in a forum, you will immediately get hit with a few standard objections. Most of them are valid in theory but easily solved in practice.

### Objection 1: "The docs explicitly say not to do this!"

Older versions of the Tokio documentation had a famous warning telling you to use Rayon if your code was CPU-bound. People read this and assumed Tokio was fundamentally incapable of handling computation.

The real intent of that warning is much simpler: do not run heavy CPU tasks on the *same runtime instance* as your I/O tasks. If you do, your I/O will stall. The pragmatic fix is to simply spin up a secondary Tokio runtime dedicated entirely to CPU-bound work.

Rayon is fantastic, but it has no native support for async. If your CPU-heavy task eventually needs to write a result to a database or fetch a file, straddling that sync/async boundary in Rayon is painful.

### Objection 2: "Say goodbye to your tail latencies."

The argument here is that if a massive CPU task hogs a thread, a simple HTTP `/health` check might sit in a queue for 500 milliseconds. Kubernetes will assume your pod is dead and ruthlessly kill it.

This is a real problem, but again, the solution is isolation. Keep your web server and health checks on your primary Tokio runtime. Keep your data crunching on a completely separate runtime.

### Objection 3: "Tokio has too much per-task overhead."

You will always find someone pointing out that a custom, bare-bones thread pool can churn through tiny tasks faster than Tokio. And they are right. If your task does almost zero actual work, Tokio's overhead is noticeable.

But the reality depends on the size of your tasks. If you use vectorized processing and handle data in reasonable chunks (like processing thousands of rows at a time), that per-task overhead completely fades into noise. You amortize the cost of the scheduler, and the difference becomes negligible.

## The Ugly Truth Under High Load

Even if you isolate your runtimes, things can still get weird when the load spikes. I have seen systems crawl to a halt without ever fully saturating the CPU.

What usually happens is a cascading failure of I/O. If your CPU tasks are initiating I/O work, that work has to migrate back to the I/O runtime. If you are chewing through data too fast, you might not process those network tasks quickly enough. The network stack interprets this as host congestion and starts backing off or lowering traffic priority.

Furthermore, long-running CPU tasks can completely break cancellation. If your task is a tight loop that constantly returns `Poll::Ready` and never `Poll::Pending`, the runtime never gets a chance to step in and cancel it.

**The Fix:** Your tasks need to breathe. You have to manually yield back to the scheduler by occasionally calling `tokio::task::yield_now()`. This forces the task to return `Poll::Pending`, allowing Tokio to process cancellations and keep the system responsive. Even better, you can hook directly into Tokio's internal task budget to automate this yielding process gracefully.

## Building a Dedicated CPU Executor

So, how do we actually isolate this work? We spawn a dedicated thread, build a custom multi-threaded runtime on it, and pass tasks to it via a channel.

Here is a simplified architectural pattern to achieve exactly that:

```rust
use std::sync::{Arc, Mutex};
use tokio::task::JoinHandle;

pub struct DedicatedExecutor {
    state: Arc<Mutex<State>>,
}

struct State {
    /// Channel for sending tasks to the dedicated runtime
    requests: Option<std::sync::mpsc::Sender<Task>>,
    /// The OS thread holding our isolated runtime
    thread: Option<std::thread::JoinHandle<()>>,
}

impl DedicatedExecutor {
    pub fn new(thread_name: &str, num_threads: usize) -> Self {
        let thread_name = thread_name.to_string();
        let (tx, rx) = std::sync::mpsc::channel::<Task>();

        let thread = std::thread::spawn(move || {
            // Build a completely isolated runtime
            let runtime = tokio::runtime::Builder::new_multi_thread()
                .enable_all()
                .thread_name(&thread_name)
                .worker_threads(num_threads)
                // Optional: Lower OS thread priority so I/O always wins
                // .on_thread_start(move || set_current_thread_priority_low())
                .build()
                .expect("Failed to create dedicated Tokio runtime");

            // Block the thread, pulling tasks from the channel and spawning them
            runtime.block_on(async move {
                while let Ok(task) = rx.recv() {
                    tokio::task::spawn(async move {
                        task.run().await;
                    });
                }
            });
        });

        Self {
            state: Arc::new(Mutex::new(State {
                requests: Some(tx),
                thread: Some(thread),
            })),
        }
    }
}

```

The crucial part here is the `std::thread::spawn`. You cannot build a new runtime inside an existing one. By pushing it to its own OS thread, we get a pristine environment.

You can then create a custom `Job` struct that wraps your future and uses a `tokio::sync::oneshot` channel to pass the computed result back to your main I/O runtime.

Tokio is a beast of a tool. Treat it with respect, isolate your workloads properly, and force your heavy loops to yield. If you do that, you get to keep the incredible async ecosystem without writing a custom scheduler from scratch.

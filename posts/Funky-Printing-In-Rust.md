---
title: Funky Printing in Rust
date: 2024-03-12 15:00:00 +0200
category: "Systems Programming"
tags: [rust]
---

The Basics: Positional and Named Arguments

We all know how rusts print! works, right?

```rust
fn main() {
    println!("Hello World!");
    let y = 42;
    println!("{y}");
    println!("{}", y);
}
```

This is nothing out of the ordinary, but you might be surprised to learn that you can use positional arguments to control how your variables appear

```rust
fn main() {
    let x = 42;
    let y = "Rust is awesome";
    let z = String::from("My favorite number is");
    println!("{2} {1} and I strongly believe that {0}. Did I mention that my favorite number is {1}?", y, x, z);
}
```

This will print:

```
My favorite number is 42 and I strongly believe that Rust is awesome. Did i mention that my favorite number is 42?
```

Pretty cool, right?
Now, onto the funky stuff

But there's more. Something I have barely seen used at all. (most likely because you rarely need it haha)

```rust
fn main() {
    let name = "cheese";
    println!("{:-^15}", name);
}
```

It may surprise you but this will print out the following:

```
------cheese------
```

Why is that?

By using a special syntax {variable:padding alignment minimum.maximum}, you can create outputs that look just the way you want.
Breakdown

    Variable Name: Specify it upfront or use explicit formatting
    Padding Characters: This will be the characters your variable will get padded with.
    Alignment: Use < for left, > for right, and ^ for center alignment.
    Minimum Length: Defines the minimum width of the output
    Maximum Length: Defines the maximum width of the output. This is actually a precision specifier, commonly used for strings or floats.

Here are some more examples of what you can do with this:

```rust
fn main() {
    let letter = '♚';
    println!("{:♙^11}", letter);
}
```

Which results in this:

```
♙♙♙♙♙♚♙♙♙♙♙
```

You can even combine several of them in a single println! call to create something more interesting

```rust
fn main() {
    let header = "SYSTEM STATUS";
    println!("{:-^40}", header);

    let column1 = "PROCESS";
    let column2 = "MEMORY (MB)";
    println!("{:<20}{:>20}", column1, column2);

    let process1 = "nginx";
    let memory1 = 150;
    println!("{:<20}{:>20}", process1, memory1);

    let process2 = "docker";
    let memory2 = 1024;
    println!("{:<20}{:>20}", process2, memory2);
}
```

```
-------------SYSTEM STATUS-------------
PROCESS                      MEMORY (MB)
nginx                                150
docker                              1024
```

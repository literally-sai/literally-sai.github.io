---
title: The Engine Under the Hood - Memory, Cache, and Bevy Archetypes
date: 2026-06-27 10:30:00 +0200
category: "GameDev"
tags: [bevy, rust, ecs, performance]
---

ECS is an acronym for Entity Component System and is a programming paradigm where we store and access our data in a way that maximizes performance.

A good way to imagine how it all fits together is to think about an in-memory database. Entities and components make up the data:

* **Entities:** An identifier for a row
* **Components:** A column in a row
* **Systems:** All the behavior

This however is just a helpful fiction. The reality is that components are stored in arrays of the same type:

```rust
let rotation: Vec<Rotation> = vec![Rotation(0.5), Rotation(1.2)]
let momentum: Vec<Momentum> = vec![Momentum(10.), Momentum(5.)]

```

We can collect all the columns for an entity by reaching into each array and grabbing the nth component that matches the Entity's ID.

This way of thinking is probably not as intuitive as something like Model View Controller programming where we group the idea of entities, components and systems together inside models. Breaking them apart means the programmer has a harder time keeping the entire system in their head. We do things this way to increase the performance by reducing cache misses in your CPU.

## Squeezing Performance Out of Our CPU

Your CPU has multiple levels of caching that get progressively larger but also slower.

* **L1 Cache:** Smallest, fastest cache located closest to the CPU.
* **L2 Cache:** Larger, slower than L1 but still faster than RAM.
* **L3 Cache:** Largest, shared among CPU cores, slower than L2.

Your CPU will try to get data from the fastest cache possible. If the data is not there, you get a cache miss and your CPU has to go to the next level of cache or fetch it from RAM which is much slower.

To utilize the cache effectively, data should be organized in a way that minimizes the number of cache misses. The more we can keep our data in contiguous arrays, the better your CPU will be at using its cache. A contiguous array means that every item in our array should be both useful and sequential. There are no nulls. When we access it, our CPU cache can predict our intention correctly.

We are being more sympathetic to our CPU and in exchange our CPU is working harder to save us time accessing memory. The big idea in ECS is to store everything in contiguous arrays in a way that matches how we would access them in our game logic.

## Arrays of Structures

The naive way to store game data is to group all the data for an entity inside a single structure.

```rust
struct Rotation {
    roll: f32,
    pitch: f32,
}

struct Momentum {
    force: f32,
}

struct Fuel(f32);

struct SpaceStation {
    fuel: Fuel,
    rotation: Rotation,
    momentum: Momentum,
}

```

The `SpaceStation` struct is convenient to a developer because all the data for a station is in one place. The main loop of our game would take all the stations and do something to them like rotate them based on their momentum.

```rust
fn main() {
    let mut stations: Vec<SpaceStation> = vec![
        SpaceStation {
            fuel: Fuel(100.0),
            rotation: Rotation { roll: 0.0, pitch: 0.0 },
            momentum: Momentum { force: 1.0 }
        },
        SpaceStation {
            fuel: Fuel(50.0),
            rotation: Rotation { roll: 0.0, pitch: 0.0 },
            momentum: Momentum { force: 2.0 },
        },
    ];

    loop {
        for station in stations.iter_mut() {
            station.fuel.0 -= 0.1;
            station.rotation.roll += station.momentum.force;
        }
    }
}

```

This approach is intuitive and easy to read, but our CPU has a much harder time using its cache when the memory is laid out this way. Our memory layout from the above example would currently look something like this:

* **Station 1:** `[Fuel1, Rotation1, Momentum1]`
* **Station 2:** `[Fuel2, Rotation2, Momentum2]`
* **Station 3:** `[Fuel3, Rotation3, Momentum3]`

When your CPU fetches data from memory and puts it into the cache, it does so in a fixed block called a cache line. Common cache line sizes range from 32 to 128 bytes. Your CPU will grab the whole cache line, even if only a portion of the data is actually needed. In doing so your CPU is guessing that things you store together in memory are likely to be accessed together. This is called spatial locality.

We can imagine that currently our cache lines look like:

* **Cache Line 1:** `[Fuel1, Rotation1]`
* **Cache Line 2:** `[Momentum1, Fuel2]`
* **Cache Line 3:** `[Rotation2, Momentum2]`

When you load a variable onto the stack, you load it into the cache. Then when you access it again later your CPU will first check its cache. If you had loaded other data in the interim, it will have been evicted and have to be re-fetched from RAM memory. This is a cache miss. When we iterate over each station and fetch the data, we would be bouncing all over our RAM trying to fetch the missing data and evicting our cache each iteration.

## Structures of Arrays

Instead of grouping all the data for an entity together, we break down the data into separate arrays for each piece. These pieces are called components.

```rust
struct Entity {
    id: u32,
}

struct RotationComponent {
    roll: f32,
    pitch: f32,
}

struct MomentumComponent {
    force: f32,
}

struct World {
    entities: Vec<Entity>,
    rotations: Vec<RotationComponent>,
    momentums: Vec<MomentumComponent>,
}

```

Then in the actual game loop we can use the index of each component in the array to recreate the entity. This is a simplified version of what an ECS is doing for you.

```rust
fn update_rotations(world: &mut World) {
    for (rotation, momentum) in world.rotations.iter_mut().zip(world.momentums.iter()) {
        rotation.roll += momentum.force;
    }
}

```

Now when we load our components, our memory is laid out like:

* **Momentums:** `[Momentum1, Momentum2, Momentum3]`
* **Rotations:** `[Rotation1, Rotation2, Rotation3]`

By loading each component onto the stack sequentially, it matches the memory access patterns that the CPU is predicting and our cache lines are less likely to be thrashed.

## Entities Help Avoid Passing References

By using the entities and components part of our ECS we get better memory performance. But there is also the idea of how we manage our references and pointers. This can be particularly painful in Rust which requires you to manage the lifetimes of your references.

In our example above we got rid of our `SpaceStation` struct and it became implicit. The concept of the station became an Entity with a `SpaceStation` marker component. To rebuild the station in our game world we just access the nth item of each of the arrays according to the Entity's ID. All the components together make up the total representation of an entity's data.

This is a powerful abstraction because we can avoid passing around references to the data on our arrays. Instead we can pass around this index of our entities and when we want the data we can request it from one place. By localizing our memory access within our systems we can perform disjointed queries of our data in parallel with each other for even more performance gains.

## Bevy is an Archetypal ECS

Archetypes enable efficient storage and processing of entities by grouping them according to their component composition. An Archetype describes a unique combination of components. A world has only one Archetype for each unique combination of components.

Spawning even a single entity with some group of components will create or update an archetype. For example, if we spawn an entity with the following components:

```rust
world.spawn((
    Asteroid,
    Mass(5000.),
    Rotation { roll: 0.5, pitch: 1.0 },
));

```

Bevy would create an archetype for this entity with the components inside a Table that looks like this:

| Asteroid | Mass | Rotation |
| --- | --- | --- |
| X | 5000. | {roll: 0.5, pitch: 1.0} |

By placing components into storage that mimics the way they are likely to be accessed, we can take advantage of data locality and CPU cache efficiency. When a query is used as a system parameter, Bevy calculates the matching Archetype for that specific set of components the query is asking for. This is what lets Bevy calculate which systems can run in parallel.

When you add a component to an entity you are moving that entity to a new archetype. Each Archetype is a graph that stores some metadata about the entities and components it contains:

```rust
pub struct Archetype {
    id: ArchetypeId,
    table_id: TableId,
    edges: Edges,
    entities: Vec<ArchetypeEntity>,
    components: ImmutableSparseSet<ComponentId, ArchetypeComponentInfo>,
    pub(crate) flags: ArchetypeFlags,
}

```

Archetypes are stored in a specific World and are locally unique. Archetypes and tables share the same memory management. They both can only be created and never destroyed. They live for the entire lifetime of your game.

## The Problem with Naive Arrays

Imagine we have a naive implementation of an ECS that stores components as arrays and entities as the index:

| Entity ID | Mass | Asteroid | Rotation | SpaceStation |
| --- | --- | --- | --- | --- |
| 1 | 5000. | X | (0.5, 1.0) |  |
| 2 | 12000. |  | (0.1, 0.0) | X |
| 3 | 3500. | X | (1.5, 0.0) |  |
| 4 | 9000. |  | (0.0, 0.5) | X |

This layout is naive because not all entities have all components. Notice how entities 1 and 3 have the same component layout, while 2 and 4 share a different one. These gaps from the missing components create problems for vectorized operations.

Vectorized code means code that operates on entire arrays or vectors of data at once rather than processing individual elements sequentially. Vectorized operations can be performed efficiently using hardware optimization like SIMD. These instructions allow simultaneous execution of the same operation on multiple data elements, often resulting in improved performance.

However, in the given scenario, because the rows have null values, it becomes challenging to write vectorized code that requires both arrays of `Asteroid` and `SpaceStation`. Vectorized operations usually rely on the assumption that corresponding elements in different arrays have the same index. If the entity IDs in array A and array B are not aligned with the array indices, it becomes difficult to perform operations that depend on matching elements between the two arrays.

## Fixing Nulls with Archetype Tables

What if instead we stored the components how they are likely to be used?

| Entity ID | Mass | Asteroid | Rotation |
| --- | --- | --- | --- |
| 1 | 5000. | X | (0.5, 1.0) |
| 3 | 3500. | X | (1.5, 0.0) |

| Entity ID | Mass | SpaceStation | Rotation |
| --- | --- | --- | --- |
| 2 | 12000. | X | (0.1, 0.0) |
| 4 | 9000. | X | (0.0, 0.5) |

Now we have two tables, but each table forms a contiguous array of elements that can be optimized upon retrieval. The two tables are each a different Archetype. One for the `Asteroid` and one for the `SpaceStation`.

We are storing our components in arrays of the same type, but inside of different tables representing a type (as in the sum of all its components) of an entity. A component could be present in many Archetypes. This is done by using `ArchetypeComponentId`, and this many-to-many relationship is how the parallel scheduler figures out disjointed read-only queries that can be run at the same time.

## Parallel Execution and Archetype Component IDs

At first glance you would think this shouldn't be able to run in parallel. We need mutable access to the same `Rotation` component in two different systems:

```rust
fn spin_asteroids(
    mut asteroid_rotations: Query<&mut Rotation, With<Asteroid>>,
) { }

fn spin_stations(
    mut station_rotations: Query<&mut Rotation, Without<Asteroid>>
) { }

```

If components were simply stored and accessed on a giant `Vec<T>` then `asteroid_rotations` will have already borrowed the `Rotation` components and `station_rotations` should not run in parallel.

However because we have one table for each Archetype, they will not conflict and can be run in parallel even though both queries return `&mut Rotation`. This is because their `ArchetypeComponentId` would be different even though the `ComponentId` of the `Rotation` would be the same.

In other words, each component has only one `ComponentId` but can appear in multiple archetypes, each with its own `ArchetypeComponentId`. It would be similar to a many-to-many relationship between Component and Archetype in a SQL database:

```text
Component <- ComponentId <- ArchetypeComponentId -> ArchetypeId -> Archetype

```

## Graph Edges and Sparse Sets

An Archetype comes into existence when we spawn or insert a Bundle. Given a set of components stored in either a Table or SparseSet or some combination of the two, Bevy will call `Archetype::get_id_or_insert` which allocates or finds a `TableId` which it will use to create a new Archetype.

When we add or remove bundles from an Entity, it moves it to a new Archetype table. These moves can be quite expensive so Bevy caches these moves in Edges. Next time a bundle gets added, we can fetch for a matching edge and find the target Archetype to move it to without computing it from scratch.

Every time we add or remove components, the `ArchetypeGeneration` of our Archetypes changes. Bevy uses the length of the current archetype to create a generational index that guarantees a unique index as we add or remove archetypes. We use this generation when we have to update our archetype indices so that when we query for things they are where they are supposed to be.

Typically, each archetype has its own dedicated table. Archetypes only share tables when components are stored in sparse sets. This is a performance optimization for rarely accessed components. If there was no `SparseSet`, then archetypes and tables would be 1:1.

So only in the case of a component being stored in a `SparseSet` are they potentially shared. An archetype `[A, B, C]` and an archetype `[A, B]` will have the same table if C is a sparse component.

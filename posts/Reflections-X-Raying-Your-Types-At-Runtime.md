---
title: "Reflection: X-Raying your types at runtime"
date: 2026-07-07 16:31:00 +0200
category: "GameDev"
tags: [rust, bevy]
---

Rust is famously strict. At compile time, the compiler demands to know the exact blueprint of every type, how much memory it requires, and what traits it implements.

But what happens when you are building a mech simulator in Bevy and need a UI editor that tweaks weapon payloads on the fly? Or what if you want to load a saved "Blueprint" of a chassis from a text file? The compiler cannot know what types are in that file ahead of time.

**This is why Bevy Reflection is a critical tool.** Reflection is Bevy’s engine for metaprogramming and runtime introspection. It acts like a diagnostic scanner for your code, allowing you to peek inside unknown types (`dyn Reflect`), read their fields by string names, modify them, and serialize them, all without knowing their concrete types at compile time.

## The "Ah-Ha!" Example: Tweaking Weapon Pods at Runtime

To understand why this is so powerful, let us look at a practical example. Imagine your mech has a `WeaponPod` component. At runtime, an engineering UI inspector needs to upgrade the `heat_capacity` of the pod without knowing anything about the `WeaponPod` struct itself.reflec

With Bevy Reflection, we can dynamically modify fields just by knowing their string names:

```rust
use bevy::prelude::*;

// 1. We derive `Reflect` to give this struct diagnostic capabilities
#[derive(Reflect, Component, Default)]
struct WeaponPod {
    ammo_type: String,
    heat_capacity: f32,
}

fn upgrade_cooling_system() {
    // We create a standard, concrete instance of the weapon pod
    let mut pod = WeaponPod {
        ammo_type: "Plasma".to_string(),
        heat_capacity: 50.0
    };

    // 2. We can mutate fields dynamically using their string names!
    // We don't even need to know this is a `WeaponPod` if it were passed as a `&mut dyn Reflect`
    *pod.get_field_mut::<f32>("heat_capacity").unwrap() = 100.0;

    assert_eq!(pod.heat_capacity, 100.0);

    // 3. We can extract the field back out as a dynamically typed `dyn Reflect`
    let heat_field = pod.field("heat_capacity").unwrap(); // Returns &dyn PartialReflect
    let concrete_heat = heat_field.try_downcast_ref::<f32>().unwrap();

    // 4. And downcast it back to a concrete type when we are ready
    let concrete_heat = heat_field.downcast_ref::<f32>().unwrap();
    assert_eq!(*concrete_heat, 100.0);
}

```

This is the exact mechanism Bevy uses to power its scene system and third-party UI inspectors to hot-swap variables while the engine is running.

---

## How It Works Under the Hood

When you add `#[derive(Reflect)]` to a struct, Bevy automatically implements several traits to expose its internal wiring:

- **`PartialReflect`**: Handles the basic introspection (looking at fields, counting them, getting their names).
- **`Reflect`**: Extends `PartialReflect` by allowing you to downcast the trait object back into its actual concrete hardware type.
- **`FromReflect`**: Allows Bevy to reconstruct your specific type from a dynamic, reflected representation (crucial for loading saved blueprints).

To make Bevy aware of your reflectable components globally, you must register them in your `App`'s onboard computer:

```rust
fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        // Now Bevy's TypeRegistry knows exactly what a `WeaponPod` is!
        .register_type::<WeaponPod>()
        .run();
}

```

## Handling Foreign Hardware (Third-Party Types)

Reflection is viral, if a struct is `Reflect`, all of its components must also implement `Reflect` (unless you explicitly ignore them with `#[reflect(ignore)]`).

But what if you are using a type from a third-party crate? For example, tracking the `rust_decimal::Decimal` thickness of a mech's armor plate. You cannot derive `Reflect` on a type you do not own. The compiler will trigger an error stating that `Decimal` does not implement `FromReflect`.

You have four ways to engineer around this:

1. Maintain your own fork of the crate and derive it yourself.
2. Provide a custom type you can seamlessly convert to/from the foreign type.
3. Create a wrapper (`newtype`) around the foreign type and manually implement the reflection traits.
4. **The Efficient Way:** Tell Bevy to just reflect the `Serialize` and `Deserialize` traits instead.

If the third-party type supports `serde`, you can treat it as an "opaque" block (a solid state component that cannot be broken down further) and lean on its serialization capabilities:

```rust
use serde::{Serialize, Deserialize};
use rust_decimal::Decimal;

#[derive(Reflect, Serialize, Deserialize, Clone)]
#[reflect(opaque)] // Tell Bevy not to look inside the plating
#[reflect(Serialize, Deserialize)] // Rely on Serde instead
struct ArmorPlating {
    thickness: Decimal,
}

```

## Exporting the Blueprint (Serialization)

Because `Reflect` maps out the physical shape of your data, Bevy can automatically serialize your mech's state into a text format called RON (Rusty Object Notation).

This is how saving and loading "Scenes" (or in our case, mech loadouts) works. You serialize a collection of entities and components to a file, and later deserialize them back into the hangar:

```rust
fn save_loadout(type_registry: Res<AppTypeRegistry>) {
    let pod = WeaponPod { ammo_type: "Railgun Slug".to_string(), heat_capacity: 120.5 };

    // Lock the registry to read type metadata
    let registry = type_registry.read();

    // Create a serializer using our object and the registry
    let serializer = ReflectSerializer::new(&pod, &registry);

    // Convert it to a beautiful, readable RON string blueprint
    let ron_string = ron::ser::to_string_pretty(&serializer, ron::ser::PrettyConfig::default()).unwrap();

    println!("Saved Blueprint:\n{}", ron_string);
}

```

## The True Engineering Feat: Reflecting Traits

Sometimes, dynamic property access is not enough. What if you have a collection of unknown hardware modules (`Box<dyn Reflect>`), and you want to trigger a firing sequence on them? Normally, in Rust, if you do not know the concrete type, you cannot invoke its specific traits.

Enter `#[reflect_trait]`.

This macro allows you to dynamically extract a trait implementation from a reflected object. It bypasses strict compile-time limitations, letting you execute commands dynamically:

```rust
// 1. Define your trait and add the reflection macro
#[reflect_trait]
trait Fireable {
    fn engage_target(&self) -> String;
}

// 2. Implement it for your struct, and register the trait in the struct's reflect macro
#[derive(Reflect)]
#[reflect(Fireable)]
struct PlasmaCannon {
    charge_level: String,
}

impl Fireable for PlasmaCannon {
    fn engage_target(&self) -> String {
        format!("Firing plasma at charge level: {}!", self.charge_level)
    }
}

// 3. Use it dynamically!
fn execute_firing_sequence(type_registry: Res<AppTypeRegistry>) {
    // We only know this is a `dyn Reflect`. We don't know it's a PlasmaCannon.
    let unknown_weapon: Box<dyn Reflect> = Box::new(PlasmaCannon {
        charge_level: "Maximum".to_string()
    });

    let registry = type_registry.read();

    // Look up the `Fireable` trait data for whatever type this happens to be
    let reflect_fireable = registry
        .get_type_data::<ReflectFireable>(*unknown_weapon.type_id())
        .unwrap();

    // Convert our unknown `&dyn Reflect` into a usable `&dyn Fireable`
    let active_weapon: &dyn Fireable = reflect_fireable.get(&*unknown_weapon).unwrap();

    // Engage the target!
    println!("{}", active_weapon.engage_target());
    // Output: Firing plasma at charge level: Maximum!
}

```

By mastering Bevy Reflection, you are no longer limited by compile-time strictness. You can build powerful modding tools, dynamic scene editors, and flexible loadout systems, all while keeping your mech's core logic perfectly safe and structurally sound.

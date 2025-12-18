---
title: Gizmos, Gizmos and even more Gizmos - A little introduction to Gizmos
date: 2026-07-06 03:29:00 +0200
category: "GameDev"
tags: [bevy, gizmos, rust]
---

When it comes to gamedev we usually have the problem that it is hard to visualize things in 3D (or even 2D) space, and because of the nature of this we can sometimes struggle with implementing things. How can you implement something that you have trouble with visualizing in your mind? Especially when regarding logic, math and physics? Gizmos help with visual debugging when you need it. In case you need to see where raycasts are hitting, visualize invisible trigger zones or check if your math for an arc generator is actually correct.

Bevy 0.19 brings a highly optimized and flexible gizmo system with it. It relies heavily on rigid math primitives like `Isometry2d` and `Isometry3d` to handle positioning and rotation, and introduces config groups so you can toggle different sets of debugging visuals independently.

Here is my (opinionated) guide on how to work with gizmos in Bevy.

## The Math Primer: What is an Isometry?

Before we start drawing shapes on the screen, we need to talk about how Bevy positions them. If you look at the gizmo API, you will see `Isometry2d` and `Isometry3d` everywhere.

An isometry is a mathematical concept that describes a transformation preserving distance. In practical game development terms, it is simply a combination of a position (translation) and a rotation. It explicitly excludes scaling. This is incredibly useful for gizmos because it allows you to place a shape exactly where you want it and rotate it without accidentally squishing or stretching the visual debug information.

When you want a shape at the world origin `(0, 0)` with no rotation, you pass `Isometry2d::IDENTITY`. If you need to move it, you can construct one using `Isometry2d::from_translation(Vec2::new(x, y))` or combine translation and rotation for more complex placements.

## Gizmos in 2D

To start drawing gizmos in 2D, you need to request the `Gizmos` system parameter. From there, you have access to a massive library of shape drawing functions.

Here is a full example showing how to draw lines, rays, basic shapes, and even complex shapes like arcs and grids.

```rust
use std::f32::consts::{FRAC_PI_2, PI};
use bevy::{color::palettes::css::*, math::Isometry2d, math::Rot2, prelude::*};

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(Update, (lines_and_rays, shapes, complex_shapes))
        .run();
}

fn setup(mut commands: Commands) {
    commands.spawn(Camera2d);
}

fn lines_and_rays(mut gizmos: Gizmos) {
    // A line drawn from point A to point B
    gizmos.line_2d(
        Vec2::ZERO,
        Vec2::new(100., 100.),
        Color::srgb(0.49, 0.49, 0.98),
    );

    // A ray drawn from a starting point along a direction vector
    gizmos.ray_2d(
        Vec2::ZERO,
        Vec2::new(-100., -100.),
        Color::srgb(0.29, 0.10, 0.98),
    );
}

fn shapes(mut gizmos: Gizmos) {
    gizmos.circle_2d(Isometry2d::IDENTITY, 50.0, Color::srgb(0.98, 0.49, 0.49));

    gizmos
        .rounded_rect_2d(
            Isometry2d::IDENTITY,
            Vec2::new(60., 60.),
            Color::srgb(0.49, 0.98, 0.49),
        )
        .corner_radius(15.);

    gizmos.rect_2d(
        Isometry2d::IDENTITY,
        Vec2::new(70., 60.),
        Color::srgb(0.99, 0.98, 0.49),
    );
}

fn complex_shapes(mut gizmos: Gizmos) {
    // Drawing partial circles using arcs
    gizmos.arc_2d(Isometry2d::IDENTITY, FRAC_PI_2, 85.0, ORANGE_RED);
    gizmos.arc_2d(Isometry2d::IDENTITY, FRAC_PI_2 * 2., 80.0, PURPLE);

    // Ellipses require a rotation, which we can provide via Rot2
    gizmos.ellipse_2d(Rot2::radians(PI), Vec2::new(100., 200.), YELLOW_GREEN);

    // Great for debugging tilemaps or spatial partitioning
    gizmos.grid_2d(
        Isometry2d::IDENTITY,
        UVec2 { x: 10, y: 10 },
        Vec2::new(10., 10.),
        Color::srgb(Color::srgb(0.76, 1.0, 0.5)),
    );
}

```

Notice how clean this is. You just ask for the `Gizmos` resource in your system, pick a shape, provide the math primitives, and specify a color. Because gizmos are drawn dynamically every frame, you do not have to worry about spawning or despawning entities just to get a debug line on your screen.

## Stepping into 3D

Taking these concepts into 3D is perfectly seamless. The core philosophy remains exactly the same. You still use the `Gizmos` system parameter. The only difference is that you switch out your 2D math types for 3D ones.

Instead of `Vec2`, you use `Vec3`. Instead of `Isometry2d`, you use `Isometry3d`. Then you drop the `_2d` suffix from the gizmo methods.

```rust
fn draw_3d_gizmos(mut gizmos: Gizmos) {
    // A 3D box located slightly above the origin
    let position = Isometry3d::from_translation(Vec3::new(0., 1., 0.));
    
    gizmos.cuboid(
        position,
        Vec3::new(2., 2., 2.),
        Color::srgb(0.8, 0.2, 0.2),
    );

    // A simple wireframe sphere
    gizmos.sphere(
        Isometry3d::IDENTITY,
        1.5,
        Color::srgb(0.2, 0.8, 0.2),
    );
}

```

## A Real World Example

Let us put this into perspective with a practical scenario. Imagine you are building a top-down shooter. You have an automated turret that sweeps back and forth looking for a target. You also have a specific trigger zone on the map. You want to visually confirm that your turret's line of sight is being calculated correctly and verify exactly where your trigger zone is located.

We can combine `ray_2d` and `rect_2d` to visualize this entire interaction.

```rust
fn debug_turret_aim(mut gizmos: Gizmos, time: Res<Time>) {
    let turret_pos = Vec2::new(-200.0, 0.0);
    
    let target_zone_center = Vec2::new(150.0, 50.0);
    let target_zone_size = Vec2::new(100.0, 100.0);

    // 1. Visualize the invisible trigger zone
    gizmos.rect_2d(
        Isometry2d::from_translation(target_zone_center),
        target_zone_size,
        Color::srgb(0.9, 0.1, 0.1),
    );

    // 2. Calculate a sweeping aim direction using the time elapsed
    let time_sin = time.elapsed_seconds().sin();
    let aim_direction = Vec2::new(1.0, time_sin).normalize();

    // 3. Draw a ray representing the turret's line of sight
    gizmos.ray_2d(
        turret_pos,
        aim_direction * 400.0,
        Color::srgb(0.1, 0.9, 0.1),
    );

    // 4. Mark the exact position of the turret
    gizmos.circle_2d(
        Isometry2d::from_translation(turret_pos),
        15.0,
        Color::srgb(0.2, 0.2, 0.9),
    );
}

```

By running this simple system alongside your game code, you get immediate, clear feedback on where objects exist in your world space. If your ray math is wrong, you will see the green line pointing in the wrong direction immediately.

## Organizing the Chaos: GizmoConfigStore and GizmoConfigGroup

Once your project grows, drawing everything through the default `Gizmos` parameter becomes a problem. You might have physics hitboxes, AI pathfinding nodes, and UI bounds all rendering at once. Your screen will quickly turn into an unreadable web of neon lines.

Bevy handles this by allowing you to categorize your gizmos using `GizmoConfigGroup`. A group is just a custom struct that you define.

```rust
#[derive(Default, Reflect, GizmoConfigGroup)]
struct PhysicsGizmos;

#[derive(Default, Reflect, GizmoConfigGroup)]
struct PathfindingGizmos;

```

Once you have defined a group, you must register it in your app configuration.

```rust
app.init_gizmo_group::<PhysicsGizmos>()
   .init_gizmo_group::<PathfindingGizmos>();

```

Now, instead of requesting the generic `Gizmos` parameter in your systems, you specify which group you want to draw to.

```rust
fn debug_physics(mut gizmos: Gizmos<PhysicsGizmos>) {
    gizmos.circle_2d(Isometry2d::IDENTITY, 50.0, RED);
}

```

The real power of this system comes from the `GizmoConfigStore`. This is a resource that holds the settings for every single config group in your game. By accessing this store, you can toggle groups on and off at runtime, change their default line width, or adjust how they render.

Here is an example of a system that toggles the visibility of the physics gizmos whenever the player presses the 'D' key.

```rust
fn toggle_debug_views(
    keys: Res<ButtonInput<KeyCode>>,
    mut store: ResMut<GizmoConfigStore>,
) {
    if keys.just_pressed(KeyCode::KeyD) {
        // We request mutable access to the PhysicsGizmos configuration
        let (config, _render_config) = store.config_mut::<PhysicsGizmos>();
        
        // Flip the enabled boolean
        config.enabled = !config.enabled;
    }
}

```

This setup keeps your code clean and your debugging environment entirely under your control. You can map different keys to different groups and only view the specific debug information you actually care about at any given moment.

Gizmos are a mandatory tool for keeping your sanity in check while building complex logic. With Bevy 0.19, the API is fast, explicit, and flexible enough to scale from a quick weekend game jam to a massive commercial project. Keep your math clean, group your visuals logically, and rely on the screen rather than your imagination when debugging.

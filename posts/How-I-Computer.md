---
title: How I computer 
date: 2025-08-03 16:43:00 +0200
category: "Misc"
tags: [nixos,linux,meta]
---

Like most people who stare at screens for a living, I have spent an unreasonable amount of time obsessing over my setup. I love seeing how other developers organize their workspaces, but I have reached a point where the core of my system is practically set in stone.

That being said, I need to make one thing clear: while my operating system and core applications are completely locked in, I have absolutely not settled down when it comes to the surface layer. I still constantly experiment with different window managers, terminal emulators, and UI tools. But the foundation? That stays the same. Here is where my setup currently stands.

## The Hardware

### The Main Rig: Quiet Over Flashy

I built my main desktop in a clean, white Thermaltake TR100 case. I do not care about flashy RGB lighting or showing off components. I want a quiet, highly capable machine. I do not game much, and I do not do heavy GPU compute workloads, so the graphics card is deliberately underpowered compared to the rest of the build.

More importantly, I exclusively run Linux. Dealing with proprietary Nvidia drivers is a headache I refuse to entertain, so going full AMD was the only logical choice.

* **OS**: NixOS 25.11
* **CPU**: AMD Ryzen 7 9700X
* **GPU**: AMD Radeon RX 7600
* **RAM**: Corsair Vengeance DDR5 64GB
* **PSU**: ASUS ROG Loki 850W Platinum
* **Motherboard**: ASUS ROG STRIX B650E-I
* **Cooler**: ARCTIC Liquid Freezer III Pro
* **Case**: Thermaltake TR100
* **Keyboard**: Keychron K6
* **Mouse**: Logitech MX Master 4
* **Monitor 1**: AOC Q3279VWF
* **Monitor 2**: Kamvas Pro 22
* **Camera**: Emeet C950 4K
* **Speakers**: Razer Leviathan V2 X
* **Headset**: SteelSeries Arctis Nova 1

### The Laptop: A Glorified Thin Client

I run a Lenovo IdeaPad 1 (15ALC7) with a Ryzen 5 5500U and 16GB of RAM. It is nothing special, and that is entirely the point. I rarely need heavy compute on the go, usually just when I am at a hackathon or traveling.

Because it runs NixOS via the exact same flake as my desktop (just with a slightly different hardware configuration entry), it feels identical to use. If I actually need raw power, I just remote into my desktop. Why spend premium laptop money when SSH exists?

### The Server

Unsurprisingly, the server also runs NixOS. Everything that can be a native NixOS module is configured as one. For isolation, I use systemd-nspawn containers natively supported by the OS. I still have a few stubborn Docker containers running, purely because I have not found the time or motivation to rewrite them into Nix modules yet.

### The Phone

I daily drive the Nothing Phone (3). I have been a fan since the original Phone (1) dropped in 2022. It is clean, minimal, and does not look like every other glass slab on the market. The only work-adjacent apps I keep on it are Termux and Slack.

## The Software Stack

### The Immutable Core vs. The Playground

I am completely all-in on NixOS. Getting into Linux seriously a couple of years ago was a game changer, and now I cannot picture using anything else. Switching to a declarative system basically eliminated the time I used to waste trying to replicate my environment across machines.

However, the UI layer is my playground. I use tiling window managers because I demand total control over my key bindings and layout. Currently, my daily driver is Sway paired with Waybar and Rofi, and my terminal of choice right now is Kitty. But next month? Who knows. I still actively hop between different software setups just to see what fits best.

### Development and Productivity

My actual development workflow is strictly terminal-based. No bloated IDEs. Just Neovim and Tmux. It is fast, lightweight, and gets out of my way.

For everything else, there is Firefox. I rely heavily on Firefox Multi-Account Containers to strictly separate my work and personal life. For documentation and brain-dumps, I use Obsidian. It is the perfect tool for storing information about technologies I only touch once or twice a month and cannot be bothered to memorize.

### Networking

Tailscale is the backbone of my personal network. It connects everything effortlessly. For general privacy and everyday outbound VPN routing, Mullvad is the default choice.

## Conclusion

Moving everything to a declarative NixOS ecosystem transformed my computing life. Instead of constantly putting out fires or trying to remember how I configured a specific tool three years ago, I have a reliable, reproducible foundation. It gives me the freedom to experiment with the fun stuff, like window managers and terminals, without ever breaking the core system.

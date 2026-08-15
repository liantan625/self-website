---
title: Building For Boring Systems
date: 2026-07-08
tags:
  - backend
  - systems
excerpt: Notes on why I increasingly prefer predictable systems over clever ones.
draft: false
---

The older I get, the less I care about code that looks impressive in a demo.

What usually matters is whether the system is understandable when something
goes wrong:

- Can someone trace a request through the stack without needing tribal knowledge?
- Are failures observable in a way that narrows the search space quickly?
- Does the data model make bad states hard to represent?

That bias is showing up more in the projects I enjoy. I still like shipping UI,
but I like it most when the surface area is backed by something dependable.

## What I optimize for

1. Clear ownership boundaries.
2. Instrumentation that answers the first debugging question.
3. Interfaces that are hard to misuse.

This is less glamorous than novelty, but usually more useful.

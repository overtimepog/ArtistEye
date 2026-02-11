---
name: procedural-gen
description: Get procedural generation patterns including noise, WFC, cellular automata, and L-systems
---

# /procedural-gen

## When to Use
When implementing procedural content generation - terrain, dungeons, vegetation, textures, or any algorithmic content creation.

## What It Does
1. Identifies the type of content to generate
2. Recommends appropriate algorithms
3. Provides seeded, deterministic implementations
4. Includes tunable parameters with recommended ranges
5. Ensures performance-friendly patterns

## Agent Delegation
Delegates to **creative-coder** (Sonnet) using `grid_calculator` and `easing_calculator` MCP tools.

## Output Format
- Algorithm name and explanation
- Tunable parameters with defaults and ranges
- Complete, commented implementation code
- Variations and tweaking suggestions

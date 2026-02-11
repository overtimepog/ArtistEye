---
name: pixel-art
description: Get guidance for pixel art creation including grid alignment, palettes, scaling, and sprite sheets
---

# /pixel-art

## When to Use
When creating pixel art assets, sprite sheets, or implementing pixel-perfect rendering in games.

## What It Does
1. Validates grid alignment and integer scaling
2. Recommends palette size and color ramps
3. Calculates sprite sheet dimensions and frame layout
4. Ensures nearest-neighbor filtering settings
5. Checks for common pixel art mistakes (sub-pixel movement, non-integer scaling)

## Agent Delegation
Delegates to **asset-crafter** (Sonnet) with pixel art specialization.

## Output Format
- Grid and scaling specifications
- Palette recommendation with hex colors
- Sprite sheet layout with dimensions
- Engine-specific rendering settings (filter mode, etc.)
- Common mistakes to avoid

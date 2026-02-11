---
name: asset-spec
description: Create detailed specifications for game assets including sprites, textures, and 3D models
---

# /asset-spec

## When to Use
When you need specifications for game art assets - sprite sheets, textures, pixel art, 3D models, or animation frames.

## What It Does
1. Determines asset type and requirements
2. Calculates dimensions, frame layouts, and technical specs
3. Applies pixel art rules (integer scaling, palette limits) if applicable
4. Provides engine-specific import settings via Context7

## Agent Delegation
Delegates to **asset-crafter** (Sonnet) for comprehensive asset specification.

## Output Format
- Asset type, dimensions, format, color mode
- Frame count and sprite sheet layout (for animations)
- Palette specification (for pixel art)
- Import settings for target engine
- Naming convention and pipeline notes

---
name: game-palette
description: Generate a game-appropriate color palette based on genre, mood, or base color
---

# /game-palette

## When to Use
When you need a cohesive color palette for a game project, including genre-specific colors, HUD colors, or accessible color combinations.

## What It Does
1. Takes genre, mood, and/or base color as input
2. Generates a 7-color palette (primary, secondary, accent, background, surface, text, muted)
3. Verifies contrast ratios for text readability
4. Provides usage guidance for game elements

## Agent Delegation
Delegates to **color-alchemist** (Haiku) using `color_palette_game` and `contrast_check` MCP tools.

## Output Format
- 7-color palette with hex codes and RGB values
- Contrast ratio matrix for all text/background combinations
- WCAG AA/AAA compliance status
- Usage recommendations for game elements

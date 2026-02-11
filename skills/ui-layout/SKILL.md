---
name: ui-layout
description: Design responsive game UI layouts for HUD, menus, inventory, and dialogue systems
---

# /ui-layout

## When to Use
When designing or implementing game UI - HUD elements, menu systems, inventory grids, dialogue boxes, or responsive layouts.

## What It Does
1. Analyzes UI requirements (HUD, menu, inventory, dialogue)
2. Calculates grid positions and spacing using MCP tools
3. Looks up engine-specific UI APIs via Context7
4. Produces a layout plan with responsive strategy

## Agent Delegation
Delegates to **game-ui-designer** (Sonnet) using `grid_calculator`, `spacing_scale`, and `contrast_check` MCP tools.

## Output Format
- ASCII layout visualization
- Spacing values and scale
- Responsive adaptation strategy
- Accessibility notes (contrast, touch targets)
- Engine-specific implementation code

---
name: animation-guide
description: Get easing curve recommendations and animation timing guidance for games
---

# /animation-guide

## When to Use
When implementing animations, tweens, easing, or timing systems in games.

## What It Does
1. Analyzes the animation requirements
2. Recommends appropriate easing curves
3. Provides value tables and code snippets via `easing_calculator`
4. Looks up engine-specific tween APIs via Context7
5. Ensures delta time usage for frame-rate independence

## Agent Delegation
Delegates to **animation-director** (Sonnet) using `easing_calculator` MCP tool.

## Output Format
- Animation plan with timing breakdown
- Easing curve recommendations with rationale
- Value table and code in target language
- Engine-specific implementation using verified APIs

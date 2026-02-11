---
name: spatial-check
description: Validate spatial logic, coordinate systems, and transform operations in game code
---

# /spatial-check

## When to Use
When you need to verify that game code uses correct coordinate systems, transform operations, and spatial reasoning for the target engine.

## What It Does
1. Detects the game engine/framework from code context
2. Looks up coordinate conventions using `coordinate_reference` MCP tool
3. Queries Context7 for framework-specific transform APIs
4. Traces all spatial operations in the code
5. Reports coordinate bugs and incorrect assumptions

## Agent Delegation
Delegates to **spatial-architect** (Opus, READ-ONLY) for thorough spatial analysis.

## Output Format
- Engine detection and coordinate system summary
- List of spatial operations found
- Issues with file:line references and fixes
- Recommendations for spatial correctness

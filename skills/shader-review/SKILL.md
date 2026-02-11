---
name: shader-review
description: Review shader code for coordinate space errors, UV issues, and optimization opportunities
---

# /shader-review

## When to Use
When writing or reviewing shader code - GLSL, HLSL, GDShader, ShaderLab, or any GPU shader language.

## What It Does
1. Identifies shader language and target engine
2. Validates UV coordinate usage (0-1 range)
3. Checks screen-space calculations
4. Verifies texture sampling correctness
5. Reviews math operations and color space handling

## Agent Delegation
Delegates to **shader-wizard** (Sonnet) with Context7 for engine-specific shader syntax.

## Output Format
- Shader language and engine detection
- Coordinate space analysis
- Issues with line references and corrections
- Performance optimization suggestions
- Corrected shader code

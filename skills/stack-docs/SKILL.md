---
name: stack-docs
description: Look up current game framework documentation using Context7
---

# /stack-docs

## When to Use
When you need current, accurate documentation for any game framework or library - API signatures, code examples, or version-specific information.

## What It Does
1. Takes a framework name and question
2. Resolves the library in Context7
3. Queries the documentation with your specific question
4. Returns current API reference and code examples

## Agent Delegation
Delegates to **framework-researcher** (Haiku, READ-ONLY) - a Context7 specialist.

## Output Format
- Framework name and version
- Relevant API methods and signatures
- Working code examples from documentation
- Version notes and deprecation warnings

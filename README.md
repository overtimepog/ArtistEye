# ArtistEye v1.0

A Claude Code plugin that makes Claude spatially aware for game development. Prevents coordinate system confusion, incorrect proportions, stiff animations, poor color accessibility, and shader UV errors across 15 game engines.

## What It Does

- **Coordinate System Awareness** — Knows the origin, Y-direction, rotation units, and forward direction for 15 engines (Love2D, Godot, Unity, Pygame, Three.js, Phaser, Roblox, Blender, Unreal, and more)
- **Auto-Detection** — Detects your game engine from project files and injects relevant spatial context every session
- **Keyword Activation** — Recognizes 150+ game-dev keywords across 10 categories and provides targeted reminders
- **Color Tools** — Genre-specific palettes, color harmony generation, and WCAG contrast checking
- **Animation** — 31 easing curves with code snippets in JavaScript, Lua, GDScript, C#, and Python
- **Grid Math** — Orthogonal, isometric, and hexagonal coordinate calculations
- **Framework Docs** — Context7 integration for real-time API lookups (never hallucinate framework APIs)
- **10 Specialized Agents** — From spatial validation (Opus) to fast palette generation (Haiku)
- **10 Slash Commands** — `/spatial-check`, `/game-palette`, `/ui-layout`, `/shader-review`, and more

## Install

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Node.js 18+

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Overtimepog/artisteye.git

# 2. Install dependencies
cd artisteye
npm install

# 3. Install as a Claude Code plugin
claude plugin add /path/to/artisteye
```

Replace `/path/to/artisteye` with the actual path where you cloned the repo.

### Verify Installation

Start a new Claude Code session. You should see:

```
[ArtistEye] Game Dev Art Assistant Active
```

If you're in a project with a game engine (e.g., a directory with `project.godot` or `conf.lua`), it will also show the detected engine and its coordinate conventions.

## Usage

### Slash Commands

| Command | Description |
|---------|-------------|
| `/spatial-check` | Validate coordinate systems and transforms in your code |
| `/game-palette` | Generate a color palette for your game's genre/mood |
| `/ui-layout` | Design responsive game UI (HUD, menus, inventory) |
| `/asset-spec` | Create sprite/texture/3D model specifications |
| `/shader-review` | Review shader code for UV and coordinate errors |
| `/animation-guide` | Get easing recommendations with code snippets |
| `/stack-docs` | Look up current framework docs via Context7 |
| `/art-critique` | Get artistic review of your game visuals |
| `/pixel-art` | Pixel art guidance (grid alignment, palettes, scaling) |
| `/procedural-gen` | Procedural generation patterns and algorithms |

### MCP Tools

These tools are available to Claude automatically during any session:

| Tool | Description |
|------|-------------|
| `coordinate_reference` | Look up any engine's coordinate system |
| `color_palette_game` | Generate palettes by genre or color harmony |
| `contrast_check` | WCAG contrast ratio checking |
| `grid_calculator` | Orthogonal/isometric/hex grid math |
| `easing_calculator` | Easing curves with multi-language code |
| `spacing_scale` | Typographic spacing scales |

### Automatic Features

- **Session Start**: Scans your project for engine markers and loads coordinate context
- **Keyword Detection**: When your prompt mentions game-dev topics, relevant spatial/artistic reminders are injected
- **Write Enrichment**: When writing `.lua`, `.gd`, `.cs`, `.glsl`, `.hlsl`, or `.py` files, coordinate system reminders for the relevant engine are added

## Supported Engines

| Engine | Origin | Y-Direction | Rotation |
|--------|--------|-------------|----------|
| Love2D | Top-left | Down | Radians, CW |
| Godot 2D | Top-left | Down | Radians, CW |
| Godot 3D | Center | Up | Radians, CCW |
| Unity 2D | Center | Up | Degrees, CCW |
| Unity 3D | Center | Up | Degrees, LH |
| Pygame | Top-left | Down | Degrees, CCW |
| HTML5 Canvas | Top-left | Down | Radians, CW |
| Three.js | Center | Up | Radians, CCW |
| Phaser 3 | Top-left | Down | Radians, CW |
| Roblox | Center | Up | Degrees |
| Blender | Center | Up (Z-up) | Radians, CCW |
| Defold | Bottom-left | Up | Degrees, CCW |
| Raylib | Top-left (2D) | Down (2D) | Degrees, CW |
| PixiJS | Top-left | Down | Radians, CW |
| Unreal | Center | Up (Z-up) | Degrees, LH |

## Agents

| Agent | Tier | Role |
|-------|------|------|
| spatial-architect | Opus | Coordinate system validation (read-only) |
| art-director | Opus | Artistic critique and review (read-only) |
| game-ui-designer | Sonnet | HUD, menus, inventory layout |
| asset-crafter | Sonnet | Sprites, textures, 3D model specs |
| shader-wizard | Sonnet | Shader code and VFX |
| animation-director | Sonnet | Easing, tweens, timing |
| creative-coder | Sonnet | Procedural generation algorithms |
| color-alchemist | Haiku | Fast palette generation |
| typography-scout | Haiku | Font pairing recommendations |
| framework-researcher | Haiku | Context7 documentation lookup (read-only) |

## Project Structure

```
artisteye/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── .mcp.json                # MCP server config
├── CLAUDE.md                # Knowledge base (injected every session)
├── package.json
├── agents/                  # 10 specialized agents
│   ├── spatial-architect.md
│   ├── art-director.md
│   ├── game-ui-designer.md
│   ├── asset-crafter.md
│   ├── shader-wizard.md
│   ├── animation-director.md
│   ├── creative-coder.md
│   ├── color-alchemist.md
│   ├── typography-scout.md
│   └── framework-researcher.md
├── bridge/
│   └── mcp-server.cjs       # MCP server (6 tools)
├── data/
│   ├── engine-coordinates.json  # 15 engines
│   ├── easing-curves.json       # 31 curves
│   ├── genre-palettes.json      # 12 genres
│   └── font-pairings.json       # 31 pairings
├── hooks/
│   └── hooks.json            # Hook registration
├── scripts/
│   ├── keyword-detector.mjs  # 150+ keyword detection
│   ├── session-context.mjs   # Engine auto-detection
│   └── write-enricher.mjs    # Spatial write reminders
└── skills/                   # 10 slash commands
    ├── spatial-check/
    ├── game-palette/
    ├── ui-layout/
    ├── asset-spec/
    ├── shader-review/
    ├── animation-guide/
    ├── stack-docs/
    ├── art-critique/
    ├── pixel-art/
    └── procedural-gen/
```

## License

MIT

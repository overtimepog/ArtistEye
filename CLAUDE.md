# ArtistEye - Game Dev Art Knowledge Base

This knowledge base is automatically injected into every Claude Code session. It provides essential game development art knowledge to prevent common spatial, visual, and technical mistakes.

---

## 1. Coordinate Systems

**CRITICAL RULE: ALWAYS verify the engine's coordinate system before generating ANY positioning, rotation, or transform code.**

| Engine | Origin | Y-Direction | Rotation | Units |
|--------|--------|-------------|----------|-------|
| Love2D | Top-left | Down | Radians, CW | Pixels |
| Godot 2D | Top-left | Down | Radians, CW | Pixels |
| Godot 3D | Center | Up | Radians, CCW (RH) | Meters |
| Unity 2D | Center | Up | Degrees, CCW | Units (100px) |
| Unity 3D | Center | Up | Degrees, LH | Meters |
| Pygame | Top-left | Down | Degrees, CCW | Pixels |
| Canvas | Top-left | Down | Radians, CW | CSS Pixels |
| Three.js | Center | Up | Radians, CCW (RH) | Arbitrary |
| Phaser 3 | Top-left | Down | Radians, CW | Pixels |
| Roblox | Center | Up | Degrees | Studs |
| Blender | Center | Up (Z-up) | Radians, CCW (RH) | Meters |
| Defold | Bottom-left | Up | Degrees, CCW | Pixels |
| Raylib 2D | Top-left | Down | Degrees, CW | Pixels |
| PixiJS | Top-left | Down | Radians, CW | Pixels |
| Unreal | Center | Up (Z-up) | Degrees, LH | Centimeters |

### Key Coordinate Traps
- **Y-down vs Y-up**: Love2D/Godot2D/Pygame/Canvas/Phaser use Y-down. Unity/Three.js/Roblox use Y-up. Mixing these is the #1 spatial bug.
- **Z-up engines**: Blender and Unreal use Z-up. Exporting to Y-up engines requires axis conversion.
- **Forward direction**: Unity (+Z), Godot 3D (-Z), Three.js (-Z), Unreal (+X), Blender (-Y). Never assume.
- **Rotation units**: Love2D/Canvas/Three.js use radians. Unity/Roblox/Unreal use degrees. Always check.
- **Left vs Right-handed**: Unity/Unreal are left-handed. Godot/Three.js/Blender are right-handed. Cross products differ.

### Pre-Code Checklist
Before writing ANY spatial code, answer:
1. What engine/framework is being used?
2. Where is the coordinate origin?
3. Which direction does Y increase?
4. What units are rotations in?
5. What is the forward direction (3D)?

Use the `coordinate_reference` MCP tool for quick lookups.

---

## 2. Color Theory for Games

### The 60-30-10 Rule
- **60%** Background/environment - sets the mood
- **30%** Secondary elements - supports the primary
- **10%** Accent color - draws attention (health drops, interactive items, alerts)

### Genre Color Guidelines
- **Horror**: Desaturated, dark. Red accents for danger. Avoid bright colors.
- **Action**: High contrast, saturated. Orange/red for energy. Gold for rewards.
- **RPG**: Rich purples, deep blues. Gold accents for lore items. Varied biome palettes.
- **Puzzle**: Clean, distinct colors. High contrast between interactive and static elements.
- **Platformer**: Bright, cheerful primaries. Clear foreground/background separation.
- **Sci-fi**: Cyan, magenta, electric blue. Neon accents on dark backgrounds.
- **Horror**: Low saturation base with occasional high-saturation shock colors.

### HUD Color Rules
- **Minimum contrast ratio**: 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- **Health**: Red/green spectrum (provide alternate indicators for colorblind users)
- **Mana/Energy**: Blue/purple
- **Warning/Danger**: Red + animation (don't rely on color alone)
- **Interactive elements**: Must visually stand out from decorative elements

### Color Psychology in Games
- **Red**: Danger, urgency, health, fire, enemy
- **Blue**: Calm, water, mana, ice, safe zones
- **Green**: Nature, health, poison, go/safe
- **Gold/Yellow**: Reward, treasure, warning, energy
- **Purple**: Magic, mystery, rare/legendary items

Use the `color_palette_game` and `contrast_check` MCP tools.

---

## 3. Game UI Patterns

### HUD Design
- **Critical info in corners**: Health (top-left), minimap (top-right), abilities (bottom-center), inventory (bottom-right)
- **Center screen = gameplay**: Keep HUD elements at edges; center is for action
- **Consistency**: Once placed, HUD elements should NOT move between screens
- **Opacity**: Consider semi-transparent HUD for immersive games

### Menu Design
- **Max 8-10 items** per menu level - more causes decision fatigue
- **Visual hierarchy**: Selected item must be immediately obvious
- **Navigation**: Support both mouse/touch AND keyboard/gamepad
- **Back button**: ALWAYS provide a way to go back
- **Confirmation**: Destructive actions (delete save, quit) need confirmation dialogs

### Inventory Systems
- **Grid-based**: Clear cell borders, hover states, drag-and-drop feedback
- **Categories**: Tabs or filters for item types (weapons, armor, consumables)
- **Item comparison**: Show stat differences when hovering equipped vs new
- **Stack display**: Number overlay for stackable items (bottom-right corner)

### Responsive Game UI
- **Use relative units** (percentages, viewport fractions) not absolute pixels
- **Anchor points**: Anchor HUD to screen edges, not absolute positions
- **Safe zones**: Keep critical info away from screen edges (TV overscan, notches)
- **Scale testing**: Test at minimum and maximum supported resolutions
- **Touch targets**: Minimum 44x44 pixels for mobile touch targets

Use the `grid_calculator` and `spacing_scale` MCP tools.

---

## 4. Animation & Easing

### The Cardinal Rule
**Linear interpolation looks robotic.** Almost every game animation should use easing.

### Common Easing Applications
- **UI elements appearing**: `easeOutBack` (slight overshoot feels snappy)
- **UI elements disappearing**: `easeInQuad` (accelerate away)
- **Camera movement**: `easeInOutCubic` (smooth start and stop)
- **Bouncing objects**: `easeOutBounce` (natural bounce decay)
- **Elastic UI**: `easeOutElastic` (springy, playful feel)
- **Score counting**: `easeOutExpo` (fast start, slow finish for dramatic reveal)
- **Character acceleration**: `easeInQuad` (gradual speed increase)
- **Damage numbers**: `easeOutQuart` (fast pop, slow settle)

### Delta Time
**MANDATORY for all time-based animation.** Never use fixed increments.
```
position += velocity * deltaTime  // CORRECT
position += velocity * (1/60)     // WRONG - assumes 60fps
```

### Sprite Animation Math
```
currentFrame = floor(elapsedTime * framesPerSecond) % totalFrames
sourceX = currentFrame * frameWidth
```

### Animation Principles for Games
1. **Anticipation**: Wind-up before action (jump squat before jump)
2. **Follow-through**: Continue past target then settle (sword swing overshoot)
3. **Squash & stretch**: Exaggerate deformation (ball bouncing, character landing)
4. **Timing**: Fast = snappy/powerful, slow = heavy/dramatic

Use the `easing_calculator` MCP tool.

---

## 5. Pixel Art

### Grid Alignment
- **Every element must align to the pixel grid** - no sub-pixel positioning
- **Integer coordinates only**: `position = floor(position)` or `round(position)`
- **Camera position**: Also must be integer to prevent shimmer

### Scaling Rules
- **Integer scaling ONLY**: 1x, 2x, 3x, 4x. Never 1.5x or 2.7x
- **Nearest-neighbor filtering**: ALWAYS use nearest-neighbor (point) sampling
- **texture_filter = "nearest"** in Love2D, Godot, etc.
- **Anti-aliasing OFF** for pixel art rendering

### Palette Discipline
- **Limit palette size**: 4 colors (Game Boy), 16 (NES), 32 (typical indie)
- **Consistent palette**: All sprites should share the same palette
- **Ramps**: Create color ramps (light to dark) for shading consistency
- **Hue shifting**: Shift hue slightly in shadows (toward blue/purple) and highlights (toward yellow)

### Sprite Sheet Layout
- **Consistent frame size**: All frames same dimensions (e.g., 32x32)
- **Power of 2 sheet**: Total sheet should be power-of-2 (256x256, 512x512)
- **1px padding**: Add 1px transparent padding between frames to prevent bleed
- **Document frame order**: Left-to-right, top-to-bottom

### Common Pixel Art Mistakes
- Sub-pixel movement causing shimmer
- Non-integer scaling causing blurry pixels
- Bilinear/trilinear filtering on pixel art textures
- Mixed pixel densities (big pixels next to small pixels)
- Outlines at inconsistent thickness

---

## 6. 3D Art Guidelines

### Topology
- **Edge loops at joints**: Elbow, knee, shoulder, neck need sufficient geometry for deformation
- **Quads over tris**: Prefer quad-based topology for deformation; tris for static objects
- **Even distribution**: Avoid extreme polygon density variation across a mesh
- **Silhouette check**: Model should read well as a solid silhouette

### Level of Detail (LOD)
- **LOD0**: Full detail (close-up). 100% poly count
- **LOD1**: Medium distance. ~50% poly count
- **LOD2**: Far distance. ~25% poly count
- **LOD3**: Very far. ~10% or billboard
- **Transition distance**: Based on screen-space size, not world distance

### UV Mapping
- **Padding**: Minimum 2-4px padding between UV islands (prevents bleeding at mipmaps)
- **Texel density**: Consistent pixels-per-unit across the model
- **Straighten edges**: Align UV edges to texture axes where possible
- **Minimize stretching**: Check UV stretch visualization

### Rigging
- **Bone placement**: At anatomical joint centers (not surface)
- **Weight painting**: Smooth falloff between bones, no hard edges
- **Root bone**: Always at ground level, centered
- **Naming convention**: L_/R_ prefix or .L/.R suffix for mirroring

---

## 7. Typography in Games

### Readability First
- **Minimum body text**: 16px at 1080p, scale proportionally
- **Line height**: 1.4-1.6x font size for body text
- **Contrast**: Verify with contrast_check tool - minimum 4.5:1 ratio
- **Text shadows/outlines**: Use on text over variable backgrounds (gameplay HUD)

### SDF Fonts
- **Use Signed Distance Field fonts** for text that needs to scale smoothly
- **Advantages**: Crisp at any size, outlines/shadows/glow in shader
- **When NOT to use**: Pixel art games (use bitmap fonts instead)

### Type Hierarchy
- **Title**: 2-3x body size, bold/display weight
- **Heading**: 1.5-2x body size, semi-bold
- **Body**: Base size, regular weight
- **Caption/Label**: 0.8x body size, may be lighter
- **Damage numbers**: Bold, high contrast, animated scale

### Font Selection Guidelines
- **Pixel games**: Press Start 2P, VT323, Silkscreen
- **Fantasy/RPG**: Cinzel, MedievalSharp, Almendra
- **Sci-fi**: Orbitron, Rajdhani, Audiowide
- **Clean UI**: Inter, Nunito, Poppins, Roboto
- **Horror**: Creepster, Nosifer, Special Elite
- **Comic/Casual**: Bangers, Comic Neue, Fredoka One

---

## 8. Shader Fundamentals

### UV Coordinate Space
- **UV range**: (0,0) to (1,1) - bottom-left to top-right in most engines
- **Texture sampling**: `texture(sampler, uv)` - uv must be 0-1 normalized
- **Screen UV**: `fragCoord / resolution` for screen-space effects
- **Tiling**: `fract(uv * tileCount)` for repeating patterns

### Fragment vs Vertex
- **Vertex shader**: Transform positions, pass data to fragment. Runs per-vertex.
- **Fragment shader**: Calculate pixel color. Runs per-pixel. More expensive.
- **Rule of thumb**: Expensive math in vertex shader, visual detail in fragment

### Common Shader Patterns
```glsl
// Screen-space UV
vec2 uv = fragCoord / iResolution.xy;

// Centered UV (-1 to 1)
vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

// Distance from center
float d = length(uv);

// Rotation
vec2 rotated = vec2(uv.x * cos(a) - uv.y * sin(a),
                     uv.x * sin(a) + uv.y * cos(a));

// Smooth step for anti-aliased shapes
float circle = smoothstep(radius + fwidth(d), radius - fwidth(d), d);
```

### Pixel Art Shader Rules
- **Nearest-neighbor ONLY**: Set texture filter to nearest/point
- **No mipmapping**: Disable mipmaps for pixel art textures
- **Integer UV math**: When calculating sprite frames, use integer math then convert

---

## 9. Asset Pipeline

### Naming Conventions
- `UI_*` - User interface elements (UI_Button_Play.png)
- `VFX_*` - Visual effects (VFX_Explosion_01.png)
- `CHR_*` - Characters (CHR_Player_Idle.png)
- `ENV_*` - Environment (ENV_Tree_Oak.png)
- `TIL_*` - Tiles (TIL_Grass_01.png)
- `ICO_*` - Icons (ICO_Sword_Rare.png)
- `SFX_*` - Sound effects (SFX_Jump.wav)
- `BGM_*` - Background music (BGM_Forest.ogg)

### Texture Sizes
- **Power of 2**: 32, 64, 128, 256, 512, 1024, 2048, 4096
- **Non-power-of-2**: Supported by modern GPUs but wastes VRAM on some platforms
- **Mobile**: Max 2048x2048 for broad compatibility
- **Sprite sheets**: Pack into power-of-2 atlas (TexturePacker, ShoeBox)

### Import Settings by Engine
- **Love2D**: Set `image:setFilter("nearest", "nearest")` for pixel art
- **Godot**: Import as 2D Pixel preset, disable filter/mipmaps
- **Unity**: Filter Mode = Point, Compression = None for pixel art; Max Size per platform
- **Phaser**: Set `pixelArt: true` in game config
- **Roblox**: Upload via Asset Manager, ImageLabel for UI

---

## 10. Using Context7 for Framework Documentation

### CRITICAL WORKFLOW
**Before implementing ANY framework-specific code:**

1. **Resolve the library**: Use `mcp__Context7__resolve-library-id` with the framework name
2. **Query documentation**: Use `mcp__Context7__query-docs` with your specific question
3. **Verify API signatures**: Never guess at method names, parameters, or return types
4. **Check version differences**: APIs change between versions - Context7 has current docs

### Common Lookups
- "How to create a tween/animation in [engine]"
- "Coordinate system and transform API in [engine]"
- "Input handling for [engine]"
- "Sprite/texture loading in [engine]"
- "Collision detection in [engine]"
- "UI system in [engine]"

### Why This Matters
Framework APIs are the #1 source of hallucinated code. A method that exists in Unity might not exist in Godot, or might have different parameters. Context7 provides real-time documentation lookup to prevent these errors.

Example workflow:
```
1. User asks: "Create a tween in Godot 4"
2. resolve-library-id("godot") -> get library ID
3. query-docs(libraryId, "create tween animation Godot 4") -> get actual API
4. Use REAL API: create_tween().tween_property(...)
   NOT hallucinated: Tween.new() (that's Godot 3!)
```

---

## 11. Spatial Awareness Checklist

**Run through this checklist before generating ANY game art code:**

- [ ] **Engine identified?** What framework/engine is the code for?
- [ ] **Origin point?** Where is (0,0)? Top-left, center, or bottom-left?
- [ ] **Y-direction?** Does Y increase upward or downward?
- [ ] **Rotation units?** Radians or degrees? CW or CCW?
- [ ] **Forward direction?** (3D only) +Z, -Z, +X, or -Y?
- [ ] **Coordinate system handedness?** (3D only) Left or right-handed?
- [ ] **Integer positions needed?** (Pixel art) Are all positions snapped to grid?
- [ ] **Delta time used?** Is animation frame-rate independent?
- [ ] **Scaling correct?** (Pixel art) Integer scaling only? Nearest-neighbor filter?
- [ ] **UV space correct?** (Shaders) 0-1 range? Proper screen-space calculation?
- [ ] **API verified?** Used Context7 to check framework-specific API signatures?

**If you cannot answer these questions, STOP and investigate before writing code.**

---

*ArtistEye v2.0 - Making Claude spatially aware for game development*

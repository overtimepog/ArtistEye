#!/usr/bin/env node

/**
 * ArtistEye Keyword Detector
 * Hook: UserPromptSubmit
 * Detects game-dev art keywords in user prompts and injects context.
 */

const CATEGORIES = {
  'coordinate_spatial': {
    label: 'Coordinate/Spatial',
    keywords: [
      'coordinate', 'transform', 'position', 'origin', 'viewport', 'camera',
      'isometric', 'hexagonal', 'tilemap', 'grid', 'world space', 'screen space',
      'projection', 'perspective', 'orthographic', 'parallax', 'scrolling',
      'local space', 'global position', 'world position', 'screen position'
    ]
  },
  'sprites_assets': {
    label: 'Sprites/Assets',
    keywords: [
      'sprite', 'spritesheet', 'sprite sheet', 'texture', 'tileset', 'pixel art',
      'animation frame', 'walk cycle', 'character sprite', 'atlas', 'tile', 'asset',
      'texture atlas', 'sprite animation', 'idle animation', 'run cycle',
      'sprite batch', 'texture pack'
    ]
  },
  'game_ui': {
    label: 'Game UI',
    keywords: [
      'hud', 'health bar', 'inventory', 'menu', 'dialogue box', 'minimap',
      'score', 'tooltip', 'button', 'panel', 'progress bar', 'crosshair',
      'game ui', 'game interface', 'hotbar', 'ability bar', 'mana bar',
      'stamina bar', 'level select', 'pause menu', 'settings menu'
    ]
  },
  'shaders_vfx': {
    label: 'Shaders/VFX',
    keywords: [
      'shader', 'glsl', 'hlsl', 'fragment', 'vertex', ' uv ', 'uv map',
      'post process', 'bloom', 'particle', 'vfx', 'normal map', 'pbr',
      'emission', 'glow', 'screen effect', 'visual effect', 'gdshader',
      'shaderlab', 'compute shader', 'ray march'
    ]
  },
  'animation': {
    label: 'Animation',
    keywords: [
      'easing', 'tween', 'lerp', 'interpolat', 'ease in', 'ease out',
      'delta time', 'keyframe', 'animation curve', 'spring', 'bounce',
      'animation state', 'blend tree', 'transition', 'squash', 'stretch',
      'anticipation', 'follow through', 'ease back', 'elastic'
    ]
  },
  'color_palette': {
    label: 'Color/Palette',
    keywords: [
      'color palette', 'game color', 'genre palette', 'mood', 'contrast ratio',
      'accessibility', 'saturation', 'hue', 'complementary', 'color scheme',
      'color theory', 'warm color', 'cool color', 'palette generat',
      'color harmon', 'triadic', 'analogous', 'monochromatic'
    ]
  },
  'typography': {
    label: 'Typography',
    keywords: [
      'game font', 'pixel font', 'bitmap font', 'sdf font', 'damage number',
      'floating text', 'typeface', 'font pair', 'font size', 'text render',
      'font atlas', 'signed distance field', 'game text', 'ui font'
    ]
  },
  'art_3d': {
    label: '3D Art',
    keywords: [
      '3d model', 'mesh', 'topology', 'rigging', 'bone', 'uv unwrap',
      'lod', 'normal map', 'bake', 'sculpt', 'weight paint', 'polygon',
      'quad', 'vertex', 'edge loop', 'retopology', 'low poly', 'high poly',
      'pbr material', 'texel density'
    ]
  },
  'procedural': {
    label: 'Procedural',
    keywords: [
      'procedural', 'procgen', 'perlin', 'simplex', 'noise', 'wave function',
      'cellular automata', 'l-system', 'fractal', 'voronoi', 'random gen',
      'world gen', 'terrain gen', 'dungeon gen', 'level gen', 'seed',
      'deterministic', 'marching'
    ]
  },
  'framework': {
    label: 'Framework',
    keywords: [
      'love2d', 'löve', 'godot', 'unity', 'pygame', 'phaser', 'three.js',
      'threejs', 'roblox', 'defold', 'raylib', 'pixi', 'pixijs', 'canvas',
      'webgl', 'monogame', 'sdl', 'bevy', 'macroquad', 'gamemaker',
      'construct', 'rpg maker', 'renpy', 'ren\'py'
    ]
  }
};

function sanitizePrompt(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<[^>]+>/g, ' ')                    // Strip XML tags
    .replace(/https?:\/\/[^\s]+/g, ' ')          // Strip URLs
    .replace(/```[\s\S]*?```/g, ' ')             // Strip code blocks
    .replace(/`[^`]+`/g, ' ')                    // Strip inline code
    .replace(/\/[\w./\\-]+\.\w+/g, ' ')          // Strip file paths
    .replace(/[{}[\]()]/g, ' ')                  // Strip brackets
    .toLowerCase();
}

function detectKeywords(prompt) {
  const sanitized = sanitizePrompt(prompt);
  const matched = {};

  for (const [catId, category] of Object.entries(CATEGORIES)) {
    const found = category.keywords.filter(kw => sanitized.includes(kw));
    if (found.length > 0) {
      matched[catId] = {
        label: category.label,
        count: found.length,
        keywords: found
      };
    }
  }

  return matched;
}

function buildContext(matched) {
  const categories = Object.values(matched).map(m => m.label);
  const lines = [];

  lines.push(`[ArtistEye] Detected game art context: ${categories.join(', ')}`);
  lines.push('');

  if (matched.coordinate_spatial) {
    lines.push('SPATIAL REMINDER: Verify the engine\'s coordinate system (origin, Y-direction, rotation units) before writing positioning code. Use the `coordinate_reference` MCP tool.');
  }

  if (matched.shaders_vfx) {
    lines.push('SHADER REMINDER: UV coordinates are 0-1 range. Verify screen-space calculations. Use nearest-neighbor filtering for pixel art textures.');
  }

  if (matched.animation) {
    lines.push('ANIMATION REMINDER: Use easing (not linear). Always use delta time for frame-rate independence. Use the `easing_calculator` MCP tool.');
  }

  if (matched.sprites_assets) {
    lines.push('ASSET REMINDER: Pixel art needs integer scaling, nearest-neighbor filtering, grid-aligned positions. Power-of-2 sprite sheets.');
  }

  if (matched.color_palette) {
    lines.push('COLOR REMINDER: Follow the 60-30-10 rule. Verify HUD text contrast (min 4.5:1). Use `color_palette_game` and `contrast_check` MCP tools.');
  }

  if (matched.game_ui) {
    lines.push('UI REMINDER: Critical info in corners, center = gameplay. Max 8-10 menu items. Use relative units for responsive design. 44px min touch targets.');
  }

  if (matched.framework) {
    lines.push('');
    lines.push('FRAMEWORK DETECTED: Use Context7 (`mcp__Context7__resolve-library-id` + `mcp__Context7__query-docs`) to verify framework-specific APIs before implementing. Never guess at API signatures.');
  }

  return lines.join('\n');
}

async function main() {
  let input = '';

  try {
    // Read stdin with timeout
    const chunks = [];
    const timeoutMs = 3000;

    await Promise.race([
      new Promise((resolve) => {
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', chunk => chunks.push(chunk));
        process.stdin.on('end', () => {
          input = chunks.join('');
          resolve();
        });
      }),
      new Promise((resolve) => setTimeout(() => {
        input = chunks.join('');
        resolve();
      }, timeoutMs))
    ]);
  } catch {
    // If stdin reading fails, continue with empty input
  }

  // Parse input
  let prompt = '';
  try {
    const data = JSON.parse(input || '{}');
    // Handle both direct prompt and nested structures
    prompt = data.prompt || data.message || data.content || '';
    if (typeof prompt !== 'string') prompt = JSON.stringify(prompt);
  } catch {
    prompt = input || '';
  }

  // Detect keywords
  const matched = detectKeywords(prompt);
  const hasMatches = Object.keys(matched).length > 0;

  // Output result
  const result = {
    continue: true
  };

  if (hasMatches) {
    result.hookSpecificOutput = {
      suppressOutput: false,
      message: buildContext(matched)
    };
  }

  process.stdout.write(JSON.stringify(result));
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ continue: true }));
});

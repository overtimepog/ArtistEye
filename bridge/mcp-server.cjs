#!/usr/bin/env node
'use strict';

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const path = require('path');
const fs = require('fs');

// Load data files
const dataDir = path.join(__dirname, '..', 'data');
const engineCoordinates = JSON.parse(fs.readFileSync(path.join(dataDir, 'engine-coordinates.json'), 'utf8'));
const easingCurves = JSON.parse(fs.readFileSync(path.join(dataDir, 'easing-curves.json'), 'utf8'));
const genrePalettes = JSON.parse(fs.readFileSync(path.join(dataDir, 'genre-palettes.json'), 'utf8'));

// ============ Color Math Utilities ============

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  const l1 = relativeLuminance(c1.r, c1.g, c1.b);
  const l2 = relativeLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function generateHarmony(baseHex, harmonyType) {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];

  const makeColor = (h, s, l) => {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));
    const c = hslToRgb(h, s, l);
    return { hex: rgbToHex(c.r, c.g, c.b), rgb: c, hsl: { h, s, l } };
  };

  switch (harmonyType) {
    case 'complementary':
      colors.push(makeColor(hsl.h, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 180, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h, hsl.s * 0.6, hsl.l + 20));
      colors.push(makeColor(hsl.h + 180, hsl.s * 0.6, hsl.l + 20));
      colors.push(makeColor(hsl.h, hsl.s * 0.3, 10));
      colors.push(makeColor(hsl.h, hsl.s * 0.3, 15));
      colors.push(makeColor(hsl.h, hsl.s * 0.1, 90));
      break;
    case 'analogous':
      colors.push(makeColor(hsl.h, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 30, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h - 30, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 60, hsl.s * 0.7, hsl.l));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 8));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 15));
      colors.push(makeColor(hsl.h, hsl.s * 0.1, 90));
      break;
    case 'triadic':
      colors.push(makeColor(hsl.h, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 120, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 240, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 60, hsl.s * 0.5, hsl.l));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 8));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 15));
      colors.push(makeColor(hsl.h, hsl.s * 0.1, 90));
      break;
    case 'split-complementary':
      colors.push(makeColor(hsl.h, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 150, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 210, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 180, hsl.s * 0.5, hsl.l + 15));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 8));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 15));
      colors.push(makeColor(hsl.h, hsl.s * 0.1, 90));
      break;
    case 'tetradic':
      colors.push(makeColor(hsl.h, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 90, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 180, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h + 270, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 8));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 15));
      colors.push(makeColor(hsl.h, hsl.s * 0.1, 90));
      break;
    case 'monochromatic':
      colors.push(makeColor(hsl.h, hsl.s, hsl.l));
      colors.push(makeColor(hsl.h, hsl.s * 0.8, hsl.l - 15));
      colors.push(makeColor(hsl.h, hsl.s * 1.2, hsl.l + 20));
      colors.push(makeColor(hsl.h, hsl.s * 0.5, hsl.l + 30));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 8));
      colors.push(makeColor(hsl.h, hsl.s * 0.2, 15));
      colors.push(makeColor(hsl.h, hsl.s * 0.1, 90));
      break;
  }

  const roles = ['primary', 'secondary', 'accent', 'highlight', 'background', 'surface', 'text'];
  const palette = {};
  colors.forEach((c, i) => { palette[roles[i]] = c; });
  return palette;
}

// ============ Grid Math Utilities ============

function calculateGrid(gridType, tileSize, position) {
  const { x, y } = position;
  let screen, neighbors, formula;

  switch (gridType) {
    case 'orthogonal':
      screen = { x: x * tileSize, y: y * tileSize };
      neighbors = [
        { x: x, y: y - 1, dir: 'north' },
        { x: x + 1, y: y, dir: 'east' },
        { x: x, y: y + 1, dir: 'south' },
        { x: x - 1, y: y, dir: 'west' }
      ];
      formula = 'screenX = gridX * tileSize, screenY = gridY * tileSize';
      break;

    case 'isometric':
      screen = {
        x: (x - y) * (tileSize / 2),
        y: (x + y) * (tileSize / 4)
      };
      neighbors = [
        { x: x, y: y - 1, dir: 'north' },
        { x: x + 1, y: y, dir: 'east' },
        { x: x, y: y + 1, dir: 'south' },
        { x: x - 1, y: y, dir: 'west' }
      ];
      formula = 'screenX = (gridX - gridY) * (tileWidth / 2), screenY = (gridX + gridY) * (tileHeight / 2)';
      break;

    case 'hex-flat': {
      const size = tileSize;
      const sqrt3 = Math.sqrt(3);
      screen = {
        x: size * 1.5 * x,
        y: size * sqrt3 * (y + x / 2)
      };
      neighbors = [
        { x: x + 1, y: y, dir: 'east' },
        { x: x - 1, y: y, dir: 'west' },
        { x: x, y: y - 1, dir: 'NE' },
        { x: x, y: y + 1, dir: 'SW' },
        { x: x + 1, y: y - 1, dir: 'NW' },
        { x: x - 1, y: y + 1, dir: 'SE' }
      ];
      formula = 'x = size * 3/2 * q, y = size * sqrt(3) * (r + q/2)';
      break;
    }

    case 'hex-pointy': {
      const size = tileSize;
      const sqrt3 = Math.sqrt(3);
      screen = {
        x: size * sqrt3 * (x + y / 2),
        y: size * 1.5 * y
      };
      neighbors = [
        { x: x + 1, y: y, dir: 'E' },
        { x: x - 1, y: y, dir: 'W' },
        { x: x, y: y - 1, dir: 'NE' },
        { x: x, y: y + 1, dir: 'SW' },
        { x: x - 1, y: y - 1, dir: 'NW' },
        { x: x + 1, y: y + 1, dir: 'SE' }
      ];
      formula = 'x = size * sqrt(3) * (q + r/2), y = size * 3/2 * r';
      break;
    }
  }

  return { gridPosition: position, screenPosition: screen, neighbors, formula, gridType, tileSize };
}

// ============ Spacing Scale ============

const RATIOS = {
  'golden': 1.618,
  'major-third': 1.25,
  'minor-third': 1.2,
  'perfect-fourth': 1.333,
  'augmented-fourth': 1.414,
  'perfect-fifth': 1.5,
  'major-second': 1.125,
  'minor-second': 1.067
};

const SCALE_NAMES = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

function generateSpacingScale(base, ratioName, steps, unit) {
  const ratio = RATIOS[ratioName] || 1.618;
  const scale = [];

  // 2 steps down
  for (let i = 2; i > 0; i--) {
    const value = Math.round(base / Math.pow(ratio, i));
    scale.push({ value, label: `--space-${SCALE_NAMES[2 - i] || 'down-' + i}`, formatted: `${value}${unit}` });
  }
  // base + steps up
  for (let i = 0; i < steps; i++) {
    const value = Math.round(base * Math.pow(ratio, i));
    const nameIdx = 2 + i;
    scale.push({ value, label: `--space-${SCALE_NAMES[nameIdx] || 'up-' + i}`, formatted: `${value}${unit}` });
  }

  return { base, ratio: ratioName, ratioValue: ratio, unit, scale };
}

// ============ MCP Server Setup ============

const server = new McpServer({
  name: 'artisteye',
  version: '2.0.0'
});

// Tool 1: color_palette_game
server.tool(
  'color_palette_game',
  'Generate a game-appropriate color palette by genre or color harmony',
  {
    genre: z.string().optional().describe('Game genre (horror, action, rpg, puzzle, platformer, sci-fi, retro, casual, simulation, racing, stealth, roguelike)'),
    harmony: z.enum(['complementary', 'analogous', 'triadic', 'split-complementary', 'tetradic', 'monochromatic']).optional().describe('Color harmony type'),
    base_color: z.string().optional().describe('Base color as hex (e.g., #FF6600)')
  },
  async ({ genre, harmony, base_color }) => {
    let result;

    if (genre) {
      const genreData = genrePalettes[genre.toLowerCase()];
      if (!genreData) {
        return { content: [{ type: 'text', text: `Unknown genre: ${genre}. Available: ${Object.keys(genrePalettes).join(', ')}` }] };
      }
      const palette = genreData.palettes[0];
      const roles = ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'muted'];
      const colors = {};
      for (const role of roles) {
        const hex = palette[role];
        const rgb = hexToRgb(hex);
        colors[role] = { hex, rgb };
      }
      // Calculate text contrast ratios
      const textContrast = {
        text_on_background: contrastRatio(palette.text, palette.background).toFixed(2),
        text_on_surface: contrastRatio(palette.text, palette.surface).toFixed(2),
        accent_on_background: contrastRatio(palette.accent, palette.background).toFixed(2)
      };
      result = {
        genre: genreData.name,
        moods: genreData.moods,
        palette_name: palette.name,
        colors,
        contrast_ratios: textContrast,
        all_variants: genreData.palettes.map(p => p.name),
        usage: {
          primary: 'Main UI elements, player character highlights',
          secondary: 'Supporting elements, secondary panels',
          accent: 'Interactive elements, important pickups, alerts',
          background: 'Scene background, large fill areas',
          surface: 'Cards, panels, elevated UI containers',
          text: 'Body text, labels, descriptions',
          muted: 'Disabled states, subtle borders, inactive elements'
        }
      };
    } else if (harmony && base_color) {
      const palette = generateHarmony(base_color, harmony);
      result = {
        harmony,
        base_color,
        palette,
        usage: {
          primary: 'Main interactive elements and focal points',
          secondary: 'Supporting visual elements',
          accent: 'Call-to-action, highlights, important items',
          highlight: 'Hover states, selection indicators',
          background: 'Scene/screen background',
          surface: 'UI panels and containers',
          text: 'Readable text and labels'
        }
      };
    } else {
      return { content: [{ type: 'text', text: 'Provide either "genre" or both "harmony" and "base_color".' }] };
    }

    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 2: contrast_check
server.tool(
  'contrast_check',
  'Check WCAG contrast ratio between two colors for accessibility',
  {
    foreground: z.string().describe('Foreground color as hex (e.g., #FFFFFF)'),
    background: z.string().describe('Background color as hex (e.g., #000000)')
  },
  async ({ foreground, background }) => {
    const ratio = contrastRatio(foreground, background);
    const result = {
      foreground,
      background,
      contrast_ratio: parseFloat(ratio.toFixed(2)),
      wcag: {
        aa_normal: { required: 4.5, pass: ratio >= 4.5 },
        aa_large: { required: 3.0, pass: ratio >= 3.0 },
        aaa_normal: { required: 7.0, pass: ratio >= 7.0 },
        aaa_large: { required: 4.5, pass: ratio >= 4.5 }
      },
      rating: ratio >= 7 ? 'Excellent' : ratio >= 4.5 ? 'Good (AA)' : ratio >= 3 ? 'Acceptable for large text only' : 'Poor - not accessible'
    };
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 3: grid_calculator
server.tool(
  'grid_calculator',
  'Calculate screen coordinates and neighbors for orthogonal, isometric, or hexagonal grids',
  {
    grid_type: z.enum(['orthogonal', 'isometric', 'hex-flat', 'hex-pointy']).describe('Type of grid'),
    tile_size: z.number().describe('Tile size in pixels'),
    position: z.object({ x: z.number(), y: z.number() }).describe('Grid position (column, row)')
  },
  async ({ grid_type, tile_size, position }) => {
    const result = calculateGrid(grid_type, tile_size, position);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 4: easing_calculator
server.tool(
  'easing_calculator',
  'Get easing curve values, code snippets, and timing for game animations',
  {
    easing: z.string().describe('Easing curve name (e.g., easeOutBack, easeInOutCubic)'),
    duration: z.number().optional().default(1000).describe('Animation duration in ms'),
    steps: z.number().optional().default(10).describe('Number of value steps to generate'),
    language: z.enum(['javascript', 'lua', 'gdscript', 'csharp', 'python']).optional().default('javascript').describe('Code snippet language')
  },
  async ({ easing, duration, steps, language }) => {
    const curve = easingCurves[easing];
    if (!curve) {
      const available = Object.keys(easingCurves).join(', ');
      return { content: [{ type: 'text', text: `Unknown easing: ${easing}. Available: ${available}` }] };
    }

    // Generate value table
    const valueTable = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ms = Math.round(t * duration);
      valueTable.push({ step: i, t: parseFloat(t.toFixed(3)), ms, note: i === 0 ? 'start' : i === steps ? 'end' : '' });
    }

    const result = {
      name: curve.name,
      category: curve.category,
      description: curve.description,
      formula: curve.formula,
      css_equivalent: curve.css_equivalent,
      use_cases: curve.use_cases,
      duration_ms: duration,
      value_table: valueTable,
      code: curve.code[language] || curve.code.javascript
    };

    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 5: spacing_scale
server.tool(
  'spacing_scale',
  'Generate a typographic/UI spacing scale using musical or mathematical ratios',
  {
    base: z.number().describe('Base size in pixels'),
    ratio: z.enum(['golden', 'major-third', 'minor-third', 'perfect-fourth', 'augmented-fourth', 'perfect-fifth', 'major-second', 'minor-second']).describe('Scale ratio'),
    steps: z.number().optional().default(6).describe('Number of scale steps up from base'),
    unit: z.string().optional().default('px').describe('CSS unit (px, rem, em)')
  },
  async ({ base, ratio, steps, unit }) => {
    const result = generateSpacingScale(base, ratio, steps, unit);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 6: coordinate_reference
server.tool(
  'coordinate_reference',
  'Quick lookup of coordinate system conventions for a game engine',
  {
    engine: z.string().describe('Engine ID (love2d, godot2d, godot3d, unity2d, unity3d, pygame, canvas, threejs, phaser, roblox, blender, defold, raylib, pixijs, unreal)')
  },
  async ({ engine }) => {
    const data = engineCoordinates[engine.toLowerCase()];
    if (!data) {
      const available = Object.keys(engineCoordinates).join(', ');
      return { content: [{ type: 'text', text: `Unknown engine: ${engine}. Available: ${available}` }] };
    }
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error('MCP server error:', err);
  process.exit(1);
});

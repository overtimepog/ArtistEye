#!/usr/bin/env node

/**
 * ArtistEye Session Context
 * Hook: SessionStart
 * Detects game engine from project files and injects coordinate system context.
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load engine coordinates data
let engineData = {};
try {
  const dataPath = join(__dirname, '..', 'data', 'engine-coordinates.json');
  engineData = JSON.parse(readFileSync(dataPath, 'utf8'));
} catch {
  // Data file not available, continue with empty
}

// Engine detection rules: check for marker files/patterns
const ENGINE_MARKERS = [
  {
    id: 'love2d',
    checks: [
      { type: 'file', path: 'conf.lua' },
      { type: 'file', path: 'main.lua' }
    ],
    matchAny: true
  },
  {
    id: 'godot2d',
    checks: [
      { type: 'file', path: 'project.godot' }
    ],
    note: 'Detected Godot (check if 2D or 3D based on scene files)'
  },
  {
    id: 'unity2d',
    checks: [
      { type: 'dir', path: 'ProjectSettings' },
      { type: 'glob', pattern: '.unity' }
    ],
    matchAny: true,
    note: 'Detected Unity (check if 2D or 3D based on camera setup)'
  },
  {
    id: 'roblox',
    checks: [
      { type: 'glob', pattern: '.rbxlx' },
      { type: 'glob', pattern: '.rbxl' }
    ],
    matchAny: true
  },
  {
    id: 'defold',
    checks: [
      { type: 'file', path: 'game.project' }
    ]
  },
  {
    id: 'pygame',
    checks: [
      { type: 'package_json_dep', dep: 'pygame' },
      { type: 'py_import', pattern: 'pygame' }
    ],
    matchAny: true
  },
  {
    id: 'phaser',
    checks: [
      { type: 'package_json_dep', dep: 'phaser' }
    ]
  },
  {
    id: 'threejs',
    checks: [
      { type: 'package_json_dep', dep: 'three' }
    ]
  },
  {
    id: 'pixijs',
    checks: [
      { type: 'package_json_dep', dep: 'pixi.js' },
      { type: 'package_json_dep', dep: '@pixi/core' }
    ],
    matchAny: true
  }
];

function checkFileExists(dir, filePath) {
  return existsSync(join(dir, filePath));
}

function checkDirExists(dir, dirPath) {
  return existsSync(join(dir, dirPath));
}

function checkGlob(dir, extension) {
  try {
    const files = readdirSync(dir);
    return files.some(f => f.endsWith(extension));
  } catch {
    return false;
  }
}

function checkPackageJsonDep(dir, dep) {
  try {
    const pkgPath = join(dir, 'package.json');
    if (!existsSync(pkgPath)) return false;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {})
    };
    return dep in allDeps;
  } catch {
    return false;
  }
}

function checkPyImport(dir, pattern) {
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.py'));
    for (const file of files.slice(0, 5)) {
      const content = readFileSync(join(dir, file), 'utf8');
      if (content.includes(`import ${pattern}`) || content.includes(`from ${pattern}`)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

function detectEngine(dir) {
  for (const marker of ENGINE_MARKERS) {
    const results = marker.checks.map(check => {
      switch (check.type) {
        case 'file': return checkFileExists(dir, check.path);
        case 'dir': return checkDirExists(dir, check.path);
        case 'glob': return checkGlob(dir, check.pattern);
        case 'package_json_dep': return checkPackageJsonDep(dir, check.dep);
        case 'py_import': return checkPyImport(dir, check.pattern);
        default: return false;
      }
    });

    const matched = marker.matchAny
      ? results.some(r => r)
      : results.every(r => r);

    if (matched) {
      return { id: marker.id, note: marker.note || null };
    }
  }

  return null;
}

function buildSessionContext(engine) {
  const lines = [];
  lines.push('[ArtistEye] Game Dev Art Assistant Active');
  lines.push('');

  if (engine) {
    const data = engineData[engine.id];
    if (data) {
      lines.push(`Detected Engine: **${data.name}**`);
      lines.push(`- Origin: ${data.origin}`);
      lines.push(`- Y-Direction: ${data.y_direction}`);
      lines.push(`- Rotation: ${data.rotation.unit}, ${data.rotation.direction}`);
      lines.push(`- Units: ${data.units}`);
      lines.push('');
      lines.push('Common Pitfalls:');
      for (const pitfall of data.common_pitfalls) {
        lines.push(`- ${pitfall}`);
      }
      if (engine.note) {
        lines.push('');
        lines.push(`Note: ${engine.note}`);
      }
    } else {
      lines.push(`Detected engine marker: ${engine.id}`);
    }
  } else {
    lines.push('No specific game engine detected in working directory.');
    lines.push('Spatial awareness is active - will verify coordinate systems when game frameworks are used.');
  }

  lines.push('');
  lines.push('Use Context7 (`resolve-library-id` + `query-docs`) to verify framework APIs before implementing.');
  lines.push('Available MCP tools: `coordinate_reference`, `color_palette_game`, `contrast_check`, `grid_calculator`, `easing_calculator`, `spacing_scale`');

  return lines.join('\n');
}

async function main() {
  let input = '';

  try {
    const chunks = [];
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
      }, 3000))
    ]);
  } catch {
    // Continue with empty input
  }

  // Determine working directory
  let workDir = process.cwd();
  try {
    const data = JSON.parse(input || '{}');
    if (data.cwd) workDir = data.cwd;
    if (data.workingDirectory) workDir = data.workingDirectory;
  } catch {
    // Use default cwd
  }

  // Detect engine
  const engine = detectEngine(workDir);

  // Build context
  const context = buildSessionContext(engine);

  const result = {
    continue: true,
    hookSpecificOutput: {
      suppressOutput: false,
      message: context
    }
  };

  process.stdout.write(JSON.stringify(result));
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ continue: true }));
});

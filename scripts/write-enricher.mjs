#!/usr/bin/env node

/**
 * ArtistEye Write Enricher
 * Hook: PreToolUse:Write
 * Adds spatial context reminders when writing game-related file types.
 */

const FILE_REMINDERS = {
  '.lua': {
    engines: ['Love2D', 'Roblox', 'Defold'],
    reminder: 'Lua spatial context: Love2D uses Y-down, top-left origin, radians (CW). Roblox uses Y-up, center origin, studs. Defold uses Y-up, bottom-left origin. Verify which engine this Lua file targets.'
  },
  '.gd': {
    engines: ['Godot'],
    reminder: 'GDScript spatial context: 2D uses Y-down, top-left origin. 3D uses Y-up, -Z forward (right-handed). rotation is in radians internally (use rotation_degrees for degrees). Use global_position for world coords.'
  },
  '.gdshader': {
    engines: ['Godot'],
    reminder: 'GDShader context: UV (0,0) is top-left in Godot. SCREEN_UV available for screen-space effects. Use hint_default_white/hint_normal for texture uniforms. COLOR is the output in fragment().'
  },
  '.cs': {
    engines: ['Unity'],
    reminder: 'C# Unity spatial context: Y is UP. 2D: center origin, CCW rotation in degrees. 3D: left-handed, +Z forward. Use Quaternion.Euler() for rotations, avoid raw euler angles. transform.position = world space.'
  },
  '.glsl': {
    engines: ['OpenGL', 'Love2D', 'Three.js'],
    reminder: 'GLSL spatial context: UV range 0-1. fragCoord/iResolution.xy for screen-space UV. Texture (0,0) is bottom-left in OpenGL convention. Use smoothstep for anti-aliased SDF shapes.'
  },
  '.hlsl': {
    engines: ['Unity', 'Unreal', 'DirectX'],
    reminder: 'HLSL spatial context: UV range 0-1. Texture (0,0) is top-left in DirectX convention. SV_Position for screen coords. Unity uses left-handed coords. Check if gamma/linear color space.'
  },
  '.shader': {
    engines: ['Unity ShaderLab'],
    reminder: 'ShaderLab context: Unity-specific shader format. UVs are 0-1 range. Use _MainTex_ST for tiling/offset. UNITY_UV_STARTS_AT_TOP may be needed for render textures. Check if URP or Built-in pipeline.'
  },
  '.py': {
    engines: ['Pygame'],
    reminder: 'Python game context: If using Pygame - Y-down, top-left origin, degrees (CCW). pygame.transform.rotate() changes surface size, re-center after rotation. No built-in camera system.'
  }
};

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
      }, 2000))
    ]);
  } catch {
    // Continue
  }

  // Parse tool input to get file path
  let filePath = '';
  try {
    const data = JSON.parse(input || '{}');
    filePath = data.file_path || data.filePath || data.path || '';
    // Also check nested tool_input
    if (!filePath && data.tool_input) {
      filePath = data.tool_input.file_path || data.tool_input.filePath || '';
    }
  } catch {
    // Can't parse, skip
  }

  const result = { continue: true };

  if (filePath) {
    // Check file extension
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    const reminderData = FILE_REMINDERS[ext];

    if (reminderData) {
      // Check if this looks like a game file (not just any .py or .cs file)
      // For .py and .cs we do a lightweight check, others are game-specific enough
      const alwaysRemind = ['.gd', '.gdshader', '.glsl', '.hlsl', '.shader'];

      if (alwaysRemind.includes(ext) || ext === '.lua') {
        result.hookSpecificOutput = {
          suppressOutput: false,
          message: `[ArtistEye] ${reminderData.reminder}`
        };
      } else {
        // For .py and .cs, only add reminder (less intrusive)
        result.hookSpecificOutput = {
          suppressOutput: false,
          message: `[ArtistEye] ${reminderData.reminder}`
        };
      }
    }
  }

  process.stdout.write(JSON.stringify(result));
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ continue: true }));
});

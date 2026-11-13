/**
 * Shared GLSL for the procedural facades (the tower's curtain wall and the city around it).
 *
 * ROOM: "interior mapping". Behind every window the shader traces the view ray through an imaginary
 * room (a box of the room's width, height and depth) and shades whichever surface it hits: back
 * wall, side walls, floor or ceiling, with a piece of furniture, a picture, curtains and blinds
 * that vary room by room. Windows read as rooms with real depth and parallax, at no geometry cost.
 * Reflections come from the material itself; the room is added as light passing through the glass.
 */

export const HASH = /* glsl */ `
float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec3 h23(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yzz) * p3.zyx); }
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm2(vec2 p) { return vnoise(p) * 0.62 + vnoise(p * 2.13 + 7.1) * 0.38; }
`;

export const ROOM = /* glsl */ `
// p: point on the window in room space (metres from the room's lower-left corner at the glass)
// r: view ray in room space (x along the facade, y up, z into the room)
// size: room width, height, depth; s: three random numbers for this room; level: daylight level
vec3 roomInterior(vec2 p, vec3 r, vec3 size, vec3 s, float level) {
  r.z = max(r.z, 0.02);
  float tx = r.x > 0.0 ? (size.x - p.x) / max(r.x, 1e-4) : p.x / max(-r.x, 1e-4);
  float ty = r.y > 0.0 ? (size.y - p.y) / max(r.y, 1e-4) : p.y / max(-r.y, 1e-4);
  float tz = size.z / r.z;
  float t = min(min(tx, ty), tz);
  vec3 h = vec3(p, 0.0) + r * t;
  float depth = clamp(h.z / size.z, 0.0, 1.0);

  vec3 wall = mix(vec3(0.86, 0.82, 0.76), vec3(0.74, 0.75, 0.74), s.x);
  vec3 col;
  if (t == tz) {
    // back wall, with a sideboard / sofa / bed silhouette and sometimes a picture above it
    col = wall;
    float u = h.x / size.x;
    float f0 = 0.08 + 0.32 * s.z;
    float f1 = min(0.94, f0 + 0.32 + 0.34 * s.x);
    float fh = mix(0.5, 0.95, s.y);
    if (u > f0 && u < f1 && h.y < fh) {
      vec3 furn = mix(vec3(0.16, 0.14, 0.13), vec3(0.62, 0.56, 0.48), fract(s.y * 7.3));
      col = furn * mix(0.7, 1.0, smoothstep(0.0, fh, h.y));
    }
    float pc = (f0 + f1) * 0.5;
    if (s.z > 0.45 && abs(u - pc) < 0.11 && h.y > 1.25 && h.y < 1.9) col = mix(vec3(0.24, 0.27, 0.3), vec3(0.62, 0.5, 0.38), s.x);
  } else if (t == tx) {
    col = wall * 0.86; // side walls
    // a door or a cabinet on some side walls
    if (s.z < 0.4 && h.z > size.z * 0.55 && h.z < size.z * 0.82 && h.y < 2.1) col = mix(vec3(0.5, 0.42, 0.34), wall * 0.7, s.x);
  } else if (r.y < 0.0) {
    col = s.y > 0.55 ? vec3(0.78, 0.75, 0.7) : mix(vec3(0.42, 0.3, 0.2), vec3(0.58, 0.45, 0.32), s.z); // marble or timber
    col *= 0.85 + 0.15 * smoothstep(0.0, 0.3, depth);
  } else {
    col = vec3(0.93, 0.92, 0.9); // ceiling
  }

  // Daylight falls off away from the window; the ceiling is lit by light bounced from the floor.
  float lit = mix(1.0, 0.28, smoothstep(0.0, 1.0, depth));
  if (t == ty && r.y > 0.0) lit *= 0.72;
  float lamps = step(0.66, s.x * 0.6 + s.z * 0.4); // some rooms have their lights on
  vec3 warm = vec3(1.0, 0.8, 0.58) * lamps * (t == ty && r.y > 0.0 ? 0.55 : 0.22);
  col *= level * lit * mix(0.65, 1.15, s.y) + warm * level;

  // At the glass: sheer curtains drawn to one side, and blinds part-way down in some rooms.
  float u0 = p.x / size.x;
  float v0 = p.y / size.y;
  float cw = s.x < 0.3 ? 0.0 : 0.1 + 0.26 * s.z;
  float curtain = s.y > 0.5 ? step(1.0 - cw, u0) : step(u0, cw);
  float blind = s.z > 0.58 ? step(1.0 - (0.08 + 0.5 * fract(s.x * 3.7)), v0) : 0.0;
  vec3 fabric = mix(vec3(0.9, 0.87, 0.8), vec3(0.6, 0.56, 0.5), fract(s.z * 5.1)) * level * 1.35;
  float pleat = 0.82 + 0.18 * sin(p.x * 37.0 + s.x * 6.0);
  col = mix(col, fabric * pleat, curtain * 0.88);
  col = mix(col, fabric * (0.9 + 0.1 * step(0.5, fract(p.y * 9.0))), blind * 0.96);
  return col;
}
`;

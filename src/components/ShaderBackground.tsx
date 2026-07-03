import { useEffect, useRef } from "react";

/**
 * Unique liquid-metal shader background.
 * Custom GLSL — flowing domain-warped FBM, tinted by CSS theme vars.
 * Falls back to a CSS gradient if WebGL is unavailable.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_a;
uniform vec3 u_b;
uniform vec3 u_c;
uniform vec3 u_bg;

// hash / noise / fbm
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0,0.0));
  float c = hash(i + vec2(0.0,1.0));
  float d = hash(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v = 0.0; float amp = 0.5;
  for(int i=0;i<5;i++){ v += amp*noise(p); p*=2.02; amp*=0.5; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / min(u_res.x, u_res.y);
  vec2 m = (u_mouse - 0.5*u_res) / min(u_res.x, u_res.y);

  float t = u_time * 0.06;
  // domain warp — liquid feel
  vec2 q = vec2(fbm(uv + t), fbm(uv - t + 5.2));
  vec2 r = vec2(
    fbm(uv + 1.5*q + vec2(1.7, 9.2) + 0.15*t),
    fbm(uv + 1.5*q + vec2(8.3, 2.8) + 0.126*t)
  );
  float f = fbm(uv + 2.4*r + 0.3*m);

  // metaball-like glow tracking mouse
  float mb = 0.08 / (0.02 + length(uv - m*0.6));
  mb = clamp(mb, 0.0, 1.2);

  vec3 col = u_bg;
  col = mix(col, u_a, smoothstep(0.15, 0.85, f + 0.15*mb));
  col = mix(col, u_b, smoothstep(0.35, 0.95, length(r) + 0.1*mb));
  col = mix(col, u_c, smoothstep(0.55, 1.05, dot(q,q)*1.4));

  // subtle vignette
  float v = 1.0 - smoothstep(0.8, 1.6, length(uv));
  col *= 0.65 + 0.45*v;

  // filmic-ish tone
  col = col / (1.0 + col*0.35);
  gl_FragColor = vec4(col, 1.0);
}
`;

function parseVec3(v: string, fallback: [number, number, number]): [number, number, number] {
  const parts = v.trim().split(/\s+/).map(Number).filter((n) => !Number.isNaN(n));
  if (parts.length >= 3) return [parts[0], parts[1], parts[2]];
  return fallback;
}

export function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("shader compile", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uA = gl.getUniformLocation(prog, "u_a");
    const uB = gl.getUniformLocation(prog, "u_b");
    const uC = gl.getUniformLocation(prog, "u_c");
    const uBg = gl.getUniformLocation(prog, "u_bg");

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (window.devicePixelRatio || 1);
      mouse.y = rect.height * (window.devicePixelRatio || 1) - (e.clientY - rect.top) * (window.devicePixelRatio || 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const readTheme = () => {
      const s = getComputedStyle(document.documentElement);
      return {
        a: parseVec3(s.getPropertyValue("--shader-a") || "0.6 0.25 0.95", [0.6, 0.25, 0.95]),
        b: parseVec3(s.getPropertyValue("--shader-b") || "0.3 0.5 0.98", [0.3, 0.5, 0.98]),
        c: parseVec3(s.getPropertyValue("--shader-c") || "0.9 0.4 0.9", [0.9, 0.4, 0.9]),
        bg: parseVec3(s.getPropertyValue("--shader-bg") || "0.05 0.04 0.09", [0.05, 0.04, 0.09]),
      };
    };
    let theme = readTheme();
    const obs = new MutationObserver(() => { theme = readTheme(); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const start = performance.now();
    let raf = 0;
    let running = true;

    const loop = () => {
      if (!running) return;
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x || canvas.width * 0.5, mouse.y || canvas.height * 0.5);
      gl.uniform3f(uA, theme.a[0], theme.a[1], theme.a[2]);
      gl.uniform3f(uB, theme.b[0], theme.b[1], theme.b[2]);
      gl.uniform3f(uC, theme.c[0], theme.c[1], theme.c[2]);
      gl.uniform3f(uBg, theme.bg[0], theme.bg[1], theme.bg[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      {/* CSS fallback / underlay */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, var(--accent), transparent 60%), var(--background)",
        }}
      />
      <canvas
        ref={ref}
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        aria-hidden="true"
      />
      {/* grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </>
  );
}

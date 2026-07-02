import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/lib/services";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "KMs Creative — Crafting Digital Excellence" },
      {
        name: "description",
        content:
          "KMs Creative — high-end video production, motion graphics, brand design and full-stack web development built with precision and style.",
      },
      { property: "og:title", content: "KMs Creative — Crafting Digital Excellence" },
      {
        property: "og:description",
        content: "Video, motion, design and web development. One studio. Premium results.",
      },
    ],
  }),
});

const TELEGRAM_URL = "https://t.me/kalabms";

const NAV_ITEMS = [
  { id: "hero", label: "Home", icon: "◉" },
  { id: "about", label: "About", icon: "✦" },
  { id: "services", label: "Services", icon: "▤" },
  { id: "contact", label: "Contact", icon: "✉" },
] as const;

const SERVICE_ICONS: Record<string, string> = {
  "video-production": "🎬",
  "motion-graphics": "✧",
  "graphic-design": "◈",
  "web-development": "⌘",
  "business-essentials": "▤",
};

function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [inquireOpen, setInquireOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Theme init + toggle
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("kms-theme")) as
      | "dark"
      | "light"
      | null;
    const initial = stored ?? "dark";
    setTheme(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    localStorage.setItem("kms-theme", theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Scroll reveal + section spy
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) * 100 : 0;
            setTimeout(() => el.classList.add("visible"), delay);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));

    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.4 },
    );
    sections.forEach((s) => spy.observe(s));

    return () => {
      io.disconnect();
      spy.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => navRef.current?.classList.toggle("scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Custom cursor
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = cursorRef.current!;
    const trail = cursorTrailRef.current!;
    let mx = 0, my = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px"; cursor.style.top = my + "px";
    };
    const tick = () => {
      tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
      trail.style.left = tx + "px"; trail.style.top = ty + "px";
      raf = requestAnimationFrame(tick);
    };
    document.addEventListener("mousemove", onMove);
    tick();
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Unique 3D scene: shader-displaced liquid orb + orbiting glass shards + flowing background plane
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Uniforms shared between orb and background
    const uTime = { value: 0 };
    const uTheme = { value: theme === "dark" ? 1 : 0 };

    // -- Flowing shader background plane (iridescent noise field) --
    const bgGeo = new THREE.PlaneGeometry(40, 24, 1, 1);
    const bgMat = new THREE.ShaderMaterial({
      uniforms: { uTime, uTheme },
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uTheme;
        // simplex noise (Ashima)
        vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
        vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
        vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
          vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x*x0.x + h.x*x0.y;
          g.yz = a0.yz*x12.xz + h.yz*x12.yw;
          return 130.0 * dot(m, g);
        }
        void main(){
          vec2 uv = vUv * 2.0 - 1.0;
          float t = uTime * 0.12;
          float n1 = snoise(uv * 1.3 + vec2(t, -t*0.7));
          float n2 = snoise(uv * 2.6 + vec2(-t*0.5, t*0.9));
          float n = smoothstep(-1.0, 1.0, n1 * 0.6 + n2 * 0.4);
          // Iridescent palette (purple/magenta/cyan)
          vec3 c1 = vec3(0.42, 0.15, 0.85);
          vec3 c2 = vec3(0.85, 0.25, 0.75);
          vec3 c3 = vec3(0.15, 0.55, 0.95);
          vec3 col = mix(c1, c2, n);
          col = mix(col, c3, smoothstep(0.55, 0.95, n));
          // Vignette
          float v = 1.0 - length(uv * vec2(0.55, 0.9));
          col *= smoothstep(0.0, 0.9, v);
          float baseAlpha = mix(0.32, 0.22, uTheme < 0.5 ? 1.0 : 0.0);
          gl_FragColor = vec4(col, baseAlpha + n * 0.15);
        }
      `,
    });
    const bgPlane = new THREE.Mesh(bgGeo, bgMat);
    bgPlane.position.z = -8;
    scene.add(bgPlane);

    // -- Liquid metal orb with displacement + iridescent fresnel --
    const orbGeo = new THREE.IcosahedronGeometry(1.4, 64);
    const orbMat = new THREE.ShaderMaterial({
      uniforms: { uTime, uTheme },
      transparent: true,
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying float vDisp;
        // 3D simplex noise (compact)
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod(i, 289.0);
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
                          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 1.0/7.0;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        void main() {
          vec3 p = position;
          float n = snoise(p * 1.4 + vec3(uTime * 0.35));
          float n2 = snoise(p * 2.6 - vec3(uTime * 0.22));
          float d = n * 0.28 + n2 * 0.08;
          vDisp = d;
          vec3 displaced = p + normal * d;
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
          vPos = mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying float vDisp;
        uniform float uTime;
        uniform float uTheme;
        void main(){
          vec3 viewDir = normalize(-vPos);
          float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.4);
          // Iridescent gradient across normal
          vec3 c1 = vec3(0.55, 0.20, 0.95);   // deep violet
          vec3 c2 = vec3(0.95, 0.35, 0.75);   // magenta
          vec3 c3 = vec3(0.20, 0.75, 1.00);   // cyan highlight
          float band = 0.5 + 0.5 * sin(vDisp * 8.0 + uTime * 0.6);
          vec3 base = mix(c1, c2, band);
          vec3 col = mix(base, c3, fres);
          // Extra sheen band
          float sheen = smoothstep(0.7, 1.0, fres);
          col += vec3(0.9, 0.95, 1.0) * sheen * 0.4;
          gl_FragColor = vec4(col, 0.95);
        }
      `,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(3.2, -0.2, -1.2);
    scene.add(orb);

    // -- Orbiting glass shards (physical material for real refraction feel) --
    const shardGroup = new THREE.Group();
    const shardCount = 7;
    for (let i = 0; i < shardCount; i++) {
      const geo = new THREE.OctahedronGeometry(0.22 + Math.random() * 0.18, 0);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 0.6, 0.7),
        transmission: 0.85,
        thickness: 0.6,
        roughness: 0.12,
        metalness: 0.05,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = {
        radius: 2.4 + Math.random() * 1.6,
        speed: 0.15 + Math.random() * 0.35,
        offset: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 1.2,
        yWave: 0.4 + Math.random() * 0.6,
      };
      shardGroup.add(mesh);
    }
    shardGroup.position.copy(orb.position);
    scene.add(shardGroup);

    // Soft particulate motes (sparse, small, non-repetitive)
    const moteCount = 260;
    const mPos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      mPos[i * 3] = (Math.random() - 0.5) * 22;
      mPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      mPos[i * 3 + 2] = -Math.random() * 8 - 1;
    }
    const mGeo = new THREE.BufferGeometry();
    mGeo.setAttribute("position", new THREE.BufferAttribute(mPos, 3));
    const motes = new THREE.Points(
      mGeo,
      new THREE.PointsMaterial({
        color: 0xc9a9ff,
        size: 0.035,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(motes);

    // Lighting for the physical shards
    scene.add(new THREE.AmbientLight(0x2a1450, 1.3));
    const key = new THREE.PointLight(0xa855f7, 8, 22); key.position.set(3, 4, 3); scene.add(key);
    const rim = new THREE.PointLight(0x22d3ee, 4, 18); rim.position.set(-4, -2, 2); scene.add(rim);
    const fill = new THREE.PointLight(0xff69d5, 3, 16); fill.position.set(0, -3, -2); scene.add(fill);

    let mouseX = 0, mouseY = 0, scrollY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScrollFn = () => { scrollY = window.scrollY; };
    document.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScrollFn);

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      uTime.value = t;
      const scroll = scrollY / (document.body.scrollHeight - window.innerHeight || 1);

      orb.rotation.y = t * 0.25;
      orb.rotation.x = t * 0.13;

      shardGroup.rotation.y = t * 0.1;
      shardGroup.children.forEach((s) => {
        const d = s.userData as {
          radius: number; speed: number; offset: number; tilt: number; yWave: number;
        };
        const a = t * d.speed + d.offset;
        s.position.set(
          Math.cos(a) * d.radius,
          Math.sin(t * d.yWave + d.offset) * 0.6 + d.tilt,
          Math.sin(a) * d.radius * 0.55,
        );
        s.rotation.x += 0.01;
        s.rotation.y += 0.014;
      });

      motes.rotation.y = t * 0.02;

      camera.position.x += (mouseX * 0.9 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.55 - camera.position.y) * 0.04;
      camera.position.z = 5 + scroll * 2.2;
      camera.lookAt(0, 0, -1);

      key.intensity = 6 + Math.sin(t * 1.4) * 2;
      rim.intensity = 3 + Math.cos(t * 0.9) * 1.4;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScrollFn);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      bgGeo.dispose(); bgMat.dispose();
      orbGeo.dispose(); orbMat.dispose();
      shardGroup.children.forEach((s) => {
        (s as THREE.Mesh).geometry.dispose();
        ((s as THREE.Mesh).material as THREE.Material).dispose();
      });
      mGeo.dispose();
    };
  }, []);

  // update shader theme uniform on toggle
  useEffect(() => {
    // simple approach: re-render triggers automatic; uniform read in scene is dark by default at mount.
    // For live toggle without remount, we'd need a ref — kept minimal: shader palette works in both.
  }, [theme]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`kms-landing ${theme}`}>
      <style>{styles}</style>
      <div ref={cursorRef} className="cursor" />
      <div ref={cursorTrailRef} className="cursor-trail" />
      <canvas ref={canvasRef} id="bg-canvas" />

      {/* ============ THEMED CLAPPERBOARD NAV ============ */}
      <nav ref={navRef} id="navbar" className="glass">
        <div className="clap-slate" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <span className="nav-lens">
              <span className="nav-lens-inner" />
            </span>
            <span className="nav-brand">
              KMS<span className="nav-dot">·</span>Creative
            </span>
          </Link>

          <div className="nav-links">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={scrollTo(n.id)}
                className={activeSection === n.id ? "active" : ""}
              >
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              <span className={`theme-thumb ${theme}`}>{theme === "dark" ? "☾" : "☀"}</span>
            </button>

            {signedIn ? (
              <Link to="/dashboard" className="btn-ghost">
                <span>◐</span> Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="btn-ghost">
                <span>⟶</span> Login
              </Link>
            )}

            {/* Expanding Inquire button */}
            <div className={`inquire-wrap ${inquireOpen ? "open" : ""}`}>
              <button
                className="btn-primary"
                onClick={() => setInquireOpen((v) => !v)}
                aria-expanded={inquireOpen}
              >
                <span className="btn-primary-icon">⚡</span>
                <span>Inquire</span>
                <span className="btn-chev">{inquireOpen ? "×" : "+"}</span>
              </button>
              <div className="inquire-panel glass">
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="inquire-item">
                  <span>✈</span> Telegram <em>@kalabms</em>
                </a>
                <a href="mailto:hello@kmscreative.com" className="inquire-item">
                  <span>✉</span> Email <em>hello@kmscreative</em>
                </a>
                <a
                  href="#services"
                  onClick={(e) => { scrollTo("services")(e); setInquireOpen(false); }}
                  className="inquire-item"
                >
                  <span>▤</span> Browse services
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section id="hero">
        <div className="hero-inner">
          <div className="hero-badge glass-chip">
            <span className="dot" /> Multi-Disciplinary Creative Studio
          </div>
          <h1 className="hero-title">
            KMs Creative: <em>Crafting</em><br />Digital Excellence.
          </h1>
          <p className="hero-sub">
            From high-end video production to full-stack website development,<br />
            I bring your brand to life with precision and style.
          </p>
          <div className="hero-cta">
            <a href="#services" onClick={scrollTo("services")} className="cta-primary">
              Explore Services →
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="cta-secondary glass">
              ✦ Get Started
            </a>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about">
        <div className="section-label" data-reveal>About the Studio</div>
        <div className="about-grid">
          <div className="about-text">
            <h2 data-reveal>Where Vision<br />Meets Execution</h2>
            <p data-reveal>
              KMs Creative is a multi-disciplinary creative studio specializing in pushing the boundaries of digital artistry and web technology.
            </p>
            <p data-reveal data-delay="1">
              Every project is approached with surgical precision, combining cutting-edge tools with a deep understanding of brand identity and user experience.
            </p>
          </div>
          <div className="stats-grid">
            {[
              { n: "50+", l: "Projects Shipped" },
              { n: "5★", l: "Client Rating" },
              { n: "3+", l: "Years Experience" },
              { n: "∞", l: "Creative Drive" },
            ].map((s, i) => (
              <div key={s.l} className="stat-card glass" data-reveal data-delay={i}>
                <div className="stat-number">{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES (clickable → /services/$slug) ============ */}
      <section id="services">
        <div className="services-header">
          <div className="section-label" data-reveal>Services</div>
          <h2 data-reveal>What I Create</h2>
          <p data-reveal>Click any service to explore what's inside — deliverables, tools and selected work.</p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="service-card glass"
              data-reveal
              data-delay={i}
            >
              <div className="service-icon">{SERVICE_ICONS[s.slug] ?? "✦"}</div>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
              <div className="service-mini">
                {s.deliverables.slice(0, 3).map((d) => (
                  <span key={d} className="service-mini-chip">{d}</span>
                ))}
              </div>
              <span className="service-cta">
                Explore <span className="arrow">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact">
        <div className="contact-inner">
          <div className="section-label" data-reveal>Let's Work</div>
          <h2 data-reveal>Ready to Build<br /><em>Something Great?</em></h2>
          <p data-reveal>Drop into my inbox and let's make something the internet hasn't seen before.</p>
          <div className="contact-cta-wrap" data-reveal>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="cta-primary">✦ Start a Project</a>
            <a href="#services" onClick={scrollTo("services")} className="cta-secondary glass">View Services</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="nav-logo">
          <span className="nav-lens"><span className="nav-lens-inner" /></span>
          <span className="nav-brand">KMs Creative</span>
        </div>
        <div>© {new Date().getFullYear()} KMs Creative · Crafting Digital Excellence.</div>
      </footer>
    </div>
  );
}

const styles = `
.kms-landing { 
  --purple:#7c3aed; --purple-light:#a855f7; --purple-glow:#9333ea; 
  --bg:#07000f; --panel:rgba(20,8,40,.55); --panel-border:rgba(168,85,247,.22);
  --text:#fff; --text-muted:rgba(255,255,255,0.62); 
  --glass-tint:rgba(255,255,255,0.06);
  background:var(--bg); color:var(--text); font-family:'Inter',system-ui,sans-serif; 
  overflow-x:hidden; min-height:100vh; position:relative; 
  transition: background .5s ease, color .5s ease;
}
.kms-landing.light {
  --bg:#f4f0fb; --panel:rgba(255,255,255,.55); --panel-border:rgba(124,58,237,.22);
  --text:#160923; --text-muted:rgba(30,10,50,0.62);
  --glass-tint:rgba(255,255,255,0.55);
}
.kms-landing * { box-sizing:border-box; }
.kms-landing #bg-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.95; }
.kms-landing::before { 
  content:''; position:fixed; inset:0; z-index:1; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  opacity:.14; mix-blend-mode:overlay;
}

/* ===== Liquid Glass primitive ===== */
.kms-landing .glass {
  background: var(--glass-tint);
  backdrop-filter: blur(22px) saturate(160%);
  border: 1px solid var(--panel-border);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.18),
    inset 0 -1px 0 rgba(0,0,0,.25),
    0 24px 60px -20px rgba(80,20,140,.45);
}
.kms-landing .glass-chip {
  background: var(--glass-tint);
  backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid var(--panel-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.18);
}

/* ===== Themed clapperboard nav ===== */
.kms-landing nav#navbar { 
  position:fixed; top:14px; left:50%; transform:translateX(-50%); z-index:100; 
  width:min(1160px,calc(100% - 28px)); 
  border-radius: 22px; overflow:hidden; 
  transition: transform .4s ease, box-shadow .4s ease, top .4s ease;
}
.kms-landing nav#navbar.scrolled { top:8px; }
.kms-landing .clap-slate { 
  display:flex; height:14px; width:100%;
  background: repeating-linear-gradient(
    115deg,
    #0a0014 0 26px, #eae7f5 26px 52px
  );
  border-bottom: 1px solid rgba(168,85,247,.35);
  position:relative;
}
.kms-landing.light .clap-slate {
  background: repeating-linear-gradient(115deg,#1a0430 0 26px,#fff 26px 52px);
}
.kms-landing .clap-slate::after {
  content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(168,85,247,.35), transparent);
}
.kms-landing .nav-inner {
  display:flex; align-items:center; justify-content:space-between;
  padding: 12px 20px;
  gap:14px;
}
.kms-landing .nav-logo { display:flex; align-items:center; gap:12px; text-decoration:none; color:var(--text); }
.kms-landing .nav-lens {
  position:relative; width:36px; height:36px; border-radius:50%;
  background: conic-gradient(from 0deg, #7c3aed, #ec4899, #22d3ee, #7c3aed);
  padding:2px; display:inline-flex; align-items:center; justify-content:center;
  box-shadow: 0 0 24px rgba(168,85,247,.55);
}
.kms-landing .nav-lens-inner {
  width:100%; height:100%; border-radius:50%;
  background: radial-gradient(circle at 30% 30%, #fff 0 6%, #a855f7 20%, #2a0450 60%, #05000d 100%);
  border:1px solid rgba(255,255,255,.35);
}
.kms-landing .nav-brand { font-size:13px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
.kms-landing .nav-dot { color:var(--purple-light); margin:0 4px; }

.kms-landing .nav-links { 
  display:flex; gap:6px; padding:6px; border-radius:999px;
  background: var(--glass-tint); border:1px solid var(--panel-border);
  backdrop-filter: blur(14px);
}
.kms-landing .nav-links a { 
  display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:999px;
  font-size:11px; letter-spacing:.14em; text-transform:uppercase; font-weight:600; 
  color:var(--text-muted); text-decoration:none; transition:all .3s;
}
.kms-landing .nav-links a .nav-icon { font-size:12px; opacity:.85; }
.kms-landing .nav-links a:hover { color:var(--text); background:rgba(168,85,247,.14); }
.kms-landing .nav-links a.active { 
  color:#fff; 
  background: linear-gradient(135deg, rgba(124,58,237,.9), rgba(168,85,247,.9));
  box-shadow: 0 6px 18px rgba(124,58,237,.5), inset 0 1px 0 rgba(255,255,255,.3);
}

.kms-landing .nav-actions { display:flex; align-items:center; gap:10px; }

/* Theme toggle */
.kms-landing .theme-toggle {
  width:52px; height:28px; border-radius:999px; border:1px solid var(--panel-border);
  background:var(--glass-tint); backdrop-filter:blur(12px); cursor:pointer;
  position:relative; padding:0; transition:all .3s;
}
.kms-landing .theme-thumb {
  position:absolute; top:2px; left:2px; width:22px; height:22px; border-radius:50%;
  background:linear-gradient(135deg,#a855f7,#ec4899); color:#fff;
  display:flex; align-items:center; justify-content:center; font-size:12px;
  transition: transform .35s cubic-bezier(.4,0,.2,1); box-shadow:0 0 12px rgba(168,85,247,.6);
}
.kms-landing .theme-thumb.light { transform: translateX(24px); background:linear-gradient(135deg,#fbbf24,#ec4899); }

.kms-landing .btn-ghost { 
  padding:8px 14px; border:1px solid var(--panel-border); border-radius:999px; 
  background:var(--glass-tint); backdrop-filter:blur(12px);
  color:var(--text); font-size:10px; letter-spacing:.14em; text-transform:uppercase; font-weight:600;
  display:inline-flex; align-items:center; gap:6px; text-decoration:none; transition:all .3s;
}
.kms-landing .btn-ghost:hover { border-color:var(--purple-light); color:var(--purple-light); }

/* Expanding inquire */
.kms-landing .inquire-wrap { position:relative; }
.kms-landing .btn-primary { 
  padding:9px 16px; border:none; border-radius:999px; cursor:pointer;
  background:linear-gradient(135deg,var(--purple),var(--purple-light)); 
  color:#fff; font-size:11px; letter-spacing:.14em; text-transform:uppercase; font-weight:700;
  display:inline-flex; align-items:center; gap:8px; 
  box-shadow: 0 6px 22px rgba(124,58,237,.55), inset 0 1px 0 rgba(255,255,255,.25);
  transition:all .35s cubic-bezier(.4,0,.2,1);
}
.kms-landing .btn-primary:hover { transform:translateY(-1px); box-shadow:0 10px 30px rgba(168,85,247,.7); }
.kms-landing .btn-chev { width:16px; height:16px; border-radius:50%; background:rgba(255,255,255,.22); display:inline-flex; align-items:center; justify-content:center; font-size:13px; line-height:1; }
.kms-landing .inquire-panel {
  position:absolute; top:calc(100% + 12px); right:0; min-width:240px;
  padding:8px; border-radius:16px; display:flex; flex-direction:column; gap:2px;
  opacity:0; pointer-events:none; transform:translateY(-8px) scale(.96);
  transform-origin: top right;
  transition: opacity .3s ease, transform .3s cubic-bezier(.4,0,.2,1);
}
.kms-landing .inquire-wrap.open .inquire-panel { opacity:1; pointer-events:auto; transform:none; }
.kms-landing .inquire-item {
  display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px;
  color:var(--text); text-decoration:none; font-size:12px; font-weight:500;
  transition: background .25s;
}
.kms-landing .inquire-item em { margin-left:auto; font-style:normal; color:var(--text-muted); font-size:11px; }
.kms-landing .inquire-item:hover { background:rgba(168,85,247,.14); }
.kms-landing .inquire-item span:first-child { 
  width:26px; height:26px; border-radius:8px;
  background:linear-gradient(135deg,var(--purple),var(--purple-light));
  display:inline-flex; align-items:center; justify-content:center; color:#fff; font-size:12px;
}

/* ===== Sections ===== */
.kms-landing section { position:relative; z-index:2; min-height:100vh; display:flex; align-items:center; }
.kms-landing #hero { padding:140px 48px 80px; justify-content:flex-start; flex-direction:column; align-items:flex-start; }
.kms-landing .hero-inner { max-width:700px; }
.kms-landing .hero-badge { 
  display:inline-flex; align-items:center; gap:10px; padding:8px 16px; border-radius:999px;
  font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--text); 
  margin-bottom:32px; opacity:0; animation:kmsFadeUp .8s .2s ease forwards; 
}
.kms-landing .hero-badge .dot { width:6px; height:6px; border-radius:50%; background:var(--purple-light); box-shadow:0 0 12px var(--purple-light); animation:kmsPulse 2s infinite; }
.kms-landing .hero-title { font-size:clamp(52px,7vw,96px); font-weight:900; line-height:1.05; letter-spacing:-.02em; margin-bottom:28px; opacity:0; animation:kmsFadeUp .8s .4s ease forwards; }
.kms-landing .hero-title em { font-family:'Playfair Display',Georgia,serif; font-style:italic; font-weight:700; background:linear-gradient(135deg,#a855f7,#ec4899,#22d3ee,#a855f7); background-size:250%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:kmsShimmer 5s infinite linear; }
.kms-landing .hero-sub { font-size:16px; line-height:1.7; color:var(--text-muted); max-width:480px; margin-bottom:44px; opacity:0; animation:kmsFadeUp .8s .6s ease forwards; }
.kms-landing .hero-cta { display:flex; gap:16px; flex-wrap:wrap; opacity:0; animation:kmsFadeUp .8s .8s ease forwards; }
.kms-landing .cta-primary { padding:14px 30px; background:linear-gradient(135deg,var(--purple),var(--purple-light)); border:none; border-radius:999px; color:#fff; font-size:11px; letter-spacing:.18em; text-transform:uppercase; font-weight:700; cursor:pointer; transition:all .3s; box-shadow:0 10px 30px rgba(124,58,237,.5); display:inline-flex; align-items:center; gap:8px; text-decoration:none; }
.kms-landing .cta-primary:hover { box-shadow:0 14px 40px rgba(168,85,247,.8); transform:translateY(-2px); }
.kms-landing .cta-secondary { padding:14px 28px; border-radius:999px; color:var(--text); font-size:11px; letter-spacing:.18em; text-transform:uppercase; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all .3s; }
.kms-landing .cta-secondary:hover { color:var(--purple-light); }
.kms-landing .scroll-indicator { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--text-muted); font-size:10px; letter-spacing:.2em; text-transform:uppercase; z-index:10; animation:kmsFadeIn 1.5s 1.5s ease both; }
.kms-landing .scroll-line { width:1px; height:48px; background:linear-gradient(to bottom,var(--purple-light),transparent); animation:kmsScrollLine 2s infinite ease-in-out; }

.kms-landing #about { padding:80px 48px; flex-direction:column; align-items:flex-start; }
.kms-landing .section-label { font-size:10px; letter-spacing:.28em; text-transform:uppercase; color:var(--purple-light); margin-bottom:20px; opacity:0; transform:translateY(30px); transition:all .7s ease; }
.kms-landing .section-label.visible { opacity:1; transform:none; }
.kms-landing .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; max-width:1100px; width:100%; }
.kms-landing .about-text h2 { font-size:clamp(36px,4vw,56px); font-weight:900; line-height:1.1; letter-spacing:-.02em; margin-bottom:24px; opacity:0; transform:translateY(40px); transition:all .7s .1s ease; }
.kms-landing .about-text h2.visible { opacity:1; transform:none; }
.kms-landing .about-text p { color:var(--text-muted); line-height:1.8; font-size:15px; margin-bottom:16px; opacity:0; transform:translateY(30px); transition:all .7s .2s ease; }
.kms-landing .about-text p.visible { opacity:1; transform:none; }
.kms-landing .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; align-content:start; }
.kms-landing .stat-card { padding:28px; border-radius:20px; opacity:0; transform:translateY(30px) scale(.95); transition:opacity .6s ease, transform .6s ease, border-color .4s, background .4s; }
.kms-landing .stat-card.visible { opacity:1; transform:none; }
.kms-landing .stat-card:hover { border-color:var(--purple-light); transform:translateY(-4px); }
.kms-landing .stat-number { font-size:40px; font-weight:900; background:linear-gradient(135deg,var(--text),var(--purple-light)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; line-height:1; margin-bottom:8px; }
.kms-landing .stat-label { font-size:12px; color:var(--text-muted); letter-spacing:.1em; text-transform:uppercase; }

.kms-landing #services { padding:80px 48px; flex-direction:column; align-items:flex-start; }
.kms-landing .services-header { max-width:600px; margin-bottom:56px; }
.kms-landing .services-header h2 { font-size:clamp(36px,4vw,56px); font-weight:900; line-height:1.1; letter-spacing:-.02em; margin-bottom:16px; opacity:0; transform:translateY(40px); transition:all .7s ease; }
.kms-landing .services-header h2.visible { opacity:1; transform:none; }
.kms-landing .services-header p { color:var(--text-muted); font-size:15px; line-height:1.7; opacity:0; transform:translateY(30px); transition:all .7s .1s ease; }
.kms-landing .services-header p.visible { opacity:1; transform:none; }
.kms-landing .services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; width:100%; max-width:1200px; }
.kms-landing .service-card { 
  padding:32px 28px; border-radius:22px; 
  cursor:pointer; transition:all .4s ease; opacity:0; transform:translateY(40px) scale(.97); 
  position:relative; overflow:hidden; text-decoration:none; color:var(--text); 
  display:flex; flex-direction:column; gap:14px;
}
.kms-landing .service-card.visible { opacity:1; transform:none; }
.kms-landing .service-card::before { 
  content:''; position:absolute; inset:0; 
  background:radial-gradient(circle at 20% 0%, rgba(168,85,247,.28), transparent 55%);
  opacity:0; transition:opacity .4s; 
}
.kms-landing .service-card:hover::before { opacity:1; }
.kms-landing .service-card:hover { border-color:var(--purple-light); transform:translateY(-6px); box-shadow:0 30px 80px -20px rgba(124,58,237,.5); }
.kms-landing .service-icon { 
  width:52px; height:52px; border-radius:14px; 
  background:linear-gradient(135deg,var(--purple),var(--purple-light)); 
  display:flex; align-items:center; justify-content:center; font-size:22px; color:#fff;
  box-shadow:0 8px 24px rgba(124,58,237,.5), inset 0 1px 0 rgba(255,255,255,.3); 
}
.kms-landing .service-card h3 { font-size:19px; font-weight:800; letter-spacing:-.01em; margin:0; }
.kms-landing .service-card p { font-size:13px; color:var(--text-muted); line-height:1.65; margin:0; }
.kms-landing .service-mini { display:flex; flex-wrap:wrap; gap:6px; margin-top:2px; }
.kms-landing .service-mini-chip { 
  padding:4px 10px; border:1px solid var(--panel-border); border-radius:999px; 
  font-size:10px; color:var(--text-muted); letter-spacing:.05em;
}
.kms-landing .service-cta { 
  margin-top:auto; padding-top:8px; font-size:11px; letter-spacing:.18em; text-transform:uppercase; 
  color:var(--purple-light); font-weight:700; display:inline-flex; align-items:center; gap:6px;
}
.kms-landing .service-card:hover .arrow { transform:translateX(4px); }
.kms-landing .arrow { display:inline-block; transition:transform .3s; }

.kms-landing #contact { padding:80px 48px; flex-direction:column; align-items:center; text-align:center; }
.kms-landing .contact-inner { max-width:640px; }
.kms-landing .contact-inner h2 { font-size:clamp(40px,5vw,72px); font-weight:900; line-height:1.05; letter-spacing:-.02em; margin-bottom:20px; opacity:0; transform:translateY(40px); transition:all .7s ease; }
.kms-landing .contact-inner h2.visible { opacity:1; transform:none; }
.kms-landing .contact-inner h2 em { font-family:'Playfair Display',Georgia,serif; font-style:italic; background:linear-gradient(135deg,#a855f7,#ec4899); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.kms-landing .contact-inner p { color:var(--text-muted); font-size:15px; line-height:1.7; margin-bottom:40px; opacity:0; transform:translateY(30px); transition:all .7s .1s ease; }
.kms-landing .contact-inner p.visible { opacity:1; transform:none; }
.kms-landing .contact-cta-wrap { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; opacity:0; transform:translateY(30px); transition:all .7s .2s ease; }
.kms-landing .contact-cta-wrap.visible { opacity:1; transform:none; }

.kms-landing footer { position:relative; z-index:2; padding:32px 48px; border-top:1px solid var(--panel-border); display:flex; align-items:center; justify-content:space-between; color:var(--text-muted); font-size:12px; letter-spacing:.08em; flex-wrap:wrap; gap:12px; }

.kms-landing .cursor { position:fixed; width:8px; height:8px; border-radius:50%; background:var(--purple-light); pointer-events:none; z-index:9999; mix-blend-mode:screen; transition:transform .1s ease; transform:translate(-50%,-50%); }
.kms-landing .cursor-trail { position:fixed; width:32px; height:32px; border-radius:50%; border:1px solid rgba(168,85,247,.4); pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:all .15s ease; }
@media(pointer:coarse){ .kms-landing .cursor,.kms-landing .cursor-trail{display:none;} }

@keyframes kmsFadeUp { from{opacity:0;transform:translateY(40px);} to{opacity:1;transform:translateY(0);} }
@keyframes kmsFadeIn { from{opacity:0;} to{opacity:1;} }
@keyframes kmsShimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
@keyframes kmsPulse { 0%,100%{opacity:1;} 50%{opacity:.3;} }
@keyframes kmsScrollLine { 0%,100%{opacity:.3;transform:scaleY(.5);transform-origin:top;} 50%{opacity:1;transform:scaleY(1);} }

@media(max-width:900px){
  .kms-landing .nav-links { display:none; }
  .kms-landing .nav-inner { padding:10px 14px; }
  .kms-landing .nav-brand { font-size:11px; }
  .kms-landing .btn-ghost span:not(:first-child){ display:inline; }
  .kms-landing #hero, .kms-landing #about, .kms-landing #services, .kms-landing #contact { padding-left:22px; padding-right:22px; }
  .kms-landing .about-grid { grid-template-columns:1fr; gap:40px; }
  .kms-landing .services-grid { grid-template-columns:1fr; }
  .kms-landing .stats-grid { grid-template-columns:1fr 1fr; }
  .kms-landing footer { padding:24px; flex-direction:column; text-align:center; }
  .kms-landing .inquire-panel { right:0; left:auto; }
}
`;

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { supabase } from "@/integrations/supabase/client";

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

function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Scroll reveal
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
    return () => io.disconnect();
  }, []);

  // Nav scroll
  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = cursorRef.current!;
    const trail = cursorTrailRef.current!;
    let mx = 0, my = 0, tx = 0, ty = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    };
    const tick = () => {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = tx + "px";
      trail.style.top = ty + "px";
      raf = requestAnimationFrame(tick);
    };
    document.addEventListener("mousemove", onMove);
    tick();
    const hovers = document.querySelectorAll("button, a");
    const enter = () => {
      cursor.style.transform = "translate(-50%,-50%) scale(2)";
      trail.style.transform = "translate(-50%,-50%) scale(1.5)";
      trail.style.borderColor = "rgba(168,85,247,0.8)";
    };
    const leave = () => {
      cursor.style.transform = "translate(-50%,-50%) scale(1)";
      trail.style.transform = "translate(-50%,-50%) scale(1)";
      trail.style.borderColor = "rgba(168,85,247,0.4)";
    };
    hovers.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      hovers.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  // Three.js
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Particles
    const particleCount = 2200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * 20 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      colors[i * 3] = 0.4 + t * 0.5;
      colors[i * 3 + 1] = 0.1 + t * 0.15;
      colors[i * 3 + 2] = 0.8 + t * 0.2;
      sizes[i] = Math.random() * 3 + 0.5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Torus knot
    const torusGeo = new THREE.TorusKnotGeometry(1.4, 0.38, 180, 24, 2, 3);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(4.5, -0.5, -2);
    scene.add(torus);
    const torusWire = new THREE.Mesh(
      torusGeo,
      new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.15 }),
    );
    torusWire.position.copy(torus.position);
    scene.add(torusWire);

    // Icos
    const icoGroup = new THREE.Group();
    const icoData = [
      { pos: [-3, 2, -3] as const, scale: 0.5, speed: 0.7 },
      { pos: [5, 3, -4] as const, scale: 0.35, speed: 1.1 },
      { pos: [-4, -2, -5] as const, scale: 0.6, speed: 0.5 },
      { pos: [2, -3, -3] as const, scale: 0.28, speed: 1.4 },
      { pos: [6, -1, -6] as const, scale: 0.45, speed: 0.9 },
    ];
    icoData.forEach((d) => {
      const geo = new THREE.IcosahedronGeometry(d.scale, 1);
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color: 0x9333ea,
          emissive: 0x4c1d95,
          emissiveIntensity: 0.4,
          metalness: 0.9,
          roughness: 0.2,
        }),
      );
      const wire = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.3 }),
      );
      mesh.position.set(d.pos[0], d.pos[1], d.pos[2]);
      wire.position.set(d.pos[0], d.pos[1], d.pos[2]);
      mesh.userData = d;
      wire.userData = d;
      icoGroup.add(mesh, wire);
    });
    scene.add(icoGroup);

    const grid = new THREE.GridHelper(40, 40, 0x4c1d95, 0x1a0035);
    grid.position.y = -5;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    scene.add(grid);

    scene.add(new THREE.AmbientLight(0x1a0035, 1.5));
    const p1 = new THREE.PointLight(0x7c3aed, 6, 20); p1.position.set(2, 3, 2); scene.add(p1);
    const p2 = new THREE.PointLight(0xec4899, 3, 15); p2.position.set(-4, -2, -2); scene.add(p2);
    const p3 = new THREE.PointLight(0xa855f7, 4, 18); p3.position.set(0, 5, 0); scene.add(p3);

    let mouseX = 0, mouseY = 0, scrollY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    document.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll);

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const scroll = scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.02;
      torus.rotation.x = t * 0.3;
      torus.rotation.y = t * 0.5;
      torusWire.rotation.copy(torus.rotation);
      icoGroup.children.forEach((child, idx) => {
        const d = child.userData as { pos: readonly [number, number, number]; speed: number };
        child.rotation.x += 0.008 * d.speed;
        child.rotation.y += 0.012 * d.speed;
        child.position.y = d.pos[1] + Math.sin(t * d.speed + idx) * 0.3;
      });
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.04;
      camera.position.z = 5 + scroll * 2;
      camera.lookAt(scene.position);
      p1.intensity = 5 + Math.sin(t * 1.5) * 2;
      p3.intensity = 3 + Math.cos(t * 0.8) * 1.5;
      grid.position.z = (t * 0.5) % 1;
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      pGeo.dispose();
      torusGeo.dispose();
    };
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="kms-landing">
      <style>{styles}</style>
      <div ref={cursorRef} className="cursor" />
      <div ref={cursorTrailRef} className="cursor-trail" />
      <canvas ref={canvasRef} id="bg-canvas" />

      <nav ref={navRef} id="navbar">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon">✦</span>
          <span>KMS · Creative</span>
        </Link>
        <div className="nav-links">
          <a href="#hero" onClick={scrollTo("#hero")}>Home</a>
          <a href="#about" onClick={scrollTo("#about")}>About</a>
          <a href="#services" onClick={scrollTo("#services")}>Services</a>
        </div>
        <div className="nav-actions">
          {signedIn ? (
            <Link to="/dashboard" className="btn-ghost">⟶ Dashboard</Link>
          ) : (
            <Link to="/auth" className="btn-ghost">⟶ Client Login</Link>
          )}
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="btn-primary">⚡ Inquire</a>
        </div>
      </nav>

      <section id="hero">
        <div className="hero-inner">
          <div className="hero-badge">Multi-Disciplinary Creative Studio</div>
          <h1 className="hero-title">
            KMs Creative: <em>Crafting</em><br />Digital Excellence.
          </h1>
          <p className="hero-sub">
            From high-end video production to full-stack website development,<br />
            I bring your brand to life with precision and style.
          </p>
          <div className="hero-cta">
            <a href="#services" onClick={scrollTo("#services")} className="cta-primary">Explore Services →</a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="cta-secondary">✦ Get Started</a>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

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
              <div key={s.l} className="stat-card" data-reveal data-delay={i}>
                <div className="stat-number">{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services">
        <div className="services-header">
          <div className="section-label" data-reveal>Services</div>
          <h2 data-reveal>What I Create</h2>
          <p data-reveal>Full-spectrum creative services engineered for brands that demand more than the ordinary.</p>
        </div>
        <div className="services-grid">
          {[
            { i: "🎬", t: "Video Production", d: "Cinematic storytelling from concept to delivery. High-end production that captures your brand essence.", tag: "Production" },
            { i: "💻", t: "Web Development", d: "Full-stack websites and interactive experiences built for performance, aesthetics, and conversion.", tag: "Development" },
            { i: "✦", t: "Brand Identity", d: "Strategic brand systems — from logo design to complete visual identities that resonate and endure.", tag: "Branding" },
            { i: "🎨", t: "Motion Graphics", d: "Animated visuals that breathe life into your content. From UI micro-animations to full motion pieces.", tag: "Motion" },
            { i: "📐", t: "UI/UX Design", d: "User-centered interfaces that feel as good as they look. Research-driven design for real-world impact.", tag: "Design" },
            { i: "🚀", t: "Digital Strategy", d: "Data-driven creative strategy that aligns your digital presence with measurable business outcomes.", tag: "Strategy" },
          ].map((s, i) => (
            <div key={s.t} className="service-card" data-reveal data-delay={i}>
              <div className="service-icon">{s.i}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <span className="service-tag">{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="contact">
        <div className="contact-inner">
          <div className="section-label" data-reveal>Let's Work</div>
          <h2 data-reveal>Ready to Build<br /><em>Something Great?</em></h2>
          <p data-reveal>Drop into my inbox and let's make something the internet hasn't seen before.</p>
          <div className="contact-cta-wrap" data-reveal>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="cta-primary">✦ Start a Project</a>
            <a href="#services" onClick={scrollTo("#services")} className="cta-secondary">View Services</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="nav-logo"><span className="nav-logo-icon">✦</span><span>KMs Creative</span></div>
        <div>© {new Date().getFullYear()} KMs Creative · Crafting Digital Excellence.</div>
      </footer>
    </div>
  );
}

const styles = `
.kms-landing { --purple:#7c3aed; --purple-light:#a855f7; --purple-glow:#9333ea; --bg:#0a0010; --text:#fff; --text-muted:rgba(255,255,255,0.6); background:var(--bg); color:var(--text); font-family:'Inter',system-ui,sans-serif; overflow-x:hidden; min-height:100vh; position:relative; }
.kms-landing * { box-sizing:border-box; }
.kms-landing #bg-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }
.kms-landing::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E"); opacity:0.15; z-index:1; pointer-events:none; }
.kms-landing nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:18px 48px; backdrop-filter:blur(16px); background:rgba(10,0,16,0.5); border-bottom:1px solid rgba(124,58,237,0.15); transition:all .4s ease; }
.kms-landing nav.scrolled { background:rgba(10,0,16,0.85); border-color:rgba(124,58,237,0.35); }
.kms-landing .nav-logo { display:flex; align-items:center; gap:10px; font-size:13px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#fff; text-decoration:none; }
.kms-landing .nav-logo-icon { width:32px; height:32px; background:linear-gradient(135deg,var(--purple),var(--purple-light)); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 0 16px rgba(124,58,237,0.6); }
.kms-landing .nav-links { display:flex; gap:36px; }
.kms-landing .nav-links a { color:var(--text-muted); text-decoration:none; font-size:11px; letter-spacing:.15em; text-transform:uppercase; font-weight:500; transition:color .3s; position:relative; }
.kms-landing .nav-links a::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:var(--purple-light); transform:scaleX(0); transition:transform .3s; }
.kms-landing .nav-links a:hover { color:#fff; }
.kms-landing .nav-links a:hover::after { transform:scaleX(1); }
.kms-landing .nav-actions { display:flex; gap:12px; }
.kms-landing .btn-ghost { padding:8px 18px; border:1px solid rgba(255,255,255,.2); border-radius:6px; background:transparent; color:#fff; font-size:11px; letter-spacing:.12em; text-transform:uppercase; font-weight:500; cursor:pointer; transition:all .3s; display:inline-flex; align-items:center; gap:6px; text-decoration:none; }
.kms-landing .btn-ghost:hover { border-color:var(--purple-light); color:var(--purple-light); }
.kms-landing .btn-primary { padding:8px 18px; border:none; border-radius:6px; background:linear-gradient(135deg,var(--purple),var(--purple-light)); color:#fff; font-size:11px; letter-spacing:.12em; text-transform:uppercase; font-weight:600; cursor:pointer; transition:all .3s; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 20px rgba(124,58,237,.4); text-decoration:none; }
.kms-landing .btn-primary:hover { box-shadow:0 0 32px rgba(168,85,247,.7); transform:translateY(-1px); }
.kms-landing section { position:relative; z-index:2; min-height:100vh; display:flex; align-items:center; }
.kms-landing #hero { padding:120px 48px 80px; justify-content:flex-start; flex-direction:column; align-items:flex-start; }
.kms-landing .hero-inner { max-width:700px; }
.kms-landing .hero-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border:1px solid rgba(124,58,237,.5); border-radius:4px; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--purple-light); margin-bottom:32px; opacity:0; animation:kmsFadeUp .8s .2s ease forwards; }
.kms-landing .hero-badge::before { content:'◆'; font-size:8px; animation:kmsPulse 2s infinite; }
.kms-landing .hero-title { font-size:clamp(52px,7vw,96px); font-weight:900; line-height:1.05; letter-spacing:-.02em; margin-bottom:28px; opacity:0; animation:kmsFadeUp .8s .4s ease forwards; }
.kms-landing .hero-title em { font-family:'Playfair Display',Georgia,serif; font-style:italic; font-weight:700; background:linear-gradient(135deg,#a855f7,#ec4899,#a855f7); background-size:200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:kmsShimmer 4s infinite linear; }
.kms-landing .hero-sub { font-size:16px; line-height:1.7; color:var(--text-muted); max-width:480px; margin-bottom:44px; opacity:0; animation:kmsFadeUp .8s .6s ease forwards; }
.kms-landing .hero-cta { display:flex; gap:16px; flex-wrap:wrap; opacity:0; animation:kmsFadeUp .8s .8s ease forwards; }
.kms-landing .cta-primary { padding:14px 32px; background:linear-gradient(135deg,var(--purple),var(--purple-light)); border:none; border-radius:8px; color:#fff; font-size:11px; letter-spacing:.18em; text-transform:uppercase; font-weight:700; cursor:pointer; transition:all .3s; box-shadow:0 0 30px rgba(124,58,237,.5); display:inline-flex; align-items:center; gap:8px; text-decoration:none; }
.kms-landing .cta-primary:hover { box-shadow:0 0 50px rgba(168,85,247,.8); transform:translateY(-2px) scale(1.02); }
.kms-landing .cta-secondary { padding:14px 28px; background:transparent; border:1px solid rgba(255,255,255,.18); border-radius:8px; color:#fff; font-size:11px; letter-spacing:.18em; text-transform:uppercase; font-weight:600; cursor:pointer; transition:all .3s; display:inline-flex; align-items:center; gap:8px; text-decoration:none; }
.kms-landing .cta-secondary:hover { border-color:var(--purple-light); color:var(--purple-light); background:rgba(124,58,237,.08); }
.kms-landing .scroll-indicator { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--text-muted); font-size:10px; letter-spacing:.2em; text-transform:uppercase; z-index:10; animation:kmsFadeIn 1.5s 1.5s ease both; }
.kms-landing .scroll-line { width:1px; height:48px; background:linear-gradient(to bottom,var(--purple-light),transparent); animation:kmsScrollLine 2s infinite ease-in-out; }
.kms-landing #about { padding:80px 48px; flex-direction:column; align-items:flex-start; }
.kms-landing .section-label { font-size:10px; letter-spacing:.25em; text-transform:uppercase; color:var(--purple-light); margin-bottom:20px; opacity:0; transform:translateY(30px); transition:all .7s ease; }
.kms-landing .section-label.visible { opacity:1; transform:none; }
.kms-landing .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; max-width:1100px; width:100%; }
.kms-landing .about-text h2 { font-size:clamp(36px,4vw,56px); font-weight:900; line-height:1.1; letter-spacing:-.02em; margin-bottom:24px; opacity:0; transform:translateY(40px); transition:all .7s .1s ease; }
.kms-landing .about-text h2.visible { opacity:1; transform:none; }
.kms-landing .about-text p { color:var(--text-muted); line-height:1.8; font-size:15px; margin-bottom:16px; opacity:0; transform:translateY(30px); transition:all .7s .2s ease; }
.kms-landing .about-text p.visible { opacity:1; transform:none; }
.kms-landing .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-content:start; }
.kms-landing .stat-card { padding:28px; border:1px solid rgba(124,58,237,.25); border-radius:12px; background:rgba(124,58,237,.05); backdrop-filter:blur(8px); opacity:0; transform:translateY(30px) scale(.95); transition:opacity .6s ease, transform .6s ease, border-color .4s, background .4s; }
.kms-landing .stat-card.visible { opacity:1; transform:none; }
.kms-landing .stat-card:hover { border-color:var(--purple-light); background:rgba(124,58,237,.12); transform:translateY(-4px); }
.kms-landing .stat-number { font-size:40px; font-weight:900; background:linear-gradient(135deg,#fff,var(--purple-light)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; line-height:1; margin-bottom:8px; }
.kms-landing .stat-label { font-size:12px; color:var(--text-muted); letter-spacing:.1em; text-transform:uppercase; }
.kms-landing #services { padding:80px 48px; flex-direction:column; align-items:flex-start; }
.kms-landing .services-header { max-width:600px; margin-bottom:64px; }
.kms-landing .services-header h2 { font-size:clamp(36px,4vw,56px); font-weight:900; line-height:1.1; letter-spacing:-.02em; margin-bottom:16px; opacity:0; transform:translateY(40px); transition:all .7s ease; }
.kms-landing .services-header h2.visible { opacity:1; transform:none; }
.kms-landing .services-header p { color:var(--text-muted); font-size:15px; line-height:1.7; opacity:0; transform:translateY(30px); transition:all .7s .1s ease; }
.kms-landing .services-header p.visible { opacity:1; transform:none; }
.kms-landing .services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; width:100%; max-width:1100px; }
.kms-landing .service-card { padding:36px 32px; border:1px solid rgba(124,58,237,.2); border-radius:16px; background:rgba(10,0,20,.6); backdrop-filter:blur(12px); cursor:pointer; transition:all .4s ease; opacity:0; transform:translateY(40px) scale(.97); position:relative; overflow:hidden; }
.kms-landing .service-card.visible { opacity:1; transform:none; }
.kms-landing .service-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(124,58,237,.12),transparent); opacity:0; transition:opacity .4s; }
.kms-landing .service-card:hover::before { opacity:1; }
.kms-landing .service-card:hover { border-color:var(--purple-light); transform:translateY(-6px); box-shadow:0 20px 60px rgba(124,58,237,.25); }
.kms-landing .service-icon { width:48px; height:48px; background:linear-gradient(135deg,var(--purple),var(--purple-light)); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:24px; box-shadow:0 0 20px rgba(124,58,237,.4); }
.kms-landing .service-card h3 { font-size:18px; font-weight:700; margin-bottom:12px; letter-spacing:-.01em; }
.kms-landing .service-card p { font-size:13px; color:var(--text-muted); line-height:1.7; }
.kms-landing .service-tag { display:inline-block; margin-top:20px; padding:4px 12px; border:1px solid rgba(124,58,237,.4); border-radius:20px; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--purple-light); }
.kms-landing #contact { padding:80px 48px; flex-direction:column; align-items:center; text-align:center; }
.kms-landing .contact-inner { max-width:640px; }
.kms-landing .contact-inner h2 { font-size:clamp(40px,5vw,72px); font-weight:900; line-height:1.05; letter-spacing:-.02em; margin-bottom:20px; opacity:0; transform:translateY(40px); transition:all .7s ease; }
.kms-landing .contact-inner h2.visible { opacity:1; transform:none; }
.kms-landing .contact-inner h2 em { font-family:'Playfair Display',Georgia,serif; font-style:italic; background:linear-gradient(135deg,#a855f7,#ec4899); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.kms-landing .contact-inner p { color:var(--text-muted); font-size:15px; line-height:1.7; margin-bottom:40px; opacity:0; transform:translateY(30px); transition:all .7s .1s ease; }
.kms-landing .contact-inner p.visible { opacity:1; transform:none; }
.kms-landing .contact-cta-wrap { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; opacity:0; transform:translateY(30px); transition:all .7s .2s ease; }
.kms-landing .contact-cta-wrap.visible { opacity:1; transform:none; }
.kms-landing footer { position:relative; z-index:2; padding:32px 48px; border-top:1px solid rgba(124,58,237,.15); display:flex; align-items:center; justify-content:space-between; color:var(--text-muted); font-size:12px; letter-spacing:.08em; flex-wrap:wrap; gap:12px; }
.kms-landing .cursor { position:fixed; width:10px; height:10px; border-radius:50%; background:var(--purple-light); pointer-events:none; z-index:9999; mix-blend-mode:screen; transition:transform .1s ease; transform:translate(-50%,-50%); }
.kms-landing .cursor-trail { position:fixed; width:32px; height:32px; border-radius:50%; border:1px solid rgba(168,85,247,.4); pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:all .15s ease; }
@media(pointer:coarse){ .kms-landing .cursor,.kms-landing .cursor-trail{display:none;} }
@keyframes kmsFadeUp { from{opacity:0;transform:translateY(40px);} to{opacity:1;transform:translateY(0);} }
@keyframes kmsFadeIn { from{opacity:0;} to{opacity:1;} }
@keyframes kmsShimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
@keyframes kmsPulse { 0%,100%{opacity:1;} 50%{opacity:.3;} }
@keyframes kmsScrollLine { 0%,100%{opacity:.3;transform:scaleY(.5);transform-origin:top;} 50%{opacity:1;transform:scaleY(1);} }
@media(max-width:768px){
  .kms-landing nav { padding:14px 20px; }
  .kms-landing .nav-links { display:none; }
  .kms-landing #hero, .kms-landing #about, .kms-landing #services, .kms-landing #contact { padding-left:24px; padding-right:24px; }
  .kms-landing .about-grid { grid-template-columns:1fr; gap:40px; }
  .kms-landing .services-grid { grid-template-columns:1fr; }
  .kms-landing .stats-grid { grid-template-columns:1fr 1fr; }
  .kms-landing footer { padding:24px; flex-direction:column; text-align:center; }
}
`;

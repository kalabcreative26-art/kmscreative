import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 3D floating glass artefact — a torus knot with iridescent, glassy shading.
 * Fixed to the top-right area; drifts gently and reacts subtly to mouse.
 */
export function GlassArtefact() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights — high contrast rims to sell the glass
    const key = new THREE.PointLight(0xc084fc, 40, 20);
    key.position.set(4, 3, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x60a5fa, 30, 20);
    rim.position.set(-4, -2, 3);
    scene.add(rim);
    const fill = new THREE.PointLight(0xf0abfc, 20, 20);
    fill.position.set(0, -4, 4);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x2a1a55, 1.2));

    // Env-like gradient via a large sphere with vertex colours
    const envGeo = new THREE.SphereGeometry(12, 32, 32);
    const envMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        top: { value: new THREE.Color(0x2a0a4a) },
        bottom: { value: new THREE.Color(0x0a0620) },
      },
      vertexShader: `
        varying vec3 vN;
        void main() {
          vN = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vN;
        uniform vec3 top; uniform vec3 bottom;
        void main() {
          float t = smoothstep(-1.0, 1.0, vN.y);
          gl_FragColor = vec4(mix(bottom, top, t), 1.0);
        }`,
    });
    const env = new THREE.Mesh(envGeo, envMat);
    scene.add(env);
    // Use env only for reflections, not visually
    env.visible = false;

    const cubeRT = new THREE.WebGLCubeRenderTarget(128);
    const cubeCam = new THREE.CubeCamera(0.1, 100, cubeRT);
    scene.add(cubeCam);
    env.visible = true;
    cubeCam.update(renderer, scene);
    env.visible = false;

    // Main artefact — torus knot with glassy iridescent material
    const geo = new THREE.TorusKnotGeometry(1.05, 0.34, 240, 40, 2, 3);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.15,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 1.2,
      ior: 1.45,
      iridescence: 1,
      iridescenceIOR: 1.3,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMap: cubeRT.texture,
      envMapIntensity: 1.4,
    });
    const knot = new THREE.Mesh(geo, mat);
    scene.add(knot);

    // Orbiting orb
    const orbGeo = new THREE.IcosahedronGeometry(0.28, 2);
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      metalness: 0.3,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.6,
      ior: 1.5,
      envMap: cubeRT.texture,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.4,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orb);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let running = true;
    const start = performance.now();

    const tick = () => {
      if (!running) return;
      const t = (performance.now() - start) / 1000;
      knot.rotation.x = t * 0.25 + mouse.y * 0.4;
      knot.rotation.y = t * 0.35 + mouse.x * 0.6;
      knot.position.y = Math.sin(t * 0.6) * 0.2;

      orb.position.set(
        Math.cos(t * 0.7) * 2.2,
        Math.sin(t * 0.9) * 1.2,
        Math.sin(t * 0.7) * 1.4,
      );
      orb.rotation.x = t * 0.6;
      orb.rotation.y = t * 0.8;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      geo.dispose();
      mat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
      envGeo.dispose();
      envMat.dispose();
      cubeRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 -z-[5] w-[70vw] max-w-[720px] h-[70vh] max-h-[720px] opacity-70 mix-blend-screen"
    />
  );
}

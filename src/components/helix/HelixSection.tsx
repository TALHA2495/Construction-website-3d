"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

const COUNT = 9;
const W_SEGS = 32;
const GRID_H_SEGS = 12;
const HELIX_CARD_H = 1.34;
const HELIX_CARD_W = 2.8;
const GRID_CARD_H = 1.77;
const GRID_CARD_W = 2.54;

const R = 4.45;
const Y_START = -1.09;
const pitchPerRad = 0.82;
const MID = 0.0;
const DIP_A = 0.52;
const DIP_S = 1.20;

const dsPerRad = Math.sqrt(R * R + pitchPerRad * pitchPerRad);
const CARD_ARC_WIDTH = 2.18;
const GAP_ARC = 0.24;
const STEP_ARC = CARD_ARC_WIDTH + GAP_ARC;

const TRAVEL_TURNS = 3.18;
const TRAVEL_ARC = Math.PI * 2 * TRAVEL_TURNS * dsPerRad;
const BASE_ARC = -43.10;

const STACK_START = 0.655;
const GRID_ORDER = [1, 2, 3, 4, 5, 6];

const GRID_TARGETS = [
  new THREE.Vector3(-2.72, 0.98, 0.12),
  new THREE.Vector3(0, 0.98, 0.10),
  new THREE.Vector3(2.72, 0.98, 0.08),
  new THREE.Vector3(-2.72, -0.98, 0.08),
  new THREE.Vector3(0, -0.98, 0.06),
  new THREE.Vector3(2.72, -0.98, 0.10),
];

const GRID_ENTRANCES = [
  new THREE.Vector3(-8.2, 5.6, 0.55),
  new THREE.Vector3(0, 5.95, 0.40),
  new THREE.Vector3(8.2, 5.6, 0.55),
  new THREE.Vector3(-8.0, -5.75, 0.45),
  new THREE.Vector3(0, -6.05, 0.36),
  new THREE.Vector3(8.0, -5.75, 0.45),
];

const STACK_STAGGER = 0.07;
const GRID_MOVE_DURATION = 0.34;
const GRID_DESKTOP_BREAKPOINT = 1200;
const GRID_MOBILE_BREAKPOINT = 600;

const CARD_ASSETS = [
  "/images/hero-desktop.jpg",
  "/images/hero-mobile.jpg",
  "/images/hero-desktop.jpg",
  "/images/hero-mobile.jpg",
  "/images/hero-desktop.jpg",
  "/images/hero-mobile.jpg",
  "/images/hero-desktop.jpg",
  "/images/hero-mobile.jpg",
  "/images/hero-desktop.jpg",
];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/* Shared scroll-progress store — ref for animation (no re-render), state for conditional render */
const scrollStore = { current: 0 };
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const st = window.scrollY;
      const wh = window.innerHeight;
      const dh = document.documentElement.scrollHeight - wh;
      const p = dh > 0 ? clamp(st / dh) : 0;
      scrollStore.current = p;
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { ref: scrollStore, state: progress };
}

function dip(a: number) {
  const d = (a - MID) / DIP_S;
  return DIP_A * Math.exp(-d * d);
}

function hPos(a: number, out = new THREE.Vector3()) {
  return out.set(R * Math.cos(a), Y_START + a * pitchPerRad - dip(a), R * Math.sin(a));
}

const _v2 = new THREE.Vector3();
function tangent(a: number, out = new THREE.Vector3()) {
  const e = 0.0001;
  hPos(a - e, _v2);
  hPos(a + e, out);
  return out.sub(_v2).normalize();
}

function normal(a: number, out = new THREE.Vector3()) {
  const t = tangent(a, out);
  const worldUp = new THREE.Vector3(0, 1, 0);
  return out.crossVectors(t, worldUp).normalize();
}

function createBentCardGeometry(w: number, h: number, wSegs: number, hSegs: number) {
  const positions = new Float32Array((wSegs + 1) * (hSegs + 1) * 3);
  const normals = new Float32Array((wSegs + 1) * (hSegs + 1) * 3);
  const uvs = new Float32Array((wSegs + 1) * (hSegs + 1) * 2);
  const indices: number[] = [];
  const cardArc = CARD_ARC_WIDTH;
  const halfW = w / 2;

  for (let y = 0; y <= hSegs; y++) {
    const vy = y / hSegs;
    const yPos = (vy - 0.5) * h;
    for (let x = 0; x <= wSegs; x++) {
      const vx = x / wSegs;
      const xPos = (vx - 0.5) * w;
      const arcAngle = (xPos / halfW) * (cardArc / R);
      const px = R * Math.sin(arcAngle);
      const pz = -R * Math.cos(arcAngle) + R;
      const idx = (y * (wSegs + 1) + x) * 3;
      positions[idx] = px;
      positions[idx + 1] = yPos;
      positions[idx + 2] = pz;
      const nx = Math.sin(arcAngle);
      const nz = -Math.cos(arcAngle);
      normals[idx] = nx;
      normals[idx + 1] = 0;
      normals[idx + 2] = nz;
      const uvidx = (y * (wSegs + 1) + x) * 2;
      uvs[uvidx] = vx;
      uvs[uvidx + 1] = 1 - vy;
    }
  }

  for (let y = 0; y < hSegs; y++) {
    for (let x = 0; x < wSegs; x++) {
      const a = y * (wSegs + 1) + x;
      const b = y * (wSegs + 1) + x + 1;
      const c = (y + 1) * (wSegs + 1) + x + 1;
      const d = (y + 1) * (wSegs + 1) + x;
      indices.push(a, b, d, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

function createGuideLine(samples: number, radius: number, pitch: number, turns: number) {
  const positions = new Float32Array(samples * 3);
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const angle = t * Math.PI * 2 * turns;
    const y = t * pitch * turns * 2 - pitch * turns;
    positions[i * 3] = radius * Math.cos(angle);
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = radius * Math.sin(angle);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}


function Card({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(CARD_ASSETS[index], (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({ map: t });
      if (meshRef.current) meshRef.current.material = mat;
    });
  }, [index]);
  useFrame(() => {
    if (!meshRef.current) return;
    const progress = scrollStore.current;
    const cardOffset = (index / COUNT) * STEP_ARC;
    const arcPos = clamp((progress * TRAVEL_ARC + BASE_ARC + cardOffset) / TRAVEL_ARC, 0, 1);
    const a = arcPos * Math.PI * 2 * TRAVEL_TURNS;
    const pos = hPos(a);
    const tan = tangent(a);
    const nrm = normal(a);
    const matrix = new THREE.Matrix4();
    matrix.lookAt(pos, pos.add(tan), nrm);
    meshRef.current.position.copy(pos);
    meshRef.current.rotation.setFromRotationMatrix(matrix);
    meshRef.current.rotation.z += Math.PI / 2;
    const scale = 1 - 0.3 * Math.abs(arcPos - 0.5) * 2;
    meshRef.current.scale.setScalar(scale);
    const opacity = arcPos > 0.05 && arcPos < 0.95 ? 1 : 0;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity;
    mat.transparent = true;
  });
  return (
    <mesh ref={meshRef} geometry={createBentCardGeometry(HELIX_CARD_W, HELIX_CARD_H, W_SEGS, GRID_H_SEGS)}>
      <meshBasicMaterial color={0x9b8468} transparent opacity={0} />
    </mesh>
  );
}

function GuideLine({ color, radius, pitch, turns, zOffset }: { color: number; radius: number; pitch: number; turns: number; zOffset: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.z = zOffset;
  });
  return (
    <mesh ref={meshRef} geometry={createGuideLine(240, radius, pitch, turns)}>
      <lineBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

function GridCard({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [active, setActive] = useState(false);
  const [target, setTarget] = useState(new THREE.Vector3());
  const [entrance, setEntrance] = useState(new THREE.Vector3());
  const [moveProgress, setMoveProgress] = useState(0);
  useEffect(() => {
    const gi = GRID_ORDER[index] - 1;
    setTarget(GRID_TARGETS[gi].clone());
    setEntrance(GRID_ENTRANCES[gi].clone());
    const startTime = performance.now();
    const delay = index * STACK_STAGGER * 1000;
    const duration = GRID_MOVE_DURATION * 1000;
    function animate() {
      const now = performance.now();
      if (now < startTime + delay) { requestAnimationFrame(animate); return; }
      const t = clamp((now - startTime - delay) / duration, 0, 1);
      setMoveProgress(smoother(t));
      if (t < 1) requestAnimationFrame(animate);
      else setActive(true);
    }
    requestAnimationFrame(animate);
  }, [index]);
  useFrame(() => {
    if (!meshRef.current) return;
    if (!active) { meshRef.current.position.copy(entrance); return; }
    meshRef.current.position.lerpVectors(entrance, target, moveProgress);
  });
  return (
    <mesh ref={meshRef} geometry={createBentCardGeometry(GRID_CARD_W, GRID_CARD_H, W_SEGS, GRID_H_SEGS)}>
      <meshBasicMaterial color={active ? 0x9b8468 : 0x6b6a61} transparent opacity={active ? 1 : 0.5} />
    </mesh>
  );
}

function HelixScene() {
  const { size } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const { state: scrollProgress } = useScrollProgress();
  const [currentLayout, setCurrentLayout] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      if (w >= GRID_DESKTOP_BREAKPOINT) setCurrentLayout("desktop");
      else if (w > GRID_MOBILE_BREAKPOINT) setCurrentLayout("tablet");
      else setCurrentLayout("mobile");
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useFrame(() => {
    if (!cameraRef.current) return;
    cameraRef.current.aspect = size.width / size.height;
    cameraRef.current.updateProjectionMatrix();
  });

  return (
    <>
      <perspectiveCamera ref={cameraRef} position={[0, 0, 9.25]} fov={35} near={0.1} far={100} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      {Array.from({ length: COUNT }).map((_, i) => (
        <Card key={i} index={i} />
      ))}

      <GuideLine color={0xbbbbbb} radius={R + 0.5} pitch={pitchPerRad * 2} turns={TRAVEL_TURNS} zOffset={-0.5} />
      <GuideLine color={0xaaaaaa} radius={R - 0.5} pitch={pitchPerRad * 2} turns={TRAVEL_TURNS} zOffset={0.5} />

      {scrollProgress > STACK_START && currentLayout !== "mobile" && (
        <>
          {GRID_ORDER.map((_, i) => (
            <GridCard key={i} index={i} />
          ))}
        </>
      )}
    </>
  );
}

function WebGLFallback() {
  return (
    <section className="bg-[#f2f0ea] min-h-[90vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-[#10110f]">Architectural Flythrough</h2>
        <p className="mt-4 text-[#77766f]">
          WebGL is not available on this device. A static preview is shown instead.
        </p>
        <img src="/images/hero-desktop.jpg" alt="Residence preview" className="mt-8 max-w-md mx-auto rounded-md shadow-lg" />
      </div>
    </section>
  );
}

export default function HelixSection() {
  const [isClient, setIsClient] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check WebGL support on client only
    try {
      const c = document.createElement("canvas");
      const webgl = !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
      if (!webgl) setShowFallback(true);
    } catch {
      setShowFallback(true);
    }
    // Check reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setShowFallback(true);
    const h = () => {
      if (mq.matches) setShowFallback(true);
    };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // During SSR, always render Canvas (client will reconcile)
  if (showFallback && isClient) return <WebGLFallback />;

  return (
    <section className="bg-[#f2f0ea] relative overflow-hidden">
      <Canvas className="block w-full h-full" camera={{ position: [0, 0, 9.25], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <HelixScene />
      </Canvas>
    </section>
  );
}


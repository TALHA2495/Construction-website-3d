"use client";

/**
 * Scroll-driven 3D helix â€” R3F port of the canonical Web Fueled reference
 * (https://github.com/webfueled/web-fueled-helix, main.js).
 *
 * Fidelity rules (see .agents/skills/threejs-helix/SKILL.md):
 * - Geometry/timing/camera constants copied verbatim from the reference.
 * - Helix cards re-wrapped column-by-column onto the helix every frame
 *   (bent, deformed surfaces â€” not rigid planes moved around a circle).
 * - Two guide lines travel opposite the card direction; upper renders
 *   behind cards (depthTest on, renderOrder 1), lower in front
 *   (depthTest off, renderOrder 10).
 * - Closing grid: 6 cards, scroll-synced staggered entrance with
 *   sheet-like per-vertex ripple, responsive 3x2 / 2x3 / 1x6 layouts.
 * - Card textures use the reference cover-crop ShaderMaterial.
 * - One section-relative scroll timeline (track rect), smoothed in
 *   useFrame. No React state on scroll; no per-frame allocations.
 *
 * Documented deviations from the reference:
 * - Outline line buffers preallocated and updated in place instead of
 *   `setFromPoints` (allocation-free requirement).
 * - Card/grid geometries skip per-frame `computeBoundingSphere` (all
 *   meshes are frustumCulled = false, so it is unnecessary).
 * - Editorial copy adapted to construction ("DESIGN +", "BUILT TO LAST").
 */

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------------------------- constants ---------------------------- */

const COUNT = 9;
const W_SEGS = 32;
const GRID_H_SEGS = 12;
const OUTLINE_SAMPLES = 240;
const HELIX_CARD_H = 1.34;
const HELIX_CARD_W = 2.8;
const GRID_CARD_H = 1.77;
const GRID_CARD_W = 2.54;

const CARD_ASSETS = [
  "/images/helix/helix-01.jpg",
  "/images/helix/helix-02.jpg",
  "/images/helix/helix-03.jpg",
  "/images/helix/helix-04.jpg",
  "/images/helix/helix-05.jpg",
  "/images/helix/helix-06.jpg",
  "/images/helix/helix-07.jpg",
  "/images/helix/helix-08.jpg",
  "/images/helix/helix-09.jpg",
];

const R = 4.45;
const Y_START = -1.09;
const pitchPerRad = 0.82;
const MID = 0.0;
const DIP_A = 0.52;
const DIP_S = 1.2;
const dsPerRad = Math.sqrt(R * R + pitchPerRad * pitchPerRad);
const CARD_ARC_WIDTH = 2.18;
const GAP_ARC = 0.24;
const STEP_ARC = CARD_ARC_WIDTH + GAP_ARC;
const TRAVEL_TURNS = 3.18;
const TRAVEL_ARC = Math.PI * 2 * TRAVEL_TURNS * dsPerRad;
const BASE_ARC = -43.1;
const HELIX_START = 0.095;
const HELIX_END = 0.91;
const HELIX_MID = (HELIX_START + HELIX_END) * 0.5;
const STACK_START = 0.655;
const STACK_END = 0.985;

const GRID_ORDER = [1, 2, 3, 4, 5, 6];
const DESKTOP_GRID_TARGETS = [
  new THREE.Vector3(-2.72, 0.98, 0.12),
  new THREE.Vector3(0, 0.98, 0.1),
  new THREE.Vector3(2.72, 0.98, 0.08),
  new THREE.Vector3(-2.72, -0.98, 0.08),
  new THREE.Vector3(0, -0.98, 0.06),
  new THREE.Vector3(2.72, -0.98, 0.1),
];
const GRID_ENTRANCES = [
  new THREE.Vector3(-8.2, 5.6, 0.55),
  new THREE.Vector3(0, 5.95, 0.4),
  new THREE.Vector3(8.2, 5.6, 0.55),
  new THREE.Vector3(-8.0, -5.75, 0.45),
  new THREE.Vector3(0, -6.05, 0.36),
  new THREE.Vector3(8.0, -5.75, 0.45),
];
const GRID_START_ROT = [
  new THREE.Euler(0.06, -0.16, -0.18),
  new THREE.Euler(0.11, 0.0, -0.04),
  new THREE.Euler(0.06, 0.16, 0.18),
  new THREE.Euler(-0.05, -0.15, -0.17),
  new THREE.Euler(-0.1, 0.0, 0.05),
  new THREE.Euler(-0.05, 0.15, 0.17),
];
const STACK_STAGGER = 0.07;
const GRID_MOVE_DURATION = 0.34;
const GRID_DESKTOP_BREAKPOINT = 1200;
const GRID_MOBILE_BREAKPOINT = 600;

/* ------------------------- math + scratch -------------------------- */

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function dip(a: number) {
  const d = (a - MID) / DIP_S;
  return DIP_A * Math.exp(-d * d);
}

function hPos(a: number, out: THREE.Vector3) {
  out.set(R * Math.cos(a), Y_START + a * pitchPerRad - dip(a), R * Math.sin(a));
  return out;
}

/* Shared scratch vectors â€” hot paths write into these (no allocation). */
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _cp = new THREE.Vector3();
const _tan = new THREE.Vector3();
const _up = new THREE.Vector3();
const _p = new THREE.Vector3();

function tangent(a: number, out: THREE.Vector3) {
  const e = 0.0015;
  hPos(a - e, _a);
  hPos(a + e, _b);
  out.copy(_b).sub(_a).normalize();
  return out;
}

/** Card "up": world up nudged toward radial, orthogonalized to tangent. */
function upVector(a: number, tan: THREE.Vector3, out: THREE.Vector3) {
  const radial = _b.set(Math.cos(a), 0, Math.sin(a)).normalize();
  out.set(0, 1, 0);
  out.lerp(radial, 0.07);
  out.addScaledVector(tan, -out.dot(tan)).normalize();
  return out;
}

/* ------------------- cover-crop card material ---------------------- */
/* Verbatim shader from the canonical reference: centered cover-style
   cropping per card aspect ratio, back-face UV flip, uniform opacity. */

function getTextureDimensions(tex: THREE.Texture) {
  const image = tex.image as
    | { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number }
    | undefined;
  return {
    width: image?.naturalWidth || image?.width || 1,
    height: image?.naturalHeight || image?.height || 1,
  };
}

function updateCoverCrop(material: THREE.ShaderMaterial, tex: THREE.Texture, targetAspect: number) {
  const { width, height } = getTextureDimensions(tex);
  const imageAspect = width / height;
  const coverScale = material.uniforms.coverScale.value as THREE.Vector2;
  if (imageAspect > targetAspect) {
    coverScale.set(targetAspect / imageAspect, 1);
  } else {
    coverScale.set(1, imageAspect / targetAspect);
  }
}

function buildCardMaterial(tex: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: tex },
      opacity: { value: 1.0 },
      coverScale: { value: new THREE.Vector2(1, 1) },
    },
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv=uv;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform vec2 coverScale;
      varying vec2 vUv;
      void main(){
        vec2 uv=(vUv-0.5)*coverScale+0.5;
        if(!gl_FrontFacing){
          uv.x=1.0-uv.x;
        }
        vec4 c=texture2D(map,uv);
        gl_FragColor=vec4(c.rgb,c.a*opacity);
      }
    `,
  });
}

/** Solid bronze 1x1 placeholder so failed loads degrade to a calm surface. */
function makePlaceholderTexture() {
  const data = new Uint8Array([155, 132, 104, 255]);
  const tex = new THREE.DataTexture(data, 1, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/* ------------------------ timeline store --------------------------- */
/* One section-relative timeline shared between the DOM scroll listener
   and the R3F render loop. Written by the listener (target), smoothed
   every frame (current). No React state â€” zero re-renders on scroll. */

type HelixStore = { current: number; target: number };

/* Helix + grid per-frame math, ported verbatim. All writes go into
   preallocated attributes / scratch vectors. */

function wrapCardOnHelix(positions: THREE.BufferAttribute, sArcStart: number) {
  const cols = W_SEGS + 1;
  for (let row = 0; row < 2; row++) {
    const hOff = (row === 0 ? -0.5 : 0.5) * HELIX_CARD_H;
    for (let col = 0; col < cols; col++) {
      const u = col / W_SEGS;
      const arc = sArcStart + u * CARD_ARC_WIDTH;
      const a = arc / dsPerRad;
      hPos(a, _cp);
      tangent(a, _tan);
      upVector(a, _tan, _up);
      _p.copy(_cp).addScaledVector(_up, hOff);
      /* PlaneGeometry row 0 is the top row; the reference writes the
         bottom offset into row 0 and the top offset into row 1. */
      const actualRow = row === 0 ? 1 : 0;
      const idx = actualRow * cols + col;
      positions.setXYZ(idx, _p.x, _p.y, _p.z);
    }
  }
  positions.needsUpdate = true;
}

function updateOutlineLine(
  positions: THREE.BufferAttribute,
  centerArc: number,
  arcLength: number,
  heightOffset: number
) {
  const arcStart = centerArc - arcLength * 0.5;
  const arcEnd = centerArc + arcLength * 0.5;
  for (let i = 0; i < OUTLINE_SAMPLES; i++) {
    const u = i / (OUTLINE_SAMPLES - 1);
    const arc = arcStart + (arcEnd - arcStart) * u;
    const a = arc / dsPerRad;
    hPos(a, _cp);
    tangent(a, _tan);
    upVector(a, _tan, _up);
    _p.copy(_cp).addScaledVector(_up, heightOffset);
    positions.setXYZ(i, _p.x, _p.y, _p.z);
  }
  positions.needsUpdate = true;
}

function updateGridCard(
  mesh: THREE.Mesh,
  basePositions: Float32Array,
  moveT: number,
  settleT: number,
  time: number,
  slot: number,
  targets: THREE.Vector3[],
  layoutScale: number
) {
  const posAttr = mesh.geometry.attributes.position as THREE.BufferAttribute;
  const windBase = 1 - settleT;
  const waveAmp = (0.05 + 0.25 * (1 - moveT)) * Math.pow(windBase, 0.88);

  for (let i = 0; i < posAttr.count; i++) {
    const ix = i * 3;
    const x = basePositions[ix];
    const y = basePositions[ix + 1];

    const rip1 = Math.sin(x * 2.25 + time * 2.5 + slot * 0.55);
    const rip2 = Math.sin(y * 6.4 + time * 3.35 + slot * 0.31);
    const rip3 = Math.cos((x + y) * 1.95 + time * 2.05 + slot * 0.77);

    const dx = (rip2 * 0.05 + rip3 * 0.02) * waveAmp;
    const dz = (rip1 * 0.82 + rip2 * 0.42 + rip3 * 0.52) * waveAmp;

    posAttr.setXYZ(i, x + dx, y, dz);
  }
  posAttr.needsUpdate = true;

  const p0 = GRID_ENTRANCES[slot];
  const p1 = targets[slot];
  mesh.position.lerpVectors(p0, p1, moveT);

  const drift = (0.025 + 0.095 * (1 - moveT)) * windBase;
  mesh.position.x += Math.sin(time * 3.0 + slot * 0.85) * drift;
  mesh.position.y += Math.cos(time * 3.35 + slot * 0.55) * drift * 1.22;
  mesh.position.z += Math.sin(time * 2.45 + slot) * drift * 0.75;

  const r0 = GRID_START_ROT[slot];
  mesh.rotation.x = lerp(r0.x, 0, moveT) + Math.sin(time * 3.55 + slot) * 0.04 * windBase;
  mesh.rotation.y = lerp(r0.y, 0, moveT) + Math.cos(time * 2.95 + slot * 0.7) * 0.05 * windBase;
  mesh.rotation.z = lerp(r0.z, 0, moveT) + Math.sin(time * 3.8 + slot * 0.9) * 0.035 * windBase;

  const sc = lerp(0.95, 1, moveT) * layoutScale;
  mesh.scale.set(sc, sc, sc);
  (mesh.material as THREE.ShaderMaterial).uniforms.opacity.value = clamp(moveT * 1.7);
}

/** Responsive closing-grid targets: 3x2 / 2x3 / 1x6 with scale-to-fit. */
function computeGridTargets(camera: THREE.PerspectiveCamera, out: THREE.Vector3[]) {
  const w = window.innerWidth;
  if (w >= GRID_DESKTOP_BREAKPOINT) {
    out.forEach((t, i) => t.copy(DESKTOP_GRID_TARGETS[i]));
    return 1;
  }
  const columns = w <= GRID_MOBILE_BREAKPOINT ? 1 : 2;
  const rows = Math.ceil(out.length / columns);
  const gapX = columns === 1 ? 0 : 0.18;
  const gapY = columns === 1 ? 0.12 : 0.18;
  const baseWidth = columns * GRID_CARD_W + (columns - 1) * gapX;
  const baseHeight = rows * GRID_CARD_H + (rows - 1) * gapY;
  const worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
  const worldWidth = worldHeight * camera.aspect;
  const maxWidth = worldWidth * 0.9;
  const maxHeight = worldHeight * 0.88;
  const scale = Math.min(1, maxWidth / baseWidth, maxHeight / baseHeight);
  out.forEach((target, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = (column - (columns - 1) * 0.5) * (GRID_CARD_W + gapX) * scale;
    const y = ((rows - 1) * 0.5 - row) * (GRID_CARD_H + gapY) * scale;
    target.set(x, y, DESKTOP_GRID_TARGETS[index].z);
  });
  return scale;
}

/* --------------------------- scene --------------------------------- */

type SceneRefs = {
  shade: React.RefObject<HTMLDivElement | null>;
  transitionTitle: React.RefObject<HTMLDivElement | null>;
  line1: React.RefObject<HTMLHeadingElement | null>;
  line2: React.RefObject<HTMLHeadingElement | null>;
  bar: React.RefObject<HTMLElement | null>;
};

function HelixScene({
  store,
  overlays,
  onContextLost,
}: {
  store: HelixStore;
  overlays: SceneRefs;
  onContextLost: () => void;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);

  /* ---- one-time GPU resources (created once, disposed on unmount) ---- */
  const res = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const helixGeometry = new THREE.PlaneGeometry(HELIX_CARD_W, HELIX_CARD_H, W_SEGS, 1);
    const gridGeometry = new THREE.PlaneGeometry(GRID_CARD_W, GRID_CARD_H, W_SEGS, GRID_H_SEGS);
    const placeholder = makePlaceholderTexture();
    const textures: THREE.Texture[] = [];
    const helixCards: THREE.Mesh[] = [];
    const gridCards: THREE.Mesh[] = [];
    const gridTargets = DESKTOP_GRID_TARGETS.map((t) => t.clone());
    const gridBase: Float32Array[] = [];

    const attachTexture = (mat: THREE.ShaderMaterial, url: string, aspect: number) => {
      loader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          updateCoverCrop(mat, tex, aspect);
          mat.uniforms.map.value = tex;
          textures.push(tex);
        },
        undefined,
        () => {
          /* Failed load: keep the placeholder surface, no console spam. */
        }
      );
    };

    /* Helix cards: assets reversed (cardNumber = COUNT - i), per reference. */
    for (let i = 0; i < COUNT; i++) {
      const mat = buildCardMaterial(placeholder);
      const mesh = new THREE.Mesh(helixGeometry, mat);
      mesh.frustumCulled = false;
      mesh.renderOrder = 2;
      attachTexture(mat, CARD_ASSETS[COUNT - 1 - i], HELIX_CARD_W / HELIX_CARD_H);
      helixCards.push(mesh);
    }

    /* Closing grid: cards 01-06, base positions captured for ripple. */
    for (let i = 0; i < GRID_ORDER.length; i++) {
      const mat = buildCardMaterial(placeholder);
      const mesh = new THREE.Mesh(gridGeometry, mat);
      mesh.frustumCulled = false;
      mesh.renderOrder = 6;
      mesh.visible = false;
      gridBase.push(Float32Array.from(gridGeometry.attributes.position.array));
      attachTexture(mat, CARD_ASSETS[GRID_ORDER[i] - 1], GRID_CARD_W / GRID_CARD_H);
      gridCards.push(mesh);
    }

    /* Guide lines: preallocated 240-point buffers, updated in place. */
    const outlineGeoUpper = new THREE.BufferGeometry();
    const outlineGeoLower = new THREE.BufferGeometry();
    outlineGeoUpper.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(OUTLINE_SAMPLES * 3), 3)
    );
    outlineGeoLower.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(OUTLINE_SAMPLES * 3), 3)
    );
    const upperLine = new THREE.Line(
      outlineGeoUpper,
      new THREE.LineBasicMaterial({
        color: 0xa9aaa6,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        depthTest: true,
      })
    );
    const lowerLine = new THREE.Line(
      outlineGeoLower,
      new THREE.LineBasicMaterial({
        color: 0xa9aaa6,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        depthTest: false,
      })
    );
    upperLine.frustumCulled = false;
    lowerLine.frustumCulled = false;
    upperLine.renderOrder = 1;
    lowerLine.renderOrder = 10;

    return {
      loader,
      helixGeometry,
      gridGeometry,
      placeholder,
      textures,
      helixCards,
      gridCards,
      gridTargets,
      gridBase,
      upperLine,
      lowerLine,
      layoutScale: 1,
    };
  }, []);

  /* Dispose owned GPU resources on unmount. */
  useEffect(() => {
    return () => {
      res.textures.forEach((t) => t.dispose());
      res.placeholder.dispose();
      res.helixGeometry.dispose();
      res.gridGeometry.dispose();
      res.helixCards.forEach((m) => (m.material as THREE.Material).dispose());
      res.gridCards.forEach((m) => (m.material as THREE.Material).dispose());
      (res.upperLine.material as THREE.Material).dispose();
      (res.lowerLine.material as THREE.Material).dispose();
      res.upperLine.geometry.dispose();
      res.lowerLine.geometry.dispose();
    };
  }, [res]);

  /* WebGL context loss -> meaningful DOM fallback instead of black canvas. */
  useEffect(() => {
    const el = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    el.addEventListener("webglcontextlost", onLost);
    return () => el.removeEventListener("webglcontextlost", onLost);
  }, [gl, onContextLost]);

  /* Resize: camera pull-back below 800px + responsive grid recompute. */
  useEffect(() => {
    const onResize = () => {
      camera.position.z = window.innerWidth < 800 ? 11.8 : 9.25;
      res.layoutScale = computeGridTargets(camera, res.gridTargets);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [camera, res]);

  /* ---------------- one timeline, one render loop ---------------- */
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    /* Smooth the section-relative scroll target (reference: *0.105). */
    const dt = Math.min(delta, 0.1);
    const follow = 1 - Math.pow(1 - 0.105, dt * 60);
    store.current += (store.target - store.current) * follow;
    const current = store.current;

    const hp = clamp((current - HELIX_START) / (HELIX_END - HELIX_START));
    const scrollArc = hp * TRAVEL_ARC;

    /* ---- helix cards: wrap onto curve, fade at world-Y edges ---- */
    const stackRaw = clamp((current - STACK_START) / (STACK_END - STACK_START));
    const helixFade =
      1 -
      smooth(
        clamp((current - (STACK_START + 0.12)) / ((STACK_END - 0.04) - (STACK_START + 0.12)))
      );

    for (let i = 0; i < res.helixCards.length; i++) {
      const mesh = res.helixCards[i];
      const sArcStart = BASE_ARC + i * STEP_ARC + scrollArc;
      wrapCardOnHelix(mesh.geometry.attributes.position as THREE.BufferAttribute, sArcStart);

      const centerA = (sArcStart + CARD_ARC_WIDTH * 0.5) / dsPerRad;
      hPos(centerA, _cp);
      const worldY = _cp.y;

      const fadeTop = 8.15;
      const fadeBottom = -7.9;
      const edge = Math.min(worldY - fadeBottom, fadeTop - worldY);
      const baseOpacity = clamp(edge / 0.85);
      const mat = mesh.material as THREE.ShaderMaterial;
      mat.uniforms.opacity.value = baseOpacity * helixFade;
      mesh.visible = mat.uniforms.opacity.value > 0.001;
    }

    /* ---- guide lines: travel opposite the cards (reference math) ---- */
    const bandMidOffset = ((COUNT - 1) * STEP_ARC + CARD_ARC_WIDTH) * 0.5;
    const bandStartCenter = BASE_ARC + bandMidOffset;

    let lineProgress: number;
    if (current <= HELIX_MID) {
      lineProgress = 0.5 * clamp(current / HELIX_MID);
    } else {
      lineProgress = 0.5 + 0.5 * clamp((current - HELIX_MID) / (HELIX_END - HELIX_MID));
    }

    const OUTLINE_PHASE_ARC = Math.PI * dsPerRad;
    const outlineCenterArc =
      bandStartCenter + (1.0 - lineProgress) * TRAVEL_ARC - OUTLINE_PHASE_ARC;
    const outlineArcLength = STEP_ARC * 2.5;
    const outlineOffset = HELIX_CARD_H * 0.72;
    const outlineShowIn = clamp(lineProgress / 0.035);
    const outlineShowOut = clamp((1 - lineProgress) / 0.08);
    const outlineFade =
      1 -
      smooth(
        clamp((current - (STACK_START + 0.1)) / ((STACK_END - 0.03) - (STACK_START + 0.1)))
      );
    const outlineOpacity = 0.58 * Math.min(outlineShowIn, outlineShowOut) * outlineFade;

    const upperPos = res.upperLine.geometry.attributes.position as THREE.BufferAttribute;
    const lowerPos = res.lowerLine.geometry.attributes.position as THREE.BufferAttribute;
    updateOutlineLine(upperPos, outlineCenterArc, outlineArcLength, outlineOffset);
    updateOutlineLine(lowerPos, outlineCenterArc, outlineArcLength, -outlineOffset);
    (res.upperLine.material as THREE.LineBasicMaterial).opacity = outlineOpacity;
    (res.lowerLine.material as THREE.LineBasicMaterial).opacity = outlineOpacity;
    res.upperLine.visible = outlineOpacity > 0.001;
    res.lowerLine.visible = outlineOpacity > 0.001;

    /* ---- rig: open-scale intro + fixed editorial tilt ---- */
    const openT = clamp(hp / 0.28);
    const openSmooth = openT * openT * (3 - 2 * openT);
    const radialScale = 0.72 + openSmooth * 0.28;
    for (let i = 0; i < res.helixCards.length; i++) {
      const m = res.helixCards[i];
      m.scale.set(radialScale, 1, radialScale);
      m.rotation.set(
        THREE.MathUtils.degToRad(1.5),
        THREE.MathUtils.degToRad(-1.0),
        THREE.MathUtils.degToRad(-1.0)
      );
    }

    /* ---- closing grid: scroll-synced stagger + settle ---- */
    for (let idx = 0; idx < res.gridCards.length; idx++) {
      const mesh = res.gridCards[idx];
      const start = idx * STACK_STAGGER;
      const nextStart = idx < res.gridCards.length - 1 ? (idx + 1) * STACK_STAGGER : 1.0;
      const entryEnd = Math.min(start + GRID_MOVE_DURATION, 1.0);
      const moveT = smoother(clamp((stackRaw - start) / (entryEnd - start || 1)));
      const settleStart =
        idx < res.gridCards.length - 1
          ? Math.min(nextStart + 0.02, 0.9)
          : Math.min(start + 0.1, 0.84);
      const settleEnd =
        idx < res.gridCards.length - 1 ? Math.min(settleStart + 0.4, 0.985) : 1.0;
      const settleT = smoother(clamp((stackRaw - settleStart) / (settleEnd - settleStart || 1)));

      mesh.visible = stackRaw > 0.0005;
      if (mesh.visible) {
        updateGridCard(
          mesh,
          res.gridBase[idx],
          moveT,
          settleT,
          time,
          idx,
          res.gridTargets,
          res.layoutScale
        );
      }
    }

    camera.lookAt(0, 0.05, 0);

    /* ---- DOM overlays, same timeline (no React renders) ---- */
    const shade = overlays.shade.current;
    if (shade) shade.style.opacity = String((1 - smoother(clamp(current / 0.035))) * 0.18);

    const tt = overlays.transitionTitle.current;
    if (tt) {
      const ttIn = smoother(clamp(current / 0.018));
      const ttOut = smoother(clamp((current - 0.04) / 0.07));
      tt.style.opacity = String(clamp(ttIn * (1 - ttOut)));
      tt.style.transform = `translate(-50%,-50%) scale(${lerp(0.965, 1, ttIn) - ttOut * 0.018})`;
    }

    const TITLE_ENTER_START = 0.055;
    const TITLE_ENTER_END = 0.17;
    const TITLE_HOLD_END = 0.565;
    const TITLE_EXIT_END = 0.735;
    const enterT = smoother(
      clamp((current - TITLE_ENTER_START) / (TITLE_ENTER_END - TITLE_ENTER_START))
    );
    const exitT = smoother(clamp((current - TITLE_HOLD_END) / (TITLE_EXIT_END - TITLE_HOLD_END)));
    const exitDistance = 86 * exitT;
    const leftEnter = (1 - enterT) * -72;
    const rightEnter = (1 - enterT) * 72;
    const titleOpacity = clamp(enterT * (1 - exitT * 0.35) * 1.2);

    const l1 = overlays.line1.current;
    if (l1) {
      l1.style.transform = `translate3d(${leftEnter - exitDistance}vw,0,0)`;
      l1.style.opacity = String(titleOpacity);
    }
    const l2 = overlays.line2.current;
    if (l2) {
      l2.style.transform = `translate3d(${rightEnter + exitDistance}vw,0,0)`;
      l2.style.opacity = String(titleOpacity);
    }

    const bar = overlays.bar.current;
    if (bar) bar.style.transform = `scaleX(${current})`;
  });

  return (
    <>
      {res.helixCards.map((mesh) => (
        <primitive key={`h${mesh.uuid}`} object={mesh} />
      ))}
      {res.gridCards.map((mesh) => (
        <primitive key={`g${mesh.uuid}`} object={mesh} />
      ))}
      <primitive object={res.upperLine} />
      <primitive object={res.lowerLine} />
    </>
  );
}

/* ------------------------- fallbacks ------------------------------- */

function StaticHelixFallback({ heading, note }: { heading: string; note: string }) {
  return (
    <section className="bg-[#f2f0ea] px-6 py-20">
      <div className="mx-auto max-w-[var(--max-width)]">
        <h2 className="font-serif text-3xl leading-tight text-[#10110f]">{heading}</h2>
        <p className="mt-4 max-w-2xl text-[#77766f]">{note}</p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CARD_ASSETS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Stonehaven residence â€” architectural view ${i + 1} of 9`}
              className="aspect-[2.09/1] w-full rounded-md object-cover"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- section ------------------------------- */

export default function HelixSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const shadeRef = useRef<HTMLDivElement | null>(null);
  const transitionTitleRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLHeadingElement | null>(null);
  const line2Ref = useRef<HTMLHeadingElement | null>(null);
  const barRef = useRef<HTMLElement | null>(null);
  const storeRef = useRef<HelixStore>({ current: 0, target: 0 });

  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [contextLost, setContextLost] = useState(false);

  /* Client-only capability checks (avoids SSR hydration mismatch). */
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      setWebglOk(ok);
      const ext = c.getContext("webgl") as WebGLRenderingContext | null;
      ext?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setWebglOk(false);
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Section-relative scroll progress: written to a ref, never to state. */
  useEffect(() => {
    if (webglOk === false || reducedMotion === true || contextLost) return;
    const readScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const r = track.getBoundingClientRect();
      storeRef.current.target = clamp(-r.top / (track.offsetHeight - window.innerHeight));
    };
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    readScroll();
    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
    };
  }, [webglOk, reducedMotion, contextLost]);

  const fallbackMode =
    webglOk === false || reducedMotion === true || contextLost
      ? webglOk === false || contextLost
        ? "webgl"
        : "motion"
      : null;

  if (fallbackMode) {
    return (
      <StaticHelixFallback
        heading="Architectural Flythrough"
        note={
          fallbackMode === "webgl"
            ? "WebGL is not available on this device. A static preview of the nine helix views is shown instead."
            : "Reduced motion is enabled, so the animated flythrough is replaced with a static preview of the nine helix views."
        }
      />
    );
  }

  /* During SSR and until checks complete, render the stage (client will
     reconcile). The tall track keeps layout stable either way. */
  return (
    <section
      ref={trackRef}
      aria-label="Architectural flythrough â€” scroll-driven 3D helix"
      className="helix-track"
    >
      <div className="helix-sticky">
        <div ref={shadeRef} className="helix-shade" />
        <div ref={transitionTitleRef} className="helix-transition-title">
          PARAMETRIC HELIX + BENT CARD GEOMETRY
        </div>
        <div className="helix-editorial" aria-hidden="true">
          <h2 ref={line1Ref} className="helix-line1">
            DESIGN<span className="helix-plus">+</span>
          </h2>
          <h2 ref={line2Ref} className="helix-line2">
            BUILT TO LAST
          </h2>
        </div>
        <Canvas
          className="helix-canvas"
          camera={{ position: [0, 0, 9.25], fov: 35, near: 0.1, far: 100 }}
          dpr={[1, 1.7]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <HelixScene
            store={storeRef.current}
            overlays={{
              shade: shadeRef,
              transitionTitle: transitionTitleRef,
              line1: line1Ref,
              line2: line2Ref,
              bar: barRef,
            }}
            onContextLost={() => setContextLost(true)}
          />
        </Canvas>
        <div className="helix-progress" aria-hidden="true">
          <i ref={barRef} />
        </div>
      </div>
    </section>
  );
}

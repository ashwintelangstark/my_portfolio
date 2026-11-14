import { Component, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import frontPortrait from "@/assets/ashwin-portrait.png";
import backPortrait from "@/assets/ashwin-portrait-back.png";

// Supports checking WebGL availability safely before initializing Three.js
function isWebGLSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

class ThreeErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Hero3DCharacter WebGL fallback activated:", error, info);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface ReliefAnalysis {
  heightGrid: Float32Array;
  gridSize: number;
  centerXNorm: number;
}

/**
 * Analyzes a transparent PNG portrait on an offscreen canvas to build a
 * smoothed 3D depth relief heightmap. Exterior pixels sink slightly behind
 * z = 0 so the front and rear shells overlap cleanly at the silhouette seam
 * with zero facial occlusion from any viewing angle.
 */
function analyzePortraitRelief(
  img: HTMLImageElement,
  gridSize = 96,
  maxHeadDepth = 0.56,
  maxTorsoDepth = 0.34,
): ReliefAnalysis | null {
  const analysisRes = 256;
  const canvas = document.createElement("canvas");
  canvas.width = analysisRes;
  canvas.height = analysisRes;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.clearRect(0, 0, analysisRes, analysisRes);
  ctx.drawImage(img, 0, 0, analysisRes, analysisRes);
  const { data } = ctx.getImageData(0, 0, analysisRes, analysisRes);

  const mask = new Uint8Array(analysisRes * analysisRes);
  const rowMinX = new Int16Array(analysisRes).fill(analysisRes);
  const rowMaxX = new Int16Array(analysisRes).fill(-1);
  let sumX = 0;
  let count = 0;

  for (let y = 0; y < analysisRes; y++) {
    const rowOff = y * analysisRes;
    for (let x = 0; x < analysisRes; x++) {
      const a = data[(rowOff + x) * 4 + 3] ?? 0;
      if (a > 24) {
        mask[rowOff + x] = 1;
        if (x < (rowMinX[y] ?? analysisRes)) rowMinX[y] = x;
        if (x > (rowMaxX[y] ?? -1)) rowMaxX[y] = x;
        sumX += x;
        count++;
      }
    }
  }

  if (count === 0) return null;
  const centerXNorm = sumX / count / analysisRes;

  // 2-pass Chamfer 3-4 Euclidean distance transform inside the opaque mask
  const INF = 1e6;
  const dist = new Float32Array(analysisRes * analysisRes);
  for (let i = 0; i < dist.length; i++) {
    dist[i] = mask[i] ? INF : 0;
  }

  for (let y = 0; y < analysisRes; y++) {
    for (let x = 0; x < analysisRes; x++) {
      const idx = y * analysisRes + x;
      let d = dist[idx] ?? INF;
      if (d === 0) continue;
      if (x > 0) d = Math.min(d, (dist[idx - 1] ?? INF) + 3);
      if (y > 0) {
        d = Math.min(d, (dist[idx - analysisRes] ?? INF) + 3);
        if (x > 0) d = Math.min(d, (dist[idx - analysisRes - 1] ?? INF) + 4);
        if (x < analysisRes - 1) d = Math.min(d, (dist[idx - analysisRes + 1] ?? INF) + 4);
      }
      dist[idx] = d;
    }
  }

  for (let y = analysisRes - 1; y >= 0; y--) {
    for (let x = analysisRes - 1; x >= 0; x--) {
      const idx = y * analysisRes + x;
      let d = dist[idx] ?? INF;
      if (d === 0) continue;
      if (x < analysisRes - 1) d = Math.min(d, (dist[idx + 1] ?? INF) + 3);
      if (y < analysisRes - 1) {
        d = Math.min(d, (dist[idx + analysisRes] ?? INF) + 3);
        if (x > 0) d = Math.min(d, (dist[idx + analysisRes - 1] ?? INF) + 4);
        if (x < analysisRes - 1) d = Math.min(d, (dist[idx + analysisRes + 1] ?? INF) + 4);
      }
      dist[idx] = d;
    }
  }

  // Convert Chamfer units (3 per pixel) into pixel-based rounded depth
  const bevelRadius = 32; // pixels for smooth rounded side/top silhouette bevel
  const seamOverlap = 0.022;
  const raw = new Float32Array(analysisRes * analysisRes);

  const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };

  for (let y = 0; y < analysisRes; y++) {
    const v = y / (analysisRes - 1);
    const minX = rowMinX[y] ?? analysisRes;
    const maxX = rowMaxX[y] ?? -1;
    const rowCx = (minX + maxX) * 0.5;
    const rowHalfW = Math.max(1, (maxX - minX) * 0.5);

    // Chibi head occupies top ~60%, blending smoothly into slightly flatter suit torso
    const headToTorso = smoothstep(0.56, 0.72, v);
    const regionMaxDepth = maxHeadDepth * (1 - headToTorso) + maxTorsoDepth * headToTorso;

    for (let x = 0; x < analysisRes; x++) {
      const idx = y * analysisRes + x;
      if (!mask[idx]) {
        raw[idx] = -seamOverlap;
        continue;
      }

      const pxDist = (dist[idx] ?? 0) / 3;
      const edgeNorm = Math.min(1, pxDist / bevelRadius);
      const bevel = Math.sin(edgeNorm * Math.PI * 0.5);

      const dx = (x - rowCx) / rowHalfW;
      const chordBulge = Math.sqrt(Math.max(0, 1 - dx * dx));
      const dome = 0.58 + 0.42 * chordBulge;

      raw[idx] = -seamOverlap + bevel * dome * (regionMaxDepth + seamOverlap);
    }
  }

  // Sample onto (gridSize + 1) x (gridSize + 1) mesh vertices with local smoothing
  const vertsPerSide = gridSize + 1;
  const sampled = new Float32Array(vertsPerSide * vertsPerSide);
  for (let gy = 0; gy < vertsPerSide; gy++) {
    const py = Math.round((gy / gridSize) * (analysisRes - 1));
    for (let gx = 0; gx < vertsPerSide; gx++) {
      const px = Math.round((gx / gridSize) * (analysisRes - 1));
      sampled[gy * vertsPerSide + gx] = raw[py * analysisRes + px] ?? -seamOverlap;
    }
  }

  // 2 passes of 3x3 box smoothing so lighting gradients across curved head/hair are silky
  let curr = sampled;
  for (let pass = 0; pass < 2; pass++) {
    const next = new Float32Array(curr.length);
    for (let gy = 0; gy < vertsPerSide; gy++) {
      for (let gx = 0; gx < vertsPerSide; gx++) {
        let sum = 0;
        let n = 0;
        for (let oy = -1; oy <= 1; oy++) {
          const ny = gy + oy;
          if (ny < 0 || ny >= vertsPerSide) continue;
          for (let ox = -1; ox <= 1; ox++) {
            const nx = gx + ox;
            if (nx < 0 || nx >= vertsPerSide) continue;
            sum += curr[ny * vertsPerSide + nx] ?? 0;
            n++;
          }
        }
        next[gy * vertsPerSide + gx] = sum / n;
      }
    }
    curr = next;
  }

  return {
    heightGrid: curr,
    gridSize,
    centerXNorm,
  };
}

function applyReliefToPlaneGeometry(
  geo: THREE.PlaneGeometry,
  relief: ReliefAnalysis,
  planeH: number,
  planeW: number,
) {
  const posAttr = geo.attributes["position"] as THREE.BufferAttribute;
  const vertsPerSide = relief.gridSize + 1;
  const total = vertsPerSide * vertsPerSide;
  if (posAttr.count !== total) return;

  for (let gy = 0; gy < vertsPerSide; gy++) {
    for (let gx = 0; gx < vertsPerSide; gx++) {
      const idx = gy * vertsPerSide + gx;
      const u = gx / relief.gridSize;
      const v = gy / relief.gridSize;
      posAttr.setXYZ(
        idx,
        (u - 0.5) * planeW,
        (0.5 - v) * planeH,
        relief.heightGrid[idx] ?? 0,
      );
    }
  }
  posAttr.needsUpdate = true;
  geo.computeVertexNormals();
}

export function Hero3DCharacter() {
  const [canWebGL, setCanWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setCanWebGL(isWebGLSupported());
  }, []);

  const fallback2D = (
    <div className="relative flex w-full select-none flex-col items-center">
      <div className="relative aspect-square w-full max-w-[676px] overflow-hidden">
        <img
          src={frontPortrait}
          alt="Illustrated portrait of Ashwin in a dark suit"
          className="h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(120,80,255,0.2)]"
        />
      </div>
    </div>
  );

  if (canWebGL === false) {
    return fallback2D;
  }

  return (
    <ThreeErrorBoundary fallback={fallback2D}>
      <InnerHero3DCharacter fallback={fallback2D} />
    </ThreeErrorBoundary>
  );
}

function InnerHero3DCharacter({ fallback }: { fallback: ReactNode }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [angleLabel, setAngleLabel] = useState("Front");

  // Interactive rotation state stored in refs for silky 60fps animation loop
  const rotY = useRef(0);
  const rotX = useRef(0.05);
  const velY = useRef(0);
  const velX = useRef(0);
  const pointerDown = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("WebGLRenderer init failed, using 2D fallback", e);
      setHasFailed(true);
      return;
    }

    const scene = new THREE.Scene();

    const getWidth = () => Math.max(container.clientWidth || 400, 1);
    const getHeight = () => Math.max(container.clientHeight || 400, 1);

    const camera = new THREE.PerspectiveCamera(34, getWidth() / getHeight(), 0.1, 100);
    camera.position.set(0, 0.08, 6.4);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(getWidth(), getHeight());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Lighting (balanced so artwork colors stay crisp while 3D contours catch soft highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.05);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ec, 1.15);
    keyLight.position.set(3.2, 4.5, 5.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc2d8ff, 0.75);
    fillLight.position.set(-4.0, 1.5, 4.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x9b7dff, 1.1);
    rimLight.position.set(0, 3.0, -5.0);
    scene.add(rimLight);

    const accentLeft = new THREE.PointLight(0xbc28fe, 0.85, 14);
    accentLeft.position.set(-3.2, -0.5, 2.5);
    scene.add(accentLeft);

    const accentRight = new THREE.PointLight(0x1f62fe, 0.85, 14);
    accentRight.position.set(3.2, 0.5, -2.5);
    scene.add(accentRight);

    // Master Pivot Group for 360° Horizontal + Pitch Rotation
    const characterRoot = new THREE.Group();
    scene.add(characterRoot);

    const planeW = 3.5;
    const planeH = 3.5;
    const gridSegs = 96;

    const frontGeo = new THREE.PlaneGeometry(planeW, planeH, gridSegs, gridSegs);
    const backGeo = new THREE.PlaneGeometry(planeW, planeH, gridSegs, gridSegs);

    const frontMat = new THREE.MeshStandardMaterial({
      transparent: true,
      alphaTest: 0.12,
      roughness: 0.68,
      metalness: 0.04,
      side: THREE.FrontSide,
    });

    const backMat = new THREE.MeshStandardMaterial({
      transparent: true,
      alphaTest: 0.12,
      roughness: 0.72,
      metalness: 0.04,
      side: THREE.FrontSide,
    });

    const frontMesh = new THREE.Mesh(frontGeo, frontMat);
    characterRoot.add(frontMesh);

    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.rotation.y = Math.PI;
    characterRoot.add(backMesh);

    // Load textures & sculpt 3D relief heightmaps directly from each silhouette
    const loader = new THREE.TextureLoader();
    let frontRelief: ReliefAnalysis | null = null;
    let backRelief: ReliefAnalysis | null = null;
    let isDisposed = false;

    const syncHorizontalAlignment = () => {
      if (!frontRelief || !backRelief) return;
      // Mirror-align rear center to match front center in character X coordinates
      const deltaX = (frontRelief.centerXNorm - (1 - backRelief.centerXNorm)) * planeW;
      backMesh.position.x = deltaX;
    };

    const frontTex = loader.load(frontPortrait, (tex) => {
      if (isDisposed) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      frontMat.map = tex;
      frontMat.needsUpdate = true;

      if (tex.image instanceof HTMLImageElement) {
        frontRelief = analyzePortraitRelief(tex.image, gridSegs);
        if (frontRelief) {
          applyReliefToPlaneGeometry(frontGeo, frontRelief, planeH, planeW);
          syncHorizontalAlignment();
        }
      }
    });
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontMat.map = frontTex;

    const backTex = loader.load(backPortrait, (tex) => {
      if (isDisposed) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      backMat.map = tex;
      backMat.needsUpdate = true;

      if (tex.image instanceof HTMLImageElement) {
        backRelief = analyzePortraitRelief(tex.image, gridSegs);
        if (backRelief) {
          applyReliefToPlaneGeometry(backGeo, backRelief, planeH, planeW);
          syncHorizontalAlignment();
        }
      }
    });
    backTex.colorSpace = THREE.SRGBColorSpace;
    backMat.map = backTex;

    // Subtle floating glow halo beneath character
    const auraGeo = new THREE.RingGeometry(0.95, 1.45, 48);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.rotation.x = Math.PI / 2;
    auraMesh.position.y = -1.78;
    characterRoot.add(auraMesh);

    const handleResize = () => {
      if (!container) return;
      const w = getWidth();
      const h = getHeight();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    let lastFrameTime = performance.now();
    let elapsed = 0;
    let animId = 0;
    let lastShownAngle = "";

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;
      elapsed += dt;

      if (!pointerDown.current) {
        // Momentum decay
        rotY.current += velY.current;
        rotX.current += velX.current;
        velY.current *= 0.94;
        velX.current *= 0.92;

        // Gentle studio turntable oscillation until user takes manual control
        if (!hasInteracted && Math.abs(velY.current) < 0.0005) {
          rotY.current = Math.sin(elapsed * 0.7) * 0.24;
        }
      }

      // Clamp vertical pitch from bottom upward view through full Top profile
      rotX.current = Math.max(-0.4, Math.min(1.15, rotX.current));

      characterRoot.rotation.y = rotY.current;
      characterRoot.rotation.x = rotX.current;
      characterRoot.position.y = Math.sin(elapsed * 2.0) * 0.04;

      const degY = (((rotY.current * 180) / Math.PI) % 360 + 360) % 360;
      const degX = (rotX.current * 180) / Math.PI;
      let profile = "Front";
      if (degX > 42) {
        profile = "Top Profile";
      } else if (degY >= 45 && degY < 135) {
        profile = "Left Profile";
      } else if (degY >= 135 && degY < 225) {
        profile = "Back Profile";
      } else if (degY >= 225 && degY < 315) {
        profile = "Right Profile";
      } else {
        profile = "Front Profile";
      }

      const nextLabel = `${profile} (${Math.round(degY)}°)`;
      if (nextLabel !== lastShownAngle) {
        lastShownAngle = nextLabel;
        setAngleLabel(nextLabel);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      ro.disconnect();
      frontGeo.dispose();
      backGeo.dispose();
      auraGeo.dispose();
      frontMat.dispose();
      backMat.dispose();
      auraMat.dispose();
      frontTex.dispose();
      backTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hasInteracted]);

  if (hasFailed) {
    return fallback;
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDown.current = true;
    setIsDragging(true);
    setHasInteracted(true);
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    velY.current = 0;
    velX.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDown.current) return;
    const dx = e.clientX - lastX.current;
    const dy = e.clientY - lastY.current;
    lastX.current = e.clientX;
    lastY.current = e.clientY;

    const sensY = 0.011;
    const sensX = 0.008;
    rotY.current += dx * sensY;
    rotX.current += dy * sensX;
    velY.current = dx * sensY * 0.45;
    velX.current = dy * sensX * 0.35;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDown.current = false;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleReset = () => {
    rotY.current = 0;
    rotX.current = 0.05;
    velY.current = 0;
    velX.current = 0;
    setHasInteracted(false);
  };

  return (
    <div className="relative flex w-full select-none flex-col items-center">
      <div
        ref={mountRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={handleReset}
        className={`relative aspect-square w-full touch-none transition-transform duration-150 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        aria-label="Interactive 3D character model of Ashwin. Drag to rotate 360 degrees or tilt for top profile."
        role="img"
      />

      {/* Interactive Status Pill */}
      <button
        type="button"
        onClick={handleReset}
        title="Click or double-click canvas to reset orientation"
        className="pointer-events-auto -mt-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3.5 py-1 text-[10px] font-medium uppercase tracking-widest text-foreground/80 backdrop-blur-md transition-colors hover:border-purple-400/50 hover:text-white sm:text-[11px]"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
        <span>{hasInteracted ? angleLabel : "360° 3D · Drag to Rotate"}</span>
      </button>
    </div>
  );
}

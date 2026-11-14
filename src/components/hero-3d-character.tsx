import * as THREE from "three";
import { useEffect, useRef, useState, useCallback, Component, type ReactNode, type ErrorInfo } from "react";
import frontPortrait from "@/assets/ashwin-portrait.png";
import backPortrait from "@/assets/ashwin-portrait-back.png";
import { Rotate3D, RotateCcw } from "lucide-react";

// Robust Error Boundary to guarantee the website never goes blank
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Hero3DCharacter caught error, falling back:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function InnerHero3DCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasRotated, setHasRotated] = useState(false);
  const [currentYawDeg, setCurrentYawDeg] = useState(0);

  // References to communicate with the Three.js animation loop
  const sceneStateRef = useRef<{
    resetToFront?: () => void;
  }>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Check if WebGL is supported by the browser (handles Brave shields / strict privacy)
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        console.warn("WebGL is disabled or unsupported in this browser.");
        setWebglAvailable(false);
        return;
      }
    } catch {
      setWebglAvailable(false);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("Failed to create WebGLRenderer:", e);
      setWebglAvailable(false);
      return;
    }

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, -0.05, 5.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 2. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    // Key light (front top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2.5, 3.5, 4.0);
    scene.add(keyLight);

    // Front fill light (cool soft white)
    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 1.2);
    fillLight.position.set(-2.5, 1.5, 3.0);
    scene.add(fillLight);

    // Back rim light 1 (noir cyan-blue)
    const backRimLight1 = new THREE.DirectionalLight(0x60a5fa, 1.8);
    backRimLight1.position.set(-3.0, 2.5, -3.5);
    scene.add(backRimLight1);

    // Back rim light 2 (noir violet-purple)
    const backRimLight2 = new THREE.DirectionalLight(0xa855f7, 1.6);
    backRimLight2.position.set(3.0, 2.0, -3.5);
    scene.add(backRimLight2);

    // 3. Character Hierarchy
    const characterRoot = new THREE.Group();
    scene.add(characterRoot);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Front Portrait Texture
    const frontTex = textureLoader.load(frontPortrait, () => {
      setIsReady(true);
      renderer.render(scene, camera);
    });
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTex.generateMipmaps = true;
    frontTex.minFilter = THREE.LinearMipmapLinearFilter;
    frontTex.magFilter = THREE.LinearFilter;

    // Back Portrait Texture
    const backTex = textureLoader.load(backPortrait, () => {
      renderer.render(scene, camera);
    });
    backTex.colorSpace = THREE.SRGBColorSpace;
    backTex.generateMipmaps = true;
    backTex.minFilter = THREE.LinearMipmapLinearFilter;
    backTex.magFilter = THREE.LinearFilter;

    const planeW = 3.6;
    const planeH = 3.6;
    const halfDepth = 0.14; // distance from center for front/back planes

    // Front Mesh
    const frontGeo = new THREE.PlaneGeometry(planeW, planeH);
    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.FrontSide,
    });
    const frontMesh = new THREE.Mesh(frontGeo, frontMat);
    frontMesh.position.set(0, 0, halfDepth);
    characterRoot.add(frontMesh);

    // Back Mesh (Facing rear)
    const backGeo = new THREE.PlaneGeometry(planeW, planeH);
    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.55,
      metalness: 0.08,
      side: THREE.FrontSide,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.set(0, 0, -halfDepth);
    backMesh.rotation.y = Math.PI; // Face 180 degrees backwards
    characterRoot.add(backMesh);

    // 4. Volumetric Depth & Side/Top Profiles:
    const hairColor = new THREE.Color(0x131417);
    const jacketColor = new THREE.Color(0x111215);
    const skinColor = new THREE.Color(0xebb494);

    // Head volume slab (hair sides and crown)
    const headDepthGeo = new THREE.CylinderGeometry(1.22, 1.25, 1.8, 24, 1, false, -Math.PI / 2, Math.PI * 2);
    headDepthGeo.scale(1.05, 1.0, halfDepth * 1.8);
    const hairMat = new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.6,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const headDepthMesh = new THREE.Mesh(headDepthGeo, hairMat);
    headDepthMesh.position.set(0, 0.42, 0);
    characterRoot.add(headDepthMesh);

    // Top hair crown (rounded dome on top)
    const topCrownGeo = new THREE.SphereGeometry(1.24, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    topCrownGeo.scale(1.04, 0.45, halfDepth * 1.7);
    const topCrownMesh = new THREE.Mesh(topCrownGeo, hairMat);
    topCrownMesh.position.set(0, 1.3, 0);
    characterRoot.add(topCrownMesh);

    // Torso & blazer side depth
    const torsoDepthGeo = new THREE.BoxGeometry(2.35, 1.45, halfDepth * 1.7);
    const jacketMat = new THREE.MeshStandardMaterial({
      color: jacketColor,
      roughness: 0.75,
      metalness: 0.05,
    });
    const torsoDepthMesh = new THREE.Mesh(torsoDepthGeo, jacketMat);
    torsoDepthMesh.position.set(0, -1.05, 0);
    characterRoot.add(torsoDepthMesh);

    // Left Profile 3D Hair Tufts
    const leftTuftGroup = new THREE.Group();
    const tuftGeo1 = new THREE.ConeGeometry(0.35, 1.1, 12);
    tuftGeo1.rotateZ(0.45);
    const leftTuft1 = new THREE.Mesh(tuftGeo1, hairMat);
    leftTuft1.position.set(-1.26, 0.35, -0.02);
    leftTuftGroup.add(leftTuft1);

    const tuftGeo2 = new THREE.ConeGeometry(0.28, 0.9, 12);
    tuftGeo2.rotateZ(0.25);
    const leftTuft2 = new THREE.Mesh(tuftGeo2, hairMat);
    leftTuft2.position.set(-1.22, 0.05, 0.03);
    leftTuftGroup.add(leftTuft2);
    characterRoot.add(leftTuftGroup);

    // Right Profile 3D Hair Tufts & Thinking Arm
    const rightTuftGroup = new THREE.Group();
    const rightTuftGeo1 = new THREE.ConeGeometry(0.35, 1.1, 12);
    rightTuftGeo1.rotateZ(-0.45);
    const rightTuft1 = new THREE.Mesh(rightTuftGeo1, hairMat);
    rightTuft1.position.set(1.26, 0.35, -0.02);
    rightTuftGroup.add(rightTuft1);

    const rightTuftGeo2 = new THREE.ConeGeometry(0.28, 0.9, 12);
    rightTuftGeo2.rotateZ(-0.25);
    const rightTuft2 = new THREE.Mesh(rightTuftGeo2, hairMat);
    rightTuft2.position.set(1.22, 0.05, 0.03);
    rightTuftGroup.add(rightTuft2);
    characterRoot.add(rightTuftGroup);

    // Right Arm Thinking Pose
    const armGroup = new THREE.Group();
    const armGeo = new THREE.CylinderGeometry(0.14, 0.17, 0.95, 12);
    armGeo.rotateZ(0.85);
    armGeo.rotateX(-0.35);
    const armMesh = new THREE.Mesh(armGeo, jacketMat);
    armMesh.position.set(0.65, -0.6, halfDepth * 1.25);
    armGroup.add(armMesh);

    const handGeo = new THREE.SphereGeometry(0.16, 16, 12);
    handGeo.scale(1.1, 1.4, 0.85);
    const handMat = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.55,
      metalness: 0.05,
    });
    const handMesh = new THREE.Mesh(handGeo, handMat);
    handMesh.position.set(0.08, -0.22, halfDepth * 1.5);
    armGroup.add(handMesh);
    characterRoot.add(armGroup);

    // 5. Interactive Drag & 360-Degree Controls State
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velX = 0;
    let velY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let mouseHoverX = 0;
    let mouseHoverY = 0;
    let isHovering = false;

    // Reset handler exposed to React
    sceneStateRef.current.resetToFront = () => {
      const turns = Math.round(targetRotY / (Math.PI * 2));
      targetRotY = turns * Math.PI * 2;
      targetRotX = 0;
      velX = 0;
      velY = 0;
      setHasRotated(false);
    };

    // Pointer events
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      velX = 0;
      velY = 0;
      try {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      } catch {
        // Safe fallback
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevPointerX;
        const dy = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        const sensitivity = 0.0075;
        velX = dx * sensitivity;
        velY = dy * sensitivity;

        targetRotY += velX;
        targetRotX = Math.max(-0.65, Math.min(0.65, targetRotX + velY));

        setHasRotated(true);
      } else {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
          mouseHoverX = nx * 0.16;
          mouseHoverY = ny * 0.12;
          isHovering = true;
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
        setIsInteracting(false);
        try {
          (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        } catch {
          // Safe fallback
        }
      }
    };

    const onPointerLeave = () => {
      if (isDragging) {
        isDragging = false;
        setIsInteracting(false);
      }
      isHovering = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    // 6. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock.getDelta();
      const time = clock.getElapsedTime();

      // Inertia damping after drag release
      if (!isDragging) {
        targetRotY += velX;
        targetRotX = Math.max(-0.65, Math.min(0.65, targetRotX + velY));

        velX *= 0.92;
        velY *= 0.92;

        if (Math.abs(velX) < 0.0001) velX = 0;
        if (Math.abs(velY) < 0.0001) velY = 0;
      }

      // Smooth interpolation toward target rotation
      const baseTargetY = targetRotY + (isHovering && !isDragging ? mouseHoverX : 0);
      const baseTargetX = targetRotX + (isHovering && !isDragging ? -mouseHoverY : 0);

      characterRoot.rotation.y += (baseTargetY - characterRoot.rotation.y) * 0.12;
      characterRoot.rotation.x += (baseTargetX - characterRoot.rotation.x) * 0.12;

      // Subtle breathing float bobbing
      const idleBob = Math.sin(time * 2.0) * 0.05;
      characterRoot.position.y = idleBob;

      // Calculate current yaw in degrees (0 to 360)
      const normalizedYaw = ((characterRoot.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const deg = Math.round((normalizedYaw * 180) / Math.PI);
      setCurrentYawDeg(deg);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);

      frontTex.dispose();
      backTex.dispose();
      frontGeo.dispose();
      frontMat.dispose();
      backGeo.dispose();
      backMat.dispose();
      headDepthGeo.dispose();
      hairMat.dispose();
      topCrownGeo.dispose();
      torsoDepthGeo.dispose();
      jacketMat.dispose();
      tuftGeo1.dispose();
      tuftGeo2.dispose();
      rightTuftGeo1.dispose();
      rightTuftGeo2.dispose();
      armGeo.dispose();
      handGeo.dispose();
      handMat.dispose();
      renderer.dispose();
    };
  }, [isClient]);

  const handleReset = useCallback(() => {
    sceneStateRef.current.resetToFront?.();
  }, []);

  const getProfileLabel = (deg: number) => {
    if (deg >= 335 || deg < 25) return "Front Profile";
    if (deg >= 25 && deg < 65) return "Left 3/4 Profile";
    if (deg >= 65 && deg < 115) return "Left Profile";
    if (deg >= 115 && deg < 155) return "Left Rear Profile";
    if (deg >= 155 && deg < 205) return "Back Profile";
    if (deg >= 205 && deg < 245) return "Right Rear Profile";
    if (deg >= 245 && deg < 295) return "Right Profile";
    return "Right 3/4 Profile";
  };

  return (
    <div
      ref={containerRef}
      className="relative flex aspect-[783/768] w-full items-center justify-center select-none"
    >
      {/* Fallback image: visible during SSR, before 3D loads, or if WebGL is disabled */}
      {(!isClient || !webglAvailable || !isReady) && (
        <img
          src={frontPortrait}
          alt="Ashwin portfolio portrait"
          className="h-full w-full object-contain"
        />
      )}

      {/* Interactive WebGL Canvas */}
      {webglAvailable && (
        <canvas
          ref={canvasRef}
          className={`h-full w-full touch-none ${
            isInteracting ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ display: isClient && isReady ? "block" : "none" }}
          aria-label="3D Interactive character - drag to rotate 360 degrees"
        />
      )}

      {/* Floating 360° Interactive Control Pill */}
      {isClient && webglAvailable && isReady && (
        <div className="pointer-events-none absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3.5 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-black/85">
            <Rotate3D className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-[11px] font-medium tracking-wide text-white/90">
              {getProfileLabel(currentYawDeg)} ({currentYawDeg}°)
            </span>
            {hasRotated && (
              <button
                type="button"
                onClick={handleReset}
                className="ml-1 flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white transition-colors hover:bg-white/25 active:scale-95"
                title="Reset to Front Profile"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export wrapped in ErrorBoundary to guarantee zero page crash
export function Hero3DCharacter() {
  return (
    <ThreeErrorBoundary
      fallback={
        <div className="relative flex aspect-[783/768] w-full items-center justify-center select-none">
          <img
            src={frontPortrait}
            alt="Ashwin portfolio portrait"
            className="h-full w-full object-contain"
          />
        </div>
      }
    >
      <InnerHero3DCharacter />
    </ThreeErrorBoundary>
  );
}

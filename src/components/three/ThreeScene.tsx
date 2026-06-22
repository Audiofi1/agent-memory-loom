import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function MemoryCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
    ref.current.rotation.z = state.clock.elapsedTime * 0.06;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[1.6, 4]}>
        <MeshDistortMaterial
          color="#3b6dff"
          emissive="#1b2dff"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.85}
          distort={0.4}
          speed={1.6}
        />
      </Icosahedron>
      <Icosahedron args={[2.05, 2]}>
        <meshBasicMaterial color="#5ad7ff" wireframe transparent opacity={0.12} />
      </Icosahedron>
    </Float>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 900;
  const positions = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  })[0];

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#7aa2ff" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export function ThreeScene({ className }: { className?: string }) {
  const mounted = useMounted();
  if (!mounted) return null;
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.6} color="#9bc5ff" />
          <pointLight position={[-6, -3, -4]} intensity={2.2} color="#7c4dff" />
          <pointLight position={[6, -2, 2]} intensity={1.4} color="#27e0c0" />
          <MemoryCore />
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
}

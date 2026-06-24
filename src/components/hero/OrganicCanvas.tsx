import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Lightformer } from "@react-three/drei";
import * as THREE from "three";

function OrganicShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Slow, organic rotation
    meshRef.current.rotation.x = Math.sin(t / 4) * 0.5;
    meshRef.current.rotation.y = Math.cos(t / 4) * 0.5;
    meshRef.current.rotation.z = t / 3;
    
    // React to mouse movement for parallax
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    
    meshRef.current.rotation.x += (mouseY - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (mouseX - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <Float floatIntensity={2} speed={2} rotationIntensity={1.5}>
      <mesh ref={meshRef} scale={1.8}>
        {/* We use an Icosahedron for a gem/organic shape or a TorusKnot */}
        <torusKnotGeometry args={[1, 0.4, 256, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.8}
          chromaticAberration={0.4}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#2dd4bf"
          color="#0f766e"
        />
      </mesh>
    </Float>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#2dd4bf" />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      {/* Studio lighting environment for the transmission material to reflect */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[5, -1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
      </Environment>
    </>
  );
}

export function OrganicCanvas() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-80 mix-blend-screen pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <SceneLighting />
        <OrganicShape />
      </Canvas>
    </div>
  );
}

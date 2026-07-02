import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import { OptimizedCanvas } from "@/components/core/OptimizedCanvas";

function AbstractChip({ isDark, index }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const baseColor = index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b';

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <MeshDistortMaterial 
          color={baseColor}
          envMapIntensity={isDark ? 1 : 0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.2}
          speed={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Wireframe shell */}
      <mesh>
        <octahedronGeometry args={[1.7, 0]} />
        <meshBasicMaterial 
          color={isDark ? '#ffffff' : '#0f172a'} 
          wireframe 
          transparent 
          opacity={isDark ? 0.2 : 0.1} 
        />
      </mesh>
    </Float>
  );
}

export default function SMENetworkVisual({ index = 0 }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <OptimizedCanvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        className="absolute inset-0 w-full h-full"
      >
        <ambientLight intensity={isDark ? 0.8 : 1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <AbstractChip isDark={isDark} index={index} />
        <Environment preset={isDark ? 'night' : 'city'} />
      </OptimizedCanvas>
    </div>
  );
}

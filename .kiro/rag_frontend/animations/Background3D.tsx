import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const FloatingSphere: React.FC<{ position: [number, number, number]; color: string; size: number }> = ({ position, color, size }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 1.5;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.2) * 0.5;
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.004;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={1.5}
        opacity={0.5}
        transparent
        roughness={0.1}
        metalness={0.9}
      />
    </Sphere>
  );
};

const FloatingTorus: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004;
      meshRef.current.rotation.y += 0.006;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.25) * 1;
    }
  });

  return (
    <Torus ref={meshRef} args={[1.8, 0.5, 32, 100]} position={position}>
      <MeshDistortMaterial
        color="#764ba2"
        attach="material"
        distort={0.15}
        speed={1}
        opacity={0.45}
        transparent
        roughness={0.05}
        metalness={0.95}
      />
    </Torus>
  );
};

const FloatingBox: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.z += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.35) * 1.2;
    }
  });

  return (
    <Box ref={meshRef} args={[2, 2, 2]} position={position}>
      <MeshDistortMaterial
        color="#667eea"
        attach="material"
        distort={0.2}
        speed={1.2}
        opacity={0.48}
        transparent
        roughness={0.08}
        metalness={0.92}
      />
    </Box>
  );
};

export const Background3D: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#764ba2" />
        <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={1} />
        
        {/* Large central sphere */}
        <FloatingSphere position={[0, 0, -2]} color="#4A90E2" size={2.5} />
        
        {/* Side spheres */}
        <FloatingSphere position={[-5, 3, -1]} color="#667eea" size={1.8} />
        <FloatingSphere position={[5, -3, -3]} color="#764ba2" size={2} />
        <FloatingSphere position={[-4, -2, 1]} color="#4A90E2" size={1.5} />
        <FloatingSphere position={[4, 2, -4]} color="#667eea" size={1.6} />
        
        {/* Torus shapes */}
        <FloatingTorus position={[3, 1, -2]} />
        <FloatingTorus position={[-3, -1, -5]} />
        
        {/* Box shapes */}
        <FloatingBox position={[-2, 4, -3]} />
        <FloatingBox position={[2, -4, -1]} />
      </Canvas>
    </div>
  );
};

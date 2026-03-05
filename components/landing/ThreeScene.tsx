"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";

function FloatingObject({ position, color, geometry }: { position: [number, number, number], color: string, geometry: "box" | "sphere" | "octahedron" }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                {geometry === "box" && <boxGeometry args={[1, 1, 1]} />}
                {geometry === "sphere" && <sphereGeometry args={[0.7, 32, 32]} />}
                {geometry === "octahedron" && <octahedronGeometry args={[0.8]} />}
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
            </mesh>
        </Float>
    );
}

export default function ThreeScene() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

                <FloatingObject position={[-4, 2, -2]} color="#8b5cf6" geometry="octahedron" />
                <FloatingObject position={[4, -2, -5]} color="#ec4899" geometry="box" />
                <FloatingObject position={[3, 3, -3]} color="#3b82f6" geometry="sphere" />
                <FloatingObject position={[-3, -3, -1]} color="#10b981" geometry="box" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}

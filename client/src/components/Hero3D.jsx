import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

function Capsule(props) {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.y = t * 0.5;
        meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    });

    return (
        <group {...props} ref={meshRef}>
            {/* Top Half - White */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 1, 32]} />
                <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
            </mesh>
            <mesh position={[0, 1, 0]}>
                <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
            </mesh>

            {/* Bottom Half - Medical Blue */}
            <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 1, 32]} />
                <meshStandardMaterial color="#0ea5e9" roughness={0.1} metalness={0.1} />
            </mesh>
            <mesh position={[0, -1, 0]} rotation={[Math.PI, 0, 0]}>
                <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial color="#0ea5e9" roughness={0.1} metalness={0.1} />
            </mesh>

            {/* Ring/Band */}
            <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.82, 0.05, 16, 100]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    );
}

function FloatingOrbs() {
    return (
        <group>
            {[...Array(5)].map((_, i) => (
                <Float speed={2} rotationIntensity={1} floatIntensity={2} key={i}>
                    <mesh position={[
                        (Math.random() - 0.5) * 8,
                        (Math.random() - 0.5) * 8,
                        (Math.random() - 0.5) * 5 - 2
                    ]}>
                        <sphereGeometry args={[0.1 + Math.random() * 0.2, 16, 16]} />
                        <meshStandardMaterial
                            color={Math.random() > 0.5 ? "#10b981" : "#3b82f6"}
                            transparent
                            opacity={0.6}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    )
}

export default function Hero3D() {
    return (
        <div className="h-[400px] w-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />

                <Environment preset="city" />

                <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
                    <Capsule position={[0, 0, 0]} rotation={[0, 0, 0.2]} />
                </Float>

                <FloatingOrbs />

                <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
}

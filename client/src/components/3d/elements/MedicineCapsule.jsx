import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function MedicineCapsule(props) {
    const group = useRef();

    // Internal floating particles
    const particles = Array.from({ length: 8 }, (_, i) => ({
        position: [
            (Math.random() - 0.5) * 1,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 1
        ],
        scale: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.02 + 0.01
    }));

    useFrame((state) => {
        // Gentle floating rotation
        const t = state.clock.getElapsedTime();
        group.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {/* CAPSULE BODY */}
            <group>
                {/* Top Dome */}
                <mesh position={[0, 1, 0]}>
                    <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                    <meshPhysicalMaterial
                        color="#4f90ff" // Medical Blue
                        roughness={0.1}
                        transmission={0.6}
                        thickness={2}
                        clearcoat={1}
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Cylinder Body */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 2, 32, 1, true]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        roughness={0.1}
                        transmission={0.8}
                        thickness={1}
                        clearcoat={1}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Bottom Dome */}
                <mesh position={[0, -1, 0]} rotation={[Math.PI, 0, 0]}>
                    <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                    <meshPhysicalMaterial
                        color="#ffffff" // White bottom
                        roughness={0.2}
                        metalness={0.1}
                        transmission={0} // Opaque for contrast
                        transparent={false}
                    />
                </mesh>
            </group>

            {/* INTERNAL MOLECULES */}
            <group>
                {particles.map((data, i) => (
                    <FloatingParticle key={i} {...data} />
                ))}
            </group>

            {/* SCANNING BEAM EFFECT */}
            <ScannerBeam />
        </group>
    );
}

function FloatingParticle({ position, scale, speed }) {
    const ref = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        ref.current.position.y += Math.sin(t * speed * 5 + position[0]) * 0.005;
        ref.current.rotation.x += speed;
        ref.current.rotation.y += speed;
    });

    return (
        <Icosahedron ref={ref} args={[1, 0]} position={position} scale={scale}>
            <meshStandardMaterial
                color="#00ff88"
                emissive="#00ff88"
                emissiveIntensity={0.5}
                toneMapped={false}
            />
        </Icosahedron>
    );
}

function ScannerBeam() {
    const ref = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Move up and down
        ref.current.position.y = Math.sin(t * 1.5) * 1.8;
    });

    return (
        <group ref={ref}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.1, 1.4, 32]} />
                <meshBasicMaterial
                    color="#00ffe0"
                    transparent
                    opacity={0.4}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <pointLight color="#00ffe0" distance={2} intensity={2} />
        </group>
    );
}

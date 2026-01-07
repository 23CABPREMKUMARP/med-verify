import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Grid, Stars } from '@react-three/drei';
import { HolographicText } from '../elements/HolographicText';
import * as THREE from 'three';

function ScannerGrid({ active }) {
    const gridRef = useRef();

    useFrame((state, delta) => {
        if (active) {
            gridRef.current.position.z += delta * 10;
            if (gridRef.current.position.z > 10) gridRef.current.position.z = -10;
        }
    });

    return (
        <group ref={gridRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <Grid
                args={[20, 20]}
                cellSize={0.5}
                cellThickness={1}
                cellColor={active ? "#00ff88" : "#2a3b55"}
                sectionSize={3}
                sectionThickness={1.5}
                sectionColor={active ? "#00aaff" : "#1a2b44"}
                fadeDistance={20}
            />
        </group>
    );
}

function StreamParticles({ active }) {
    // A stream of data points moving into the tunnel
    const count = 100;
    const mesh = useRef();

    useFrame((state, delta) => {
        if (active) {
            mesh.current.rotation.z += delta * 2;
            mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, 2, 0.1);
        } else {
            mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, 1, 0.1);
        }
    });

    return (
        <points ref={mesh}>
            <sphereGeometry args={[4, 32, 32]} />
            <pointsMaterial size={0.05} color="#4f90ff" transparent opacity={0.5} />
        </points>
    )

}

export default function InteractiveScanner({ medicineInput, batchInput, manufacturerInput, loading }) {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none fade-in">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ alpha: true }}>
                <ambientLight intensity={1} />

                {/* Dynamic Holographic Text reflecting inputs */}
                <Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        {medicineInput && (
                            <HolographicText
                                text={medicineInput}
                                position={[-3, 2, 0]}
                                color="#00ffe0"
                            />
                        )}

                        {manufacturerInput && (
                            <HolographicText
                                text={manufacturerInput}
                                position={[3, -1, -2]}
                                color="#ffffff"
                            />
                        )}

                        {batchInput && (
                            <HolographicText
                                text={batchInput}
                                position={[0, 3, -4]}
                                color="#ffaa00"
                            />
                        )}
                    </Float>

                    <ScannerGrid active={loading} />
                    <StreamParticles active={loading} />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                </Suspense>
            </Canvas>

            {/* Overlay Gradient to blend with page */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/20 to-slate-950/80"></div>
        </div>
    );
}

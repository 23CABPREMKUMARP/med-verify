import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import { MedicineCapsule } from '../elements/MedicineCapsule';

export default function HeroScene() {
    return (
        <div className="w-full h-full relative z-10 fade-in-up">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

                <ambientLight intensity={0.5} color="#e6f2ff" />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1}
                    castShadow
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f90ff" />

                <Suspense fallback={null}>
                    <Float
                        speed={2}
                        rotationIntensity={0.5}
                        floatIntensity={1}
                    >
                        <MedicineCapsule scale={1.4} rotation={[0.4, 0.5, 0]} />
                    </Float>

                    <Environment preset="city" />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
}

import React, { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HolographicText({ text, position = [0, 0, 0], color = "#00ff88" }) {
    const mesh = useRef();

    useFrame(({ clock }) => {
        if (mesh.current) {
            mesh.current.material.opacity = 0.6 + Math.sin(clock.elapsedTime * 5) * 0.2;
        }
    });

    return (
        <group position={position}>
            <Text
                ref={mesh}
                fontSize={1.5}
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.05}
                textAlign="center"
                font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff" // Standard robust font
                anchorX="center"
                anchorY="middle"
            >
                {text}
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </Text>

            {/* Glow effect duplicate */}
            <Text
                fontSize={1.52}
                position={[0, 0, -0.05]}
                anchorX="center"
                anchorY="middle"
            >
                {text}
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </Text>
        </group>
    );
}

import { Canvas, useFrame } from "@react-three/fiber";

import {
  OrbitControls,
  Stars,
  Sparkles,
  Environment,
  Text,
} from "@react-three/drei";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";

import { BlendFunction } from "postprocessing";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import * as THREE from "three";

import "./styles.css";

// ======================================================
// REACTOR CORE
// ======================================================

function ReactorCore() {
  const core = useRef();

  useFrame(({ clock }) => {
    if (!core.current) return;

    core.current.rotation.y =
      clock.elapsedTime * 0.5;

    core.current.rotation.z =
      clock.elapsedTime * 0.2;
  });

  return (
    <group ref={core}>
      <Sparkles
        count={500}
        scale={12}
        size={3}
        speed={0.4}
        color="#00ffff"
      />

      <mesh>
        <icosahedronGeometry args={[1.2, 2]} />

        <meshStandardMaterial
          color="#111111"
          emissive="#a855f7"
          emissiveIntensity={4}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      <Text
        position={[0, -2.5, 0]}
        color="#00ffff"
        fontSize={0.3}
      >
        HOLOSPIN X
      </Text>
    </group>
  );
}

// ======================================================
// POV BLADES
// ======================================================

function POVBlades() {
  const blades = useRef();

  useFrame(({ clock }) => {
    if (!blades.current) return;

    blades.current.rotation.z =
      clock.elapsedTime * 20;
  });

  return (
    <group ref={blades}>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.12, 6, 0.05]} />

        <meshBasicMaterial color="#00ffff" />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.12, 6, 0.05]} />

        <meshBasicMaterial color="#a855f7" />
      </mesh>
    </group>
  );
}

// ======================================================
// PARTICLE RINGS
// ======================================================

function ParticleRing({
  radius,
  points,
  color,
  speed,
}) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = [];

    for (let i = 0; i < points; i++) {
      const angle =
        (i / points) * Math.PI * 2;

      arr.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
    }

    return new Float32Array(arr);
  }, [radius, points]);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.z =
      clock.elapsedTime * speed;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color={color}
        size={0.06}
      />
    </points>
  );
}

// ======================================================
// HUD
// ======================================================

function HUD({
  rpm,
  fps,
  sync,
  connected,
}) {
  return (
    <div className="hud">
      <div className="logo">
        HOLOSPIN X
      </div>

      <div className="status">
        <div>
          RPM
          <span>{rpm}</span>
        </div>

        <div>
          FPS
          <span>{fps}</span>
        </div>

        <div>
          SYNC
          <span>{sync}%</span>
        </div>
      </div>

      <div
        className={
          connected
            ? "connected"
            : "disconnected"
        }
      >
        {connected
          ? "ESP32 CONNECTED"
          : "NO CONNECTION"}
      </div>

      <div className="buttons">
        <button>LIVE FX</button>

        <button>GIF ENGINE</button>

        <button>TIMELINE</button>

        <button>FULLSCREEN</button>
      </div>
    </div>
  );
}

// ======================================================
// MAIN APP
// ======================================================

export default function App() {
  const [rpm, setRpm] =
    useState(1200);

  const [fps, setFps] =
    useState(60);

  const [sync, setSync] =
    useState(99.8);

  const [connected, setConnected] =
    useState(false);

  useEffect(() => {
    const ws =
      new WebSocket(
        "ws://192.168.4.1:81/"
      );

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = () => {
      setConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data =
          JSON.parse(event.data);

        setRpm(data.rpm || 0);
        setFps(data.fps || 0);
        setSync(data.sync || 0);
      } catch (e) {
        console.log(e);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="app">
      <HUD
        rpm={rpm}
        fps={fps}
        sync={sync}
        connected={connected}
      />

      <Canvas
        camera={{
          position: [0, 0, 9],
          fov: 60,
        }}
      >
        <color
          attach="background"
          args={["#020617"]}
        />

        <ambientLight intensity={1} />

        <pointLight
          position={[10, 10, 10]}
          intensity={5}
          color="#00ffff"
        />

        <pointLight
          position={[-10, -10, -10]}
          intensity={3}
          color="#a855f7"
        />

        <Environment preset="night" />

        <Stars
          radius={100}
          depth={50}
          count={7000}
          factor={4}
          fade
        />

        <ParticleRing
          radius={3}
          points={150}
          color="#00ffff"
          speed={1}
        />

        <ParticleRing
          radius={2.2}
          points={120}
          color="#a855f7"
          speed={-1.5}
        />

        <ParticleRing
          radius={1.5}
          points={80}
          color="#ffffff"
          speed={2}
        />

        <ReactorCore />

        <POVBlades />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.4}
        />

        <EffectComposer>
          <Bloom
            intensity={2}
            luminanceThreshold={0}
          />

          <ChromaticAberration
            blendFunction={
              BlendFunction.NORMAL
            }
            offset={
              new THREE.Vector2(
                0.001,
                0.001
              )
            }
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Stars,
  Sparkles,
  Text,
} from "@react-three/drei";

import * as THREE from "three";

import "./styles.css";

// ======================================
// CORE
// ======================================

function Core() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      clock.elapsedTime * 0.7;

    ref.current.rotation.z =
      clock.elapsedTime * 0.2;
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />

        <meshStandardMaterial
          color="#111111"
          emissive="#8b5cf6"
          emissiveIntensity={3}
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      <Sparkles
        count={120}
        scale={5}
        size={2}
        speed={0.3}
        color="#00ffff"
      />

      <Text
        position={[0, -2, 0]}
        fontSize={0.25}
        color="#00ffff"
      >
        HOLOSPIN X
      </Text>
    </group>
  );
}

// ======================================
// RINGS
// ======================================

function Rings() {
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame(({ clock }) => {
    if (ring1.current)
      ring1.current.rotation.z =
        clock.elapsedTime;

    if (ring2.current)
      ring2.current.rotation.z =
        -clock.elapsedTime * 1.5;
  });

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry
          args={[2.2, 0.03, 16, 200]}
        />

        <meshBasicMaterial
          color="#00ffff"
        />
      </mesh>

      <mesh ref={ring2}>
        <torusGeometry
          args={[2.8, 0.03, 16, 200]}
        />

        <meshBasicMaterial
          color="#ff00ff"
        />
      </mesh>
    </>
  );
}

// ======================================
// HUD
// ======================================

function HUD({
  rpm,
  fps,
  connected,
}) {
  return (
    <div className="hud">

      <div className="title">
        HOLOSPIN X
      </div>

      <div className="panel">

        <div className="card">
          RPM
          <span>{rpm}</span>
        </div>

        <div className="card">
          FPS
          <span>{fps}</span>
        </div>

        <div className="card">
          STATUS
          <span>
            {connected
              ? "ONLINE"
              : "OFFLINE"}
          </span>
        </div>

      </div>

      <div className="buttons">
        <button>LIVE FX</button>
        <button>UPLOAD</button>
        <button>CONTROL</button>
      </div>

    </div>
  );
}

// ======================================
// APP
// ======================================

export default function App() {

  const [rpm, setRpm] =
    useState(1200);

  const [fps, setFps] =
    useState(60);

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

    ws.onmessage = (msg) => {

      try {

        const data =
          JSON.parse(msg.data);

        setRpm(data.rpm || 0);

        setFps(data.fps || 0);

      } catch {}

    };

    return () => ws.close();

  }, []);

  return (
    <div className="app">

      <HUD
        rpm={rpm}
        fps={fps}
        connected={connected}
      />

      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 60,
        }}

        gl={{
          antialias: true,
          alpha: false,
          powerPreference:
            "high-performance",
        }}
      >

        <color
          attach="background"
          args={["#020617"]}
        />

        <ambientLight intensity={1} />

        <pointLight
          position={[5, 5, 5]}
          intensity={5}
          color="#00ffff"
        />

        <Stars
          radius={50}
          depth={20}
          count={1000}
          factor={2}
        />

        <Rings />

        <Core />

      </Canvas>

    </div>
  );
}

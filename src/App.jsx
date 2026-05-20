import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Text,
  Sparkles,
  Environment,
} from "@react-three/drei";

import { motion } from "framer-motion";

import * as THREE from "three";

// ======================================================
// LED RING
// ======================================================

function RotatingRing({
  radius,
  points,
  color,
  speed,
  size = 0.08,
}) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = [];

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;

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

    ref.current.rotation.x =
      Math.sin(clock.elapsedTime * 0.4) * 0.2;
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
        size={size}
        color={color}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </points>
  );
}

// ======================================================
// POV HOLOGRAM
// ======================================================

function HologramCore({
  rpm,
  audioLevel,
}) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      clock.elapsedTime * (rpm / 4000);

    ref.current.rotation.z =
      clock.elapsedTime * 0.2;

    ref.current.scale.setScalar(
      1 + audioLevel * 0.1
    );
  });

  return (
    <group ref={ref}>
      <RotatingRing
        radius={3}
        points={120}
        color="#00ffff"
        speed={1}
      />

      <RotatingRing
        radius={2.3}
        points={90}
        color="#a855f7"
        speed={-1.5}
      />

      <RotatingRing
        radius={1.6}
        points={70}
        color="#ffffff"
        speed={2}
      />

      <Sparkles
        count={300}
        scale={8}
        size={2}
        speed={0.5}
        color="#00ffff"
      />

      <mesh>
        <icosahedronGeometry args={[0.7, 1]} />

        <meshStandardMaterial
          color="#111827"
          emissive="#8b5cf6"
          emissiveIntensity={3}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      <Text
        position={[0, -4, 0]}
        fontSize={0.45}
        color="#00ffff"
      >
        HOLOSPIN X
      </Text>
    </group>
  );
}

// ======================================================
// GRID
// ======================================================

function BackgroundGrid() {
  return (
    <gridHelper
      args={[50, 50, "#00ffff", "#222222"]}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -10]}
    />
  );
}

// ======================================================
// SCENE
// ======================================================

function Scene({
  rpm,
  audioLevel,
}) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      <color
        attach="background"
        args={["#020617"]}
      />

      <ambientLight intensity={1.5} />

      <pointLight
        position={[10, 10, 10]}
        intensity={3}
        color="#00ffff"
      />

      <pointLight
        position={[-10, -10, -10]}
        intensity={2}
        color="#a855f7"
      />

      <Environment preset="night" />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        fade
      />

      <BackgroundGrid />

      <HologramCore
        rpm={rpm}
        audioLevel={audioLevel}
      />

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

// ======================================================
// HUD CARD
// ======================================================

function HudCard({
  title,
  value,
  color,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        bg-white/5
        border border-white/10
        backdrop-blur-2xl
        rounded-3xl
        p-5
        shadow-2xl
      "
    >
      <div className="text-gray-400 text-sm tracking-widest">
        {title}
      </div>

      <div
        className="text-3xl font-black mt-2"
        style={{ color }}
      >
        {value}
      </div>
    </motion.div>
  );
}

// ======================================================
// BUTTON
// ======================================================

function NeonButton({
  children,
  color,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        px-5 py-3
        rounded-2xl
        border
        transition-all
        duration-300
        hover:scale-105
        backdrop-blur-xl
      "
      style={{
        borderColor: color,
        background: `${color}20`,
        color,
        boxShadow: `0 0 20px ${color}50`,
      }}
    >
      {children}
    </button>
  );
}

// ======================================================
// MAIN APP
// ======================================================

export default function App() {
  const [rpm, setRpm] = useState(1200);
  const [fps, setFps] = useState(60);
  const [sync, setSync] = useState(99.8);
  const [mode, setMode] = useState("LIVE");

  const [connected, setConnected] =
    useState(false);

  const [socketData, setSocketData] =
    useState("NO SIGNAL");

  const [audioLevel, setAudioLevel] =
    useState(0);

  const [fullscreen, setFullscreen] =
    useState(false);

  // ======================================================
  // FAKE AUDIO REACTIVE
  // ======================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 2);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // ======================================================
  // WEBSOCKET ESP32
  // ======================================================

  useEffect(() => {
    let ws;

    try {
      ws = new WebSocket(
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
        setSocketData(event.data);

        try {
          const data = JSON.parse(
            event.data
          );

          if (data.rpm)
            setRpm(data.rpm);

          if (data.fps)
            setFps(data.fps);

          if (data.sync)
            setSync(data.sync);

          if (data.mode)
            setMode(data.mode);

        } catch (e) {
          console.log(e);
        }
      };
    } catch (e) {
      console.log(e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // ======================================================
  // FULLSCREEN
  // ======================================================

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();

      setFullscreen(true);
    } else {
      document.exitFullscreen();

      setFullscreen(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative text-white">
      {/* BACKGROUND */}

      <div className="absolute inset-0 z-0">
        <Scene
          rpm={rpm}
          audioLevel={audioLevel}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-black z-10" />

      {/* HEADER */}

      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center">
        <motion.div
          initial={{
            opacity: 0,
            x: -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="text-5xl font-black tracking-widest"
        >
          <span className="text-cyan-400">
            HOLO
          </span>

          <span className="text-purple-500">
            SPIN
          </span>

          <span className="text-white">
            {" "}
            X
          </span>
        </motion.div>

        <div
          className="
            px-5 py-3
            rounded-2xl
            border
            border-white/10
            backdrop-blur-2xl
            bg-white/5
          "
        >
          {connected ? (
            <span className="text-green-400">
              ESP32 CONNECTED
            </span>
          ) : (
            <span className="text-red-400">
              NO CONNECTION
            </span>
          )}
        </div>
      </div>

      {/* HUD */}

      <div className="absolute top-28 left-6 right-6 z-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        <HudCard
          title="RPM"
          value={rpm}
          color="#00ffff"
        />

        <HudCard
          title="FPS"
          value={fps}
          color="#a855f7"
        />

        <HudCard
          title="SYNC"
          value={`${sync}%`}
          color="#22c55e"
        />

        <HudCard
          title="MODE"
          value={mode}
          color="#f43f5e"
        />
      </div>

      {/* PANELS */}

      <div className="absolute bottom-6 left-6 right-6 z-20 grid md:grid-cols-3 gap-5">
        {/* WEBSOCKET */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-3xl
            p-5
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
          "
        >
          <div className="text-cyan-400 text-sm tracking-widest mb-3">
            WEBSOCKET DATA
          </div>

          <div className="font-mono text-lg break-all">
            {socketData}
          </div>
        </motion.div>

        {/* ENGINE */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="
            rounded-3xl
            p-5
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
          "
        >
          <div className="text-purple-400 text-sm tracking-widest mb-3">
            VISUAL ENGINE
          </div>

          <div className="space-y-2 text-gray-300">
            <div>ENGINE: THREE.JS</div>

            <div>GRAPHICS: WEBGL</div>

            <div>RENDER: POV HOLOGRAM</div>

            <div>TIMELINE: ACTIVE</div>

            <div>AUDIO FX: ENABLED</div>

            <div>LIVE MODE: ACTIVE</div>
          </div>
        </motion.div>

        {/* CONTROLS */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
          className="
            rounded-3xl
            p-5
            bg-white/5
            border border-white/10
            backdrop-blur-2xl
          "
        >
          <div className="text-pink-400 text-sm tracking-widest mb-4">
            CONTROL PANEL
          </div>

          <div className="flex flex-wrap gap-3">
            <NeonButton
              color="#00ffff"
              onClick={() =>
                setMode("LIVE FX")
              }
            >
              LIVE FX
            </NeonButton>

            <NeonButton
              color="#a855f7"
              onClick={() =>
                setMode("GIF ENGINE")
              }
            >
              GIF ENGINE
            </NeonButton>

            <NeonButton
              color="#22c55e"
              onClick={() =>
                setMode("TIMELINE")
              }
            >
              TIMELINE
            </NeonButton>

            <NeonButton
              color="#f43f5e"
              onClick={toggleFullscreen}
            >
              {fullscreen
                ? "EXIT"
                : "FULLSCREEN"}
            </NeonButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Hologram from './components/Hologram'
import FXPlane from './components/FXPlane'
import useESP32 from './hooks/useESP32'
import useAudio from './hooks/useAudio'

export default function App() {
  const { connected } = useESP32()
  const { level } = useAudio()

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <color attach="background" args={['black']} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <FXPlane audioLevel={level} />
        <Hologram audioLevel={level} />
        <OrbitControls />
      </Canvas>

      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'cyan',
        fontSize: '30px',
        fontWeight: 'bold'
      }}>
        HOLOSPIN X
      </div>

      <div style={{
        position: 'absolute',
        top: 70,
        left: 20,
        color: connected ? 'lime' : 'red'
      }}>
        {connected ? 'ESP32 CONNECTED' : 'ESP32 OFFLINE'}
      </div>
    </div>
  )
}

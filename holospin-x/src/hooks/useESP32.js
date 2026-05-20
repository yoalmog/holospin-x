import { useEffect, useState } from 'react'

export default function useESP32() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.4.1:81')

    ws.onopen = () => {
      setConnected(true)
      console.log('ESP32 CONNECTED')
    }

    ws.onclose = () => {
      setConnected(false)
    }

    return () => {
      ws.close()
    }
  }, [])

  function sendFrame(frame) {
    console.log(frame)
  }

  return {
    connected,
    sendFrame
  }
}

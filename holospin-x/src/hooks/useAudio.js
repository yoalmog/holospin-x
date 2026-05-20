import { useEffect, useState } from 'react'

export default function useAudio() {
  const [level, setLevel] = useState(0)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      const mic = ctx.createMediaStreamSource(stream)

      mic.connect(analyser)

      const data = new Uint8Array(analyser.frequencyBinCount)

      function update() {
        analyser.getByteFrequencyData(data)
        let avg = data.reduce((a, b) => a + b, 0) / data.length
        setLevel(avg / 255)
        requestAnimationFrame(update)
      }

      update()
    }).catch(err => {
      console.warn('Microphone access denied:', err)
    })
  }, [])

  return { level }
}

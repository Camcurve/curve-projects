import { useEffect, useRef } from 'react'

export default function BackgroundEffects() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let stars = []
    const STAR_COUNT = 110
    const ORANGE_RATIO = 0.18

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const seed = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.1,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        orange: Math.random() < ORANGE_RATIO,
      }))
    }

    const draw = (t) => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        s.x += s.vx
        s.y += s.vy
        if (s.x < -2) s.x = w + 2
        if (s.x > w + 2) s.x = -2
        if (s.y < -2) s.y = h + 2
        if (s.y > h + 2) s.y = -2
        const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase))
        ctx.globalAlpha = tw
        ctx.fillStyle = s.orange ? '#FF5F00' : '#E5E2E1'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    seed()
    raf = requestAnimationFrame(draw)

    const onResize = () => {
      resize()
      seed()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />
      <div className="glow-blob glow-blob-3" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

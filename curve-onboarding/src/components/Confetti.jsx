import { useEffect, useRef, useState } from 'react'

const COLORS = ['#FF5F00', '#FF7A29', '#FFAD80', '#F5B895', '#E5E2E1']

export default function Confetti({ durationMs = 1500, count = 130 }) {
  const canvasRef = useRef(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(true)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Two cannons at the bottom corners firing nearly straight up, leaning slightly inward.
    const cannons = [
      { x: 14, y: h - 4, aim: -Math.PI / 2 + Math.PI / 12 },   // up, slight right lean
      { x: w - 14, y: h - 4, aim: -Math.PI / 2 - Math.PI / 12 }, // up, slight left lean
    ]
    const spreadArc = Math.PI / 8 // ±22° spread around each cannon's aim

    // Speed tuned so the slowest particle still clears the top before the fade ends.
    // y(t) = y0 + vy0*t + 0.5*g*t^2 — want y(peak) ≈ -80 by t = durationMs * 0.7
    const targetT = (durationMs * 0.7) / 1000
    const minSpeed = (h + 80 + 0.5 * 260 * targetT * targetT) / targetT

    const particles = Array.from({ length: count }, (_, i) => {
      const cannon = cannons[i % 2]
      const angle = cannon.aim + (Math.random() - 0.5) * spreadArc
      const speed = minSpeed * (1 + Math.random() * 0.55) // 1.0x – 1.55x minimum
      const isRibbon = Math.random() > 0.3
      return {
        x: cannon.x + (Math.random() - 0.5) * 10,
        y: cannon.y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI * 2,
        aVel: (Math.random() - 0.5) * 16,
        len: isRibbon ? 6 + Math.random() * 6 : 2 + Math.random() * 2.5,
        thick: isRibbon ? 1.5 + Math.random() * 1.6 : null,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isRibbon,
      }
    })

    // Gentle gravity. No multiplicative drag (that was frame-rate dependent and was eating the upward motion).
    const gravity = 260
    const dragPerSec = 0.35 // linear velocity loss per second — frame-rate independent
    // Fade starts later and overlaps with particles reaching the top edge.
    const fadeStart = (durationMs * 0.6) / 1000
    const fadeLen = (durationMs / 1000) - fadeStart
    const totalS = durationMs / 1000
    const start = performance.now()
    let last = start
    let raf = 0
    let stopped = false

    const frame = (now) => {
      if (stopped) return
      const elapsed = (now - start) / 1000
      if (elapsed >= totalS) {
        ctx.clearRect(0, 0, w, h)
        setDone(true)
        return
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const alpha =
        elapsed < fadeStart ? 1 : Math.max(0, 1 - (elapsed - fadeStart) / fadeLen)

      const dragFactor = 1 - dragPerSec * dt
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.vy += gravity * dt
        p.vx *= dragFactor
        p.vy *= dragFactor
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.aVel * dt

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        if (p.isRibbon) {
          ctx.fillRect(-p.len / 2, -p.thick / 2, p.len, p.thick)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.len, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
    }
  }, [count, durationMs, done])

  if (done) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
}

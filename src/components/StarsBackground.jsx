import { useMemo } from 'react'

export default function StarsBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }))
  }, [])

  const hearts = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      size: Math.random() * 16 + 10,
    }))
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'white',
            borderRadius: '50%',
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      {hearts.map(h => (
        <div
          key={h.id}
          style={{
            position: 'absolute',
            left: `${h.x}%`,
            bottom: '-50px',
            fontSize: `${h.size}px`,
            animation: `float-up ${h.duration}s linear ${h.delay}s infinite`,
            opacity: 0.5,
          }}
        >
          💜
        </div>
      ))}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(88, 28, 135, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(126, 34, 206, 0.1) 0%, transparent 50%)',
      }} />
    </div>
  )
}

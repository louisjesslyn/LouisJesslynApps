import { useState, useEffect } from 'react'
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'

const ANNIVERSARY = new Date('2025-06-17T00:00:00')
const BIRTHDAY = new Date('2005-07-05')

function getAge() {
  const now = new Date()
  let age = now.getFullYear() - BIRTHDAY.getFullYear()
  const m = now.getMonth() - BIRTHDAY.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < BIRTHDAY.getDate())) age--
  return age
}

function getDaysToBirthday() {
  const now = new Date()
  const thisYear = new Date(now.getFullYear(), BIRTHDAY.getMonth(), BIRTHDAY.getDate())
  const nextBday = thisYear < now
    ? new Date(now.getFullYear() + 1, BIRTHDAY.getMonth(), BIRTHDAY.getDate())
    : thisYear
  return differenceInDays(nextBday, now)
}

export default function CounterCard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const totalDays = differenceInDays(time, ANNIVERSARY)
  const hours = differenceInHours(time, ANNIVERSARY) % 24
  const minutes = differenceInMinutes(time, ANNIVERSARY) % 60
  const seconds = differenceInSeconds(time, ANNIVERSARY) % 60

  const daysToBday = getDaysToBirthday()
  const age = getAge()

  return (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
      {/* Main counter */}
      <div className="glass glow-purple" style={{ gridColumn: '1 / -1', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'rgba(216, 180, 254, 0.6)', marginBottom: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Bersama Sejak 17 Juni 2025
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 700, background: 'linear-gradient(135deg, #d8b4fe, #f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: "'Playfair Display', serif" }}>
          {totalDays}
        </div>
        <div style={{ color: 'rgba(216, 180, 254, 0.7)', fontSize: '0.9rem' }}>hari bersama 💜</div>
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.8rem', color: 'rgba(167, 139, 250, 0.6)' }}>
          <span>{String(hours).padStart(2,'0')}j</span>
          <span>{String(minutes).padStart(2,'0')}m</span>
          <span style={{ color: totalDays > 0 ? '#c084fc' : '#f9a8d4' }}>{String(seconds).padStart(2,'0')}d</span>
        </div>
      </div>

      {/* Birthday countdown */}
      <div className="glass" style={{ padding: '1.2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎂</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f9a8d4' }}>{daysToBday}</div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(216, 180, 254, 0.6)' }}>hari lagi ulang tahun kita</div>
      </div>

      {/* Age */}
      <div className="glass" style={{ padding: '1.2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✨</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d8b4fe' }}>{age} tahun</div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(216, 180, 254, 0.6)' }}>umur kita yang sama</div>
      </div>
    </div>
  )
}

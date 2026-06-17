import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Map, Star, BookOpen, Mail, ArrowRight } from 'lucide-react'
import CounterCard from '../components/CounterCard'
import { useMemories } from '../hooks/useSupabase'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const quotes = [
  "Kamu adalah alasan terbaikku untuk tersenyum setiap hari. 💜",
  "Bersamamu, setiap momen terasa seperti keajaiban.",
  "Kamu bukan hanya kekasihku, tapi juga sahabat terbaikku.",
  "Punya ulang tahun yang sama denganmu adalah hadiah terbaik dari semesta.",
  "Setiap hari bersamamu adalah petualangan yang ingin ku ulang selamanya.",
  "Cintaku untukmu tak terukur, seperti bintang di langit malam.",
]

export default function Home() {
  const { memories } = useMemories()
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length))
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const recentMemories = memories.slice(0, 3)
  const favoriteMemories = memories.filter(m => m.is_favorite).slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '3rem 0 2rem', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
          <div className="heart-pulse" style={{ fontSize: '3rem', marginBottom: '1rem' }}>💜</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1.2, marginBottom: '1rem' }}>
            <span className="gradient-text">Louis & Jesslyn</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(216, 180, 254, 0.7)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            "{quotes[quoteIdx]}"
          </p>
          <div style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 1rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(167, 139, 250, 0.2)', borderRadius: '50px', fontSize: '0.8rem', color: 'rgba(216, 180, 254, 0.7)' }}>
            <Heart size={12} fill="#c084fc" color="#c084fc" />
            Sejak 17 Juni 2025
          </div>
        </div>

        {/* Counter */}
        <div style={{ opacity: visible ? 1 : 0, transition: 'all 0.8s ease 0.2s', marginBottom: '2.5rem' }}>
          <CounterCard />
        </div>

        {/* Quick nav cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem', opacity: visible ? 1 : 0, transition: 'all 0.8s ease 0.3s' }}>
          {[
            { to: '/map', icon: Map, label: 'Peta Kenangan', desc: 'Lokasi kita', color: '#c084fc' },
            { to: '/milestones', icon: Star, label: 'Perjalanan Kita', desc: 'Milestone bersama', color: '#f9a8d4' },
            { to: '/bucket-list', icon: BookOpen, label: 'Daftar Impian', desc: 'Yang ingin kita lakukan', color: '#a855f7' },
            { to: '/letters', icon: Mail, label: 'Surat Cinta', desc: 'Pesan dari hati', color: '#e879f9' },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="glass" style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid rgba(167, 139, 250, 0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color + '50'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.15)'; e.currentTarget.style.transform = 'none' }}>
                <Icon size={24} color={color} style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f3e8ff', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(167, 139, 250, 0.6)' }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent memories */}
        {recentMemories.length > 0 && (
          <div style={{ opacity: visible ? 1 : 0, transition: 'all 0.8s ease 0.4s', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#f3e8ff', margin: 0 }}>Kenangan Terbaru</h2>
              <Link to="/map" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#a855f7', textDecoration: 'none' }}>Lihat semua <ArrowRight size={14} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentMemories.map(m => (
                <div key={m.id} className="glass" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{m.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#f3e8ff', fontSize: '0.95rem', marginBottom: '2px' }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(167, 139, 250, 0.6)', marginBottom: '4px' }}>
                      {m.location_name} · {format(new Date(m.date), 'd MMM yyyy', { locale: id })}
                    </div>
                    {m.description && <p style={{ fontSize: '0.8rem', color: 'rgba(216, 180, 254, 0.7)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{m.description}</p>}
                  </div>
                  {m.is_favorite && <Heart size={14} fill="#f9a8d4" color="#f9a8d4" style={{ flexShrink: 0, marginTop: '2px' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '2rem 0 0', color: 'rgba(167, 139, 250, 0.4)', fontSize: '0.8rem' }}>
          Made with 💜 for Jesslyn
        </div>
      </div>
    </div>
  )
}

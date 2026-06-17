import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Heart, Map, BookOpen, Star, Mail, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Heart },
  { to: '/map', label: 'Kenangan', icon: Map },
  { to: '/milestones', label: 'Perjalanan', icon: Star },
  { to: '/bucket-list', label: 'Impian', icon: BookOpen },
  { to: '/letters', label: 'Surat Cinta', icon: Mail },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(13, 6, 24, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>💜</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.2rem',
            background: 'linear-gradient(135deg, #d8b4fe, #f9a8d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Louis & Jesslyn
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.4rem 0.9rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isActive ? '#f3e8ff' : 'rgba(216, 180, 254, 0.7)',
                background: isActive ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                border: isActive ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s',
              })}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#d8b4fe', cursor: 'pointer', display: 'none' }} className="mobile-menu-btn">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'rgba(13, 6, 24, 0.97)',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: isActive ? '#f3e8ff' : 'rgba(216, 180, 254, 0.7)',
                background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

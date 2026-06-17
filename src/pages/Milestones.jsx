import { useState } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { differenceInDays } from 'date-fns'
import { Plus, Loader, X } from 'lucide-react'
import { useMilestones } from '../hooks/useSupabase'
import { supabase } from '../lib/supabase'

const ANNIVERSARY = new Date('2025-06-17')

function AddMilestoneModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '', date: '', emoji: '💜' })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const emojis = ['💜', '💕', '🎉', '🌟', '🎂', '✈️', '🌸', '🔥', '🏆', '💍']

  const handleSave = async () => {
    if (!form.title || !form.date) return
    setSaving(true)
    await supabase.from('milestones').insert([form])
    setSaving(false)
    onSaved()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-dark" style={{ maxWidth: '420px', width: '100%', padding: '1.5rem', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d8b4fe' }}><X size={16} /></button>
        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f3e8ff', marginBottom: '1.25rem' }}>Tambah Milestone Baru</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Judul *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Nama momen penting..." />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Tanggal *</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Emoji</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {emojis.map(e => <button key={e} onClick={() => set('emoji', e)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: form.emoji === e ? '2px solid #a855f7' : '1px solid rgba(167,139,250,0.2)', background: form.emoji === e ? 'rgba(168,85,247,0.2)' : 'rgba(139,92,246,0.05)', cursor: 'pointer', fontSize: '1.1rem' }}>{e}</button>)}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Deskripsi</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Ceritakan momen ini..." rows={2} style={{ resize: 'vertical' }} />
          </div>
          <button className="btn-purple" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />Menyimpan...</> : '💜 Simpan'}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

export default function Milestones() {
  const { milestones, loading } = useMilestones()
  const [showAdd, setShowAdd] = useState(false)
  const [, forceUpdate] = useState(0)

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingTop: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#f3e8ff', marginBottom: '0.25rem' }}>
              Perjalanan Kita ✨
            </h1>
            <p style={{ color: 'rgba(167,139,250,0.6)', fontSize: '0.875rem' }}>Setiap momen berharga dalam hubungan kita</p>
          </div>
          <button className="btn-purple" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <Plus size={14} /> Tambah
          </button>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, rgba(168,85,247,0.5), rgba(168,85,247,0.05))' }} />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(167,139,250,0.5)' }}>
              <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
            </div>
          ) : milestones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(167,139,250,0.5)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <p>Belum ada milestone. Tambahkan momen penting kalian!</p>
            </div>
          ) : (
            milestones.map((m, i) => {
              const daysSince = differenceInDays(new Date(), new Date(m.date))
              const isFuture = daysSince < 0
              return (
                <div key={m.id} className="animate-fadeInUp" style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.75rem', position: 'relative', animationDelay: `${i * 0.1}s` }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: '-1.5rem', top: '14px', transform: 'translateX(-4px)',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: isFuture ? 'rgba(139,92,246,0.2)' : 'linear-gradient(135deg,#a855f7,#7e22ce)',
                    border: isFuture ? '2px solid rgba(167,139,250,0.3)' : '2px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem',
                    zIndex: 1,
                    boxShadow: isFuture ? 'none' : '0 0 10px rgba(168,85,247,0.5)',
                  }}>
                    {!isFuture && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />}
                  </div>

                  <div className="glass" style={{ flex: 1, padding: '1.25rem', opacity: isFuture ? 0.6 : 1 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{m.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f3e8ff', fontSize: '1.05rem', margin: 0 }}>{m.title}</h3>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(167,139,250,0.5)', flexShrink: 0 }}>
                            {format(new Date(m.date), 'd MMM yyyy', { locale: id })}
                          </div>
                        </div>
                        {m.description && <p style={{ color: 'rgba(216,180,254,0.7)', fontSize: '0.85rem', marginTop: '6px', lineHeight: 1.6 }}>{m.description}</p>}
                        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: isFuture ? '#60a5fa' : '#a855f7', fontWeight: 600 }}>
                          {isFuture ? `${Math.abs(daysSince)} hari lagi` : daysSince === 0 ? '🎉 Hari ini!' : `${daysSince} hari yang lalu`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Stats */}
        {milestones.length > 0 && (
          <div className="glass" style={{ padding: '1.25rem', marginTop: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(167,139,250,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Sudah bersama selama</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg,#d8b4fe,#f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: "'Playfair Display', serif" }}>
              {differenceInDays(new Date(), ANNIVERSARY)}
            </div>
            <div style={{ color: 'rgba(216,180,254,0.7)', fontSize: '0.875rem' }}>hari yang indah</div>
          </div>
        )}
      </div>

      {showAdd && <AddMilestoneModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); forceUpdate(v => v + 1); window.location.reload() }} />}
    </div>
  )
}

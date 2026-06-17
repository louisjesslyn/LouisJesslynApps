import { useState } from 'react'
import { CheckCircle, Circle, Plus, Loader, X, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useBucketList } from '../hooks/useSupabase'
import { supabase } from '../lib/supabase'

const EMOJIS = ['🌟', '✈️', '🍕', '🎉', '💃', '🌊', '🏔️', '🎪', '📸', '🧺', '🎭', '🌸', '🍳', '🎡', '🌅', '💜']

function AddItemModal({ onClose, onSaved }) {
  const [dream, setDream] = useState('')
  const [emoji, setEmoji] = useState('🌟')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!dream.trim()) return
    setSaving(true)
    await supabase.from('bucket_list').insert([{ dream, emoji }])
    setSaving(false)
    onSaved()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-dark" style={{ maxWidth: '400px', width: '100%', padding: '1.5rem', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d8b4fe' }}><X size={16} /></button>
        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f3e8ff', marginBottom: '1.25rem' }}>Tambah Impian Baru 🌟</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Impian *</label>
            <input value={dream} onChange={e => setDream(e.target.value)} placeholder="Apa yang ingin kita lakukan bersama?" />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Emoji</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {EMOJIS.map(e => <button key={e} onClick={() => setEmoji(e)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: emoji === e ? '2px solid #a855f7' : '1px solid rgba(167,139,250,0.2)', background: emoji === e ? 'rgba(168,85,247,0.2)' : 'rgba(139,92,246,0.05)', cursor: 'pointer', fontSize: '1.1rem' }}>{e}</button>)}
            </div>
          </div>
          <button className="btn-purple" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0.25rem' }}>
            {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />Menyimpan...</> : '💜 Tambahkan'}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

export default function BucketList() {
  const { items, loading, toggleDone } = useBucketList()
  const [showAdd, setShowAdd] = useState(false)
  const [, refresh] = useState(0)

  const done = items.filter(i => i.is_done)
  const todo = items.filter(i => !i.is_done)
  const pct = items.length > 0 ? Math.round((done.length / items.length) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingTop: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#f3e8ff', marginBottom: '0.25rem' }}>
              Daftar Impian Kita 🌟
            </h1>
            <p style={{ color: 'rgba(167,139,250,0.6)', fontSize: '0.875rem' }}>Hal-hal yang ingin kita lakukan bersama</p>
          </div>
          <button className="btn-purple" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <Plus size={14} /> Tambah
          </button>
        </div>

        {/* Progress */}
        {items.length > 0 && (
          <div className="glass" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#f3e8ff', fontWeight: 600 }}>
                <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', color: '#a855f7' }} />
                {done.length} dari {items.length} impian terwujud!
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d8b4fe' }}>{pct}%</div>
            </div>
            <div style={{ height: '8px', background: 'rgba(139,92,246,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#7e22ce,#e879f9)', borderRadius: '4px', transition: 'width 0.8s ease', boxShadow: '0 0 10px rgba(168,85,247,0.5)' }} />
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader size={24} style={{ animation: 'spin 1s linear infinite', color: '#a855f7' }} />
          </div>
        ) : (
          <>
            {/* Todo items */}
            {todo.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.85rem', color: 'rgba(167,139,250,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Belum dilakukan ({todo.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {todo.map(item => (
                    <div
                      key={item.id}
                      className="glass"
                      style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => toggleDone(item.id, item.is_done)}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'}
                    >
                      <Circle size={20} color="rgba(167,139,250,0.4)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.emoji}</span>
                      <span style={{ color: '#f3e8ff', fontSize: '0.9rem', fontWeight: 500 }}>{item.dream}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Done items */}
            {done.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.85rem', color: 'rgba(167,139,250,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Sudah dilakukan! 🎉 ({done.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {done.map(item => (
                    <div
                      key={item.id}
                      className="glass"
                      style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', opacity: 0.7 }}
                      onClick={() => toggleDone(item.id, item.is_done)}
                    >
                      <CheckCircle size={20} color="#a855f7" fill="rgba(168,85,247,0.2)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: 'rgba(216,180,254,0.6)', fontSize: '0.9rem', textDecoration: 'line-through' }}>{item.dream}</span>
                        {item.done_date && <div style={{ fontSize: '0.7rem', color: 'rgba(167,139,250,0.4)', marginTop: '2px' }}>{format(new Date(item.done_date), 'd MMM yyyy', { locale: id })}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {items.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(167,139,250,0.5)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                <p>Belum ada impian. Mulai tambahkan sekarang!</p>
              </div>
            )}
          </>
        )}
      </div>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); refresh(v => v + 1); window.location.reload() }} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

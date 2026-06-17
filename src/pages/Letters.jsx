import { useState } from 'react'
import { Mail, Heart, Lock, Unlock, Plus, X, Loader, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useLoveLetters } from '../hooks/useSupabase'
import { supabase } from '../lib/supabase'

function WriteLetter({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', content: '', from_name: 'Louis', to_name: 'Jesslyn', is_revealed: true, reveal_date: '' })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title || !form.content) return
    setSaving(true)
    await supabase.from('love_letters').insert([form])
    setSaving(false)
    onSaved()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-dark" style={{ maxWidth: '540px', width: '100%', padding: '1.5rem', position: 'relative', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d8b4fe' }}><X size={16} /></button>
        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f3e8ff', marginBottom: '1.25rem' }}>Tulis Surat Cinta 💌</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Dari</label>
              <input value={form.from_name} onChange={e => set('from_name', e.target.value)} placeholder="Namamu" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Untuk</label>
              <input value={form.to_name} onChange={e => set('to_name', e.target.value)} placeholder="Nama dia" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Judul Surat *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul suratmu..." />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Isi Surat *</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} placeholder="Tuliskan perasaanmu dari hati yang paling dalam..." rows={6} style={{ resize: 'vertical', fontFamily: "'Nunito', sans-serif", lineHeight: 1.7 }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: 'rgba(216,180,254,0.7)' }}>
            <input type="checkbox" checked={form.is_revealed} onChange={e => set('is_revealed', e.target.checked)} style={{ width: 'auto', accentColor: '#a855f7' }} />
            Surat ini langsung terlihat
          </label>
          {!form.is_revealed && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Tanggal dibuka (opsional)</label>
              <input type="date" value={form.reveal_date} onChange={e => set('reveal_date', e.target.value)} />
            </div>
          )}
          <button className="btn-purple" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0.25rem' }}>
            {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />Mengirim...</> : '💌 Kirim Surat'}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

function LetterCard({ letter }) {
  const [open, setOpen] = useState(false)
  const canReveal = letter.is_revealed || (letter.reveal_date && new Date(letter.reveal_date) <= new Date())

  return (
    <>
      <div
        className="glass"
        style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}
        onClick={() => canReveal && setOpen(true)}
        onMouseEnter={e => { if (canReveal) { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'; e.currentTarget.style.transform = 'none' }}
      >
        {/* Decorative */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(233,121,249,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={16} color="#c084fc" />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: '#f3e8ff', fontSize: '1rem', marginBottom: '2px' }}>{letter.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(167,139,250,0.5)' }}>
                {letter.from_name} → {letter.to_name}
              </div>
            </div>
          </div>
          {canReveal ? <Unlock size={16} color="#a855f7" /> : <Lock size={16} color="rgba(167,139,250,0.4)" />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(167,139,250,0.5)' }}>
            {format(new Date(letter.created_at), 'd MMMM yyyy', { locale: id })}
          </div>
          {canReveal ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#a855f7' }}>
              <Eye size={12} /> Baca surat
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'rgba(167,139,250,0.4)' }}>
              Dibuka: {letter.reveal_date ? format(new Date(letter.reveal_date), 'd MMM yyyy', { locale: id }) : 'Belum ditentukan'}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="glass-dark" style={{ maxWidth: '540px', width: '100%', padding: '2rem', position: 'relative', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d8b4fe' }}><X size={16} /></button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Heart size={32} fill="rgba(168,85,247,0.3)" color="#c084fc" style={{ marginBottom: '0.5rem' }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#f3e8ff', fontSize: '1.4rem', margin: '0 0 4px' }}>{letter.title}</h2>
              <div style={{ fontSize: '0.8rem', color: 'rgba(167,139,250,0.5)' }}>
                Dari {letter.from_name} untuk {letter.to_name} · {format(new Date(letter.created_at), 'd MMMM yyyy', { locale: id })}
              </div>
            </div>

            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '1rem',
              lineHeight: 1.9,
              color: 'rgba(243,232,255,0.85)',
              padding: '1.5rem',
              background: 'rgba(139,92,246,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(167,139,250,0.15)',
              whiteSpace: 'pre-wrap',
            }}>
              {letter.content}
            </div>

            <div style={{ textAlign: 'right', marginTop: '1rem', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'rgba(216,180,254,0.5)', fontSize: '0.9rem' }}>
              — {letter.from_name} 💜
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function Letters() {
  const { letters, loading } = useLoveLetters()
  const [showWrite, setShowWrite] = useState(false)

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingTop: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#f3e8ff', marginBottom: '0.25rem' }}>
              Surat Cinta 💌
            </h1>
            <p style={{ color: 'rgba(167,139,250,0.6)', fontSize: '0.875rem' }}>Pesan-pesan dari hati yang paling dalam</p>
          </div>
          <button className="btn-purple" onClick={() => setShowWrite(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <Plus size={14} /> Tulis Surat
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader size={24} style={{ animation: 'spin 1s linear infinite', color: '#a855f7' }} />
          </div>
        ) : letters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(167,139,250,0.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
            <p>Belum ada surat. Tulis surat pertamamu untuk dia!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {letters.map(l => <LetterCard key={l.id} letter={l} />)}
          </div>
        )}
      </div>

      {showWrite && <WriteLetter onClose={() => setShowWrite(false)} onSaved={() => { setShowWrite(false); window.location.reload() }} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

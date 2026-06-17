import { useState, useRef } from 'react'
import { X, MapPin, Loader, Upload, ImagePlus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  { value: 'moment', label: '💫 Momen Spesial' },
  { value: 'first_date', label: '💜 Kencan Pertama' },
  { value: 'anniversary', label: '🎉 Anniversary' },
  { value: 'trip', label: '✈️ Perjalanan' },
  { value: 'special', label: '⭐ Spesial' },
]

const EMOJIS = ['💜', '💕', '🌸', '✨', '🌟', '🎉', '🌹', '🦋', '🌙', '☁️', '🍃', '💫']

export default function AddMemoryModal({ position, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location_name: '',
    emoji: '💜',
    category: 'moment',
    is_favorite: false,
  })
  const [photos, setPhotos] = useState([]) // { file, preview, uploading, url, error }
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      url: null,
      error: null,
    }))
    setPhotos(prev => [...prev, ...newPhotos])
    e.target.value = ''
  }

  const removePhoto = (idx) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const uploadPhoto = async (photo, idx) => {
    setPhotos(prev => prev.map((p, i) => i === idx ? { ...p, uploading: true, error: null } : p))
    const ext = photo.file.name.split('.').pop()
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('memories')
      .upload(filename, photo.file, { contentType: photo.file.type })

    if (error) {
      setPhotos(prev => prev.map((p, i) => i === idx ? { ...p, uploading: false, error: error.message } : p))
      return null
    }

    const { data: { publicUrl } } = supabase.storage.from('memories').getPublicUrl(data.path)
    setPhotos(prev => prev.map((p, i) => i === idx ? { ...p, uploading: false, url: publicUrl } : p))
    return publicUrl
  }

  const handleSave = async () => {
    if (!form.title || !form.location_name || !form.date) {
      setError('Judul, nama lokasi, dan tanggal wajib diisi.')
      return
    }
    setSaving(true)
    setError('')

    // Upload foto yang belum diupload
    const uploadedUrls = []
    for (let i = 0; i < photos.length; i++) {
      if (photos[i].url) {
        uploadedUrls.push(photos[i].url)
      } else {
        const url = await uploadPhoto(photos[i], i)
        if (url) uploadedUrls.push(url)
      }
    }

    const { error: err } = await supabase.from('memories').insert([{
      title: form.title,
      description: form.description,
      date: form.date,
      lat: position.lat,
      lng: position.lng,
      location_name: form.location_name,
      emoji: form.emoji,
      category: form.category,
      is_favorite: form.is_favorite,
      photos: uploadedUrls,
    }])

    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-dark" style={{ maxWidth: '480px', width: '100%', padding: '1.5rem', position: 'relative', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d8b4fe' }}>
          <X size={16} />
        </button>

        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f3e8ff', marginBottom: '0.25rem' }}>Tambah Kenangan Baru</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'rgba(167,139,250,0.6)', marginBottom: '1.25rem' }}>
          <MapPin size={12} /> {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Judul *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Nama kenangan ini..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Tanggal *</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Nama Lokasi *</label>
              <input value={form.location_name} onChange={e => set('location_name', e.target.value)} placeholder="cth: Taman Suropati" />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Kategori</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Emoji</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => set('emoji', e)} style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: form.emoji === e ? '2px solid #a855f7' : '1px solid rgba(167,139,250,0.2)',
                  background: form.emoji === e ? 'rgba(168,85,247,0.2)' : 'rgba(139,92,246,0.05)',
                  cursor: 'pointer', fontSize: '1.1rem',
                }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '4px' }}>Cerita</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Ceritakan momen ini..." rows={3} style={{ resize: 'vertical' }} />
          </div>

          {/* Photo upload */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'rgba(216,180,254,0.7)', display: 'block', marginBottom: '8px' }}>Foto Kenangan</label>

            {/* Preview grid */}
            {photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(167,139,250,0.2)' }}>
                    <img src={p.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: p.uploading ? 0.5 : 1 }} />
                    {p.uploading && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                        <Loader size={16} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                      </div>
                    )}
                    {p.url && (
                      <div style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(168,85,247,0.8)', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                    )}
                    {p.error && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(251,113,133,0.3)', fontSize: '10px', color: 'white', padding: '4px', textAlign: 'center' }}>
                        Gagal
                      </div>
                    )}
                    <button
                      onClick={() => removePhoto(i)}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '10px', cursor: 'pointer',
                border: '1px dashed rgba(167,139,250,0.4)', background: 'rgba(139,92,246,0.05)',
                color: 'rgba(216,180,254,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', fontSize: '0.85rem', fontFamily: 'Nunito', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)'; e.currentTarget.style.background = 'rgba(139,92,246,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)' }}
            >
              <ImagePlus size={16} />
              Pilih foto dari galeri
            </button>
            <div style={{ fontSize: '0.7rem', color: 'rgba(167,139,250,0.4)', marginTop: '4px' }}>Bisa pilih lebih dari 1 foto sekaligus</div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', color: 'rgba(249,168,212,0.8)' }}>
            <input type="checkbox" checked={form.is_favorite} onChange={e => set('is_favorite', e.target.checked)} style={{ width: 'auto', accentColor: '#a855f7' }} />
            Tandai sebagai kenangan favorit 💜
          </label>

          {error && (
            <div style={{ color: '#fb7185', fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(251,113,133,0.1)', borderRadius: '8px', border: '1px solid rgba(251,113,133,0.2)' }}>
              {error}
            </div>
          )}

          <button className="btn-purple" onClick={handleSave} disabled={saving} style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {saving
              ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Menyimpan...</>
              : '💜 Simpan Kenangan'
            }
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

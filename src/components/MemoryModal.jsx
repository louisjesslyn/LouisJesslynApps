import { useState } from 'react'
import { X, MapPin, Calendar, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const CATEGORY_LABELS = {
  first_date: '💜 Kencan Pertama',
  anniversary: '🎉 Anniversary',
  trip: '✈️ Perjalanan',
  moment: '💫 Momen Spesial',
  special: '⭐ Spesial',
}

export default function MemoryModal({ memory, onClose }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  if (!memory) return null

  const photos = memory.photos?.filter(Boolean) || []
  const hasPhotos = photos.length > 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-dark"
        style={{ maxWidth: '520px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '0', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Photo viewer */}
        {hasPhotos && (
          <div style={{ position: 'relative', height: '240px', background: '#0d0618', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
            <img
              src={photos[photoIdx]}
              alt="memory"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(13,6,24,0.8))' }} />
            {photos.length > 1 && (
              <>
                <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                  style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                  <ChevronRight size={18} />
                </button>
                <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                  {photos.map((_, i) => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === photoIdx ? '#c084fc' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }} onClick={() => setPhotoIdx(i)} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ padding: '1.5rem' }}>
          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(167, 139, 250, 0.3)',
            borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#d8b4fe',
          }}>
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{memory.emoji}</span>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#a855f7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {CATEGORY_LABELS[memory.category] || memory.category}
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#f3e8ff', margin: 0 }}>
                {memory.title}
              </h2>
            </div>
          </div>

          {memory.is_favorite && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(249, 168, 212, 0.15)', border: '1px solid rgba(249, 168, 212, 0.3)', borderRadius: '50px', padding: '2px 10px', fontSize: '0.75rem', color: '#f9a8d4', marginBottom: '0.75rem' }}>
              <Heart size={10} fill="currentColor" /> Kenangan Favorit
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'rgba(216, 180, 254, 0.7)' }}>
              <Calendar size={14} color="#a855f7" />
              {format(new Date(memory.date), 'd MMMM yyyy', { locale: id })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'rgba(216, 180, 254, 0.7)' }}>
              <MapPin size={14} color="#a855f7" />
              {memory.location_name}
            </div>
          </div>

          {memory.description && (
            <p style={{ color: 'rgba(243, 232, 255, 0.8)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
              {memory.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

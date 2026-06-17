import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Heart, Plus, Filter, Search } from 'lucide-react'
import { useMemories } from '../hooks/useSupabase'
import MemoryModal from '../components/MemoryModal'
import AddMemoryModal from '../components/AddMemoryModal'

const CATEGORY_COLORS = {
  first_date: '#e879f9',
  anniversary: '#f9a8d4',
  trip: '#60a5fa',
  moment: '#c084fc',
  special: '#fbbf24',
}

function createIcon(emoji, category) {
  const color = CATEGORY_COLORS[category] || '#a855f7'
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:36px;height:36px;border-radius:50% 50% 50% 0;
        background:linear-gradient(135deg,${color},#7e22ce);
        transform:rotate(-45deg);display:flex;align-items:center;
        justify-content:center;box-shadow:0 4px 15px ${color}80;
        border:2px solid rgba(255,255,255,0.25);cursor:pointer;
        transition:transform 0.2s;
      ">
        <span style="transform:rotate(45deg);font-size:16px;line-height:1">${emoji}</span>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  })
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: e => onMapClick(e.latlng) })
  return null
}

const CATEGORIES = ['all', 'moment', 'first_date', 'anniversary', 'trip', 'special']
const CATEGORY_LABELS = { all: 'Semua', moment: '💫 Momen', first_date: '💜 Kencan', anniversary: '🎉 Anniv', trip: '✈️ Trip', special: '⭐ Spesial' }

export default function MapPage() {
  const { memories, loading, refetch } = useMemories()
  const [selected, setSelected] = useState(null)
  const [addPos, setAddPos] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showTip, setShowTip] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => memories.filter(m => {
    const matchCat = filter === 'all' || m.category === filter
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.location_name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [memories, filter, search])

  const handleMapClick = (latlng) => {
    if (!isAdding) return
    setAddPos(latlng)
  }

  const center = filtered.length > 0
    ? [filtered[0].lat, filtered[0].lng]
    : [-6.2088, 106.8456]

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#f3e8ff', marginBottom: '0.25rem' }}>
            Peta Kenangan 🗺️
          </h1>
          <p style={{ color: 'rgba(167, 139, 250, 0.6)', fontSize: '0.875rem' }}>
            {memories.length} kenangan tersimpan di berbagai lokasi
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(167,139,250,0.5)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kenangan..." style={{ paddingLeft: '30px' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '0.35rem 0.75rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Nunito',
                background: filter === c ? 'linear-gradient(135deg,#9333ea,#7e22ce)' : 'rgba(139,92,246,0.1)',
                color: filter === c ? 'white' : 'rgba(216,180,254,0.7)',
                border: filter === c ? 'none' : '1px solid rgba(167,139,250,0.2)',
                transition: 'all 0.2s',
              }}>
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <button
            className={isAdding ? 'btn-purple' : 'btn-outline'}
            onClick={() => setIsAdding(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}
          >
            <Plus size={14} />
            {isAdding ? 'Klik di peta...' : 'Tambah Kenangan'}
          </button>
        </div>

        {/* Tip */}
        {showTip && isAdding && (
          <div style={{ marginBottom: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '10px', fontSize: '0.8rem', color: '#d8b4fe' }}>
            💜 Klik di peta untuk menandai lokasi kenangan baru
          </div>
        )}

        {/* Map */}
        <div className="glow-purple" style={{ borderRadius: '16px', overflow: 'hidden', height: 'clamp(400px, 55vh, 600px)', marginBottom: '1.5rem' }}>
          <MapContainer
            center={center}
            zoom={memories.length === 0 ? 12 : 10}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {filtered.map(m => (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                icon={createIcon(m.emoji, m.category)}
                eventHandlers={{ click: () => setSelected(m) }}
              >
                <Popup>
                  <div style={{ minWidth: '160px', fontFamily: 'Nunito' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{m.emoji}</span>
                      <span style={{ color: '#f3e8ff' }}>{m.title}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(216,180,254,0.6)', marginBottom: '6px' }}>
                      {m.location_name}<br />
                      {format(new Date(m.date), 'd MMM yyyy', { locale: id })}
                    </div>
                    {m.is_favorite && <span style={{ fontSize: '0.7rem', color: '#f9a8d4' }}>💜 Favorit</span>}
                    <button
                      onClick={() => setSelected(m)}
                      style={{ display: 'block', marginTop: '8px', width: '100%', background: 'linear-gradient(135deg,#9333ea,#7e22ce)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Nunito', fontWeight: 600 }}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Memory list */}
        {!loading && filtered.length > 0 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f3e8ff', marginBottom: '1rem', fontSize: '1.1rem' }}>
              Daftar Kenangan ({filtered.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {filtered.map(m => (
                <div
                  key={m.id}
                  className="glass"
                  onClick={() => setSelected(m)}
                  style={{ padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{m.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f3e8ff', marginBottom: '2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {m.title}
                        {m.is_favorite && <Heart size={11} fill="#f9a8d4" color="#f9a8d4" />}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(167,139,250,0.6)' }}>
                        {m.location_name} · {format(new Date(m.date), 'd MMM yyyy', { locale: id })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && memories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(167,139,250,0.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
            <p>Belum ada kenangan. Aktifkan mode "Tambah Kenangan" dan klik di peta!</p>
          </div>
        )}
      </div>

      {selected && <MemoryModal memory={selected} onClose={() => setSelected(null)} />}
      {addPos && (
        <AddMemoryModal
          position={addPos}
          onClose={() => { setAddPos(null); setIsAdding(false) }}
          onSaved={() => { setAddPos(null); setIsAdding(false); refetch() }}
        />
      )}
    </div>
  )
}

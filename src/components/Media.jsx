import { useLayoutEffect, useRef, useState } from 'react'
import { MOCKUPS } from './mockups/index.js'

// Alle kaartmedia worden ontworpen op een vast podium van 360 x 480 en geschaald.
// Coördinaten van vlakken en fouten zijn relatief (0–1), zodat ze op elk scherm kloppen.
export const PODIUM_B = 360
export const PODIUM_H = 480

function normaliseer(media) {
  if (!media) return null
  if (typeof media === 'string') return { type: 'image', src: media }
  return media
}

export function Media({ media, className = '', style, children, onTik, alt = '' }) {
  const ref = useRef(null)
  const [schaal, setSchaal] = useState(1)
  const m = normaliseer(media)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSchaal(e.contentRect.width / PODIUM_B))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function tik(e) {
    if (!onTik) return
    const r = ref.current.getBoundingClientRect()
    onTik({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }

  const Mockup = m?.type === 'mockup' ? MOCKUPS[m.id] : null

  return (
    <div ref={ref} className={`podium ${className}`} style={style} onClick={onTik ? tik : undefined}>
      {m?.type === 'image' && <img className="podium-img" src={m.src} alt={alt} draggable={false} />}
      {Mockup && (
        <div className="podium-inhoud" style={{ transform: `scale(${schaal})` }} aria-hidden="true">
          <Mockup versie={m.versie ?? 'eind'} data={m} />
        </div>
      )}
      {m?.type === 'mockup' && !Mockup && <div className="podium-leeg">Mockup “{m.id}” bestaat niet</div>}
      {children}
    </div>
  )
}

// Een gekleurd vlak (laag 2): groen = AI/machine, blauw = mens.
export function Vlak({ vlak, nr, actief, onClick }) {
  return (
    <button
      type="button"
      className={`vlak vlak-${vlak.door} ${actief ? 'is-actief' : ''}`}
      style={{
        left: `${vlak.x * 100}%`,
        top: `${vlak.y * 100}%`,
        width: `${vlak.b * 100}%`,
        height: `${vlak.h * 100}%`,
        animationDelay: `${nr * 120}ms`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      aria-label={`${vlak.door === 'ai' ? 'AI' : 'Mens'}: ${vlak.uitleg}`}
    >
      <span className="vlak-nr">{nr + 1}</span>
    </button>
  )
}

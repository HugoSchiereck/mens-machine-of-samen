import { useCallback, useEffect, useRef, useState } from 'react'
import { Media } from '../components/Media.jsx'
import { IcoonKlok, IcoonMachine, IcoonMens, IcoonSamen } from '../components/Iconen.jsx'
import { SECONDEN_PER_KAART } from '../lib/spel.js'

const DREMPEL = 90 // pixels slepen voordat een keuze telt
const FLICK = 0.5 // px per ms: een snelle veeg telt ook als hij korter is...
const FLICK_MIN = 32 // ...maar wel minstens zo ver
const ENTREE = 380 // ms dat de kaart binnenschuift; de tijd loopt pas daarna
// Eerste kaart van de ronde: de kaart wiebelt even naar links, rechts en omhoog. [ms, x, y]
const WIEBEL = [
  [1400, -34, 0],
  [1900, 0, 0],
  [2300, 34, 0],
  [2800, 0, 0],
  [3200, 0, -34],
  [3700, 0, 0],
]

function richting(dx, dy, drempel) {
  if (-dy > drempel && -dy > Math.abs(dx) * 0.9) return 'samen'
  if (dx < -drempel) return 'mens'
  if (dx > drempel) return 'machine'
  return null
}

// Snelle veeg: niet de afstand telt, maar de snelheid van de laatste beweging.
function veeg(dx, dy, vx, vy) {
  if (-vy > FLICK && -dy > FLICK_MIN && -vy > Math.abs(vx)) return 'samen'
  if (Math.abs(vx) > FLICK && Math.abs(dx) > FLICK_MIN && Math.abs(vx) > Math.abs(vy) && Math.sign(vx) === Math.sign(dx)) {
    return vx < 0 ? 'mens' : 'machine'
  }
  return null
}

// Waar de kaart heen vliegt; d = draairichting (onderaan pakken draait andersom).
function wegTransform(weg, sleep, d) {
  if (weg === 'mens') return `translate(-150vw, ${sleep.y + 40}px) rotate(${-26 * d}deg)`
  if (weg === 'machine') return `translate(150vw, ${sleep.y + 40}px) rotate(${26 * d}deg)`
  if (weg === 'samen') return `translate(${sleep.x}px, -130vh)`
  return 'translate(0, 24px) scale(0.92)'
}

const KEUZES = [
  { keuze: 'mens', label: 'Mens', pijl: '←', woord: 'links', Icoon: IcoonMens },
  { keuze: 'samen', label: 'Samen', pijl: '↑', woord: 'omhoog', Icoon: IcoonSamen },
  { keuze: 'machine', label: 'Machine', pijl: '→', woord: 'rechts', Icoon: IcoonMachine },
]

export default function SwipeKaart({ kaart, onKeuze, nogTeGaan, eerste = false }) {
  const [sleep, setSleep] = useState({ x: 0, y: 0 })
  const [sleept, setSleept] = useState(false)
  const [draai, setDraai] = useState(1)
  const [weg, setWeg] = useState(null)
  const [rest, setRest] = useState(SECONDEN_PER_KAART)
  const start = useRef(null)
  const spoor = useRef([])
  const voorbij = useRef(null)
  const begin = useRef(performance.now() + ENTREE)
  const gekozen = useRef(false)
  const wiebel = useRef([])

  const stopWiebel = () => {
    wiebel.current.forEach(clearTimeout)
    wiebel.current = []
  }

  useEffect(() => {
    if (!eerste || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    wiebel.current = WIEBEL.map(([t, x, y]) => setTimeout(() => setSleep({ x, y }), t))
    return stopWiebel
  }, [eerste])

  const kies = useCallback(
    (keuze) => {
      if (gekozen.current) return
      gekozen.current = true
      const resterend = Math.min(SECONDEN_PER_KAART, Math.max(0, SECONDEN_PER_KAART - (performance.now() - begin.current) / 1000))
      navigator.vibrate?.(keuze ? 10 : [30, 40, 30])
      stopWiebel()
      setWeg(keuze ?? 'te_laat')
      setTimeout(() => onKeuze(keuze, resterend), keuze ? 260 : 600)
    },
    [onKeuze],
  )

  useEffect(() => {
    const id = setInterval(() => {
      const r = SECONDEN_PER_KAART - (performance.now() - begin.current) / 1000
      setRest(Math.min(SECONDEN_PER_KAART, Math.max(0, r)))
      if (r <= 0) {
        clearInterval(id)
        kies(null)
      }
    }, 100)
    return () => clearInterval(id)
  }, [kies])

  // pijltjestoetsen, handig bij testen op een laptop
  useEffect(() => {
    const toets = (e) => {
      const k = { ArrowLeft: 'mens', ArrowRight: 'machine', ArrowUp: 'samen' }[e.key]
      if (k) {
        e.preventDefault()
        kies(k)
      }
    }
    window.addEventListener('keydown', toets)
    return () => window.removeEventListener('keydown', toets)
  }, [kies])

  function omlaag(e) {
    if (gekozen.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const r = e.currentTarget.getBoundingClientRect()
    stopWiebel()
    // ga verder vanaf waar de kaart nu staat (hij kan net aan het wiebelen zijn)
    start.current = { x: e.clientX - sleep.x, y: e.clientY - sleep.y }
    spoor.current = [{ x: e.clientX, y: e.clientY, t: e.timeStamp }]
    voorbij.current = null
    setDraai(e.clientY > r.top + r.height / 2 ? -1 : 1)
    setSleept(true)
  }
  function beweeg(e) {
    if (!start.current) return
    const s = { x: e.clientX - start.current.x, y: Math.min(e.clientY - start.current.y, 60) }
    spoor.current = [...spoor.current.slice(-4), { x: e.clientX, y: e.clientY, t: e.timeStamp }]
    // een tikje als je over de drempel gaat (Android; iOS kan niet trillen)
    const k = richting(s.x, s.y, DREMPEL)
    if (k !== voorbij.current) {
      if (k) navigator.vibrate?.(6)
      voorbij.current = k
    }
    setSleep(s)
  }
  function los(e) {
    if (!start.current) return
    start.current = null
    setSleept(false)
    const a = spoor.current[0]
    const b = spoor.current[spoor.current.length - 1]
    const dt = Math.max(1, b.t - a.t)
    const stilGehouden = e.timeStamp - b.t > 90
    const keuze =
      richting(sleep.x, sleep.y, DREMPEL) ?? (stilGehouden ? null : veeg(sleep.x, sleep.y, (b.x - a.x) / dt, (b.y - a.y) / dt))
    if (keuze) kies(keuze)
    else setSleep({ x: 0, y: 0 })
  }

  const hint = weg && weg !== 'te_laat' ? weg : richting(sleep.x, sleep.y, 12)
  const sterkte = weg ? 1 : Math.min(1, Math.hypot(sleep.x, sleep.y) / DREMPEL)
  const transform = weg ? wegTransform(weg, sleep, draai) : `translate(${sleep.x}px, ${sleep.y}px) rotate(${sleep.x * 0.05 * draai}deg)`
  const bijna = rest <= 3 && !weg
  // de kaart eronder komt een beetje naar voren terwijl je sleept
  const naar = weg ? 0 : sterkte

  return (
    <div className="swipe">
      <div className="kaart-plek">
        {nogTeGaan > 1 && <div className="stapel-kaart stapel-2" aria-hidden="true" />}
        {nogTeGaan > 0 && (
          <div
            className="stapel-kaart stapel-1"
            aria-hidden="true"
            style={{ transform: `translateY(${10 - 6 * naar}px) scale(${0.95 + 0.03 * naar})` }}
          />
        )}
        <div
          className={`kaart ${hint ? `is-${hint}` : ''} ${sleept ? 'is-sleept' : ''} ${weg ? `is-weg weg-${weg}` : ''}`}
          style={{ transform, '--sterkte': sterkte }}
          onPointerDown={omlaag}
          onPointerMove={beweeg}
          onPointerUp={los}
          onPointerCancel={los}
        >
          <div className="kaart-media">
            <Media media={kaart.media[0]} alt={kaart.titel} />
            <div className="kaart-tint" />
          </div>
          <div className="kaart-voet">
            <div className={`kaart-tijd ${bijna ? 'is-bijna' : ''}`} aria-hidden="true">
              <i
                style={{
                  animationDuration: `${SECONDEN_PER_KAART}s`,
                  animationDelay: `${ENTREE}ms`,
                  animationPlayState: weg ? 'paused' : 'running',
                }}
              />
            </div>
            <div className="kaart-kop">
              <h2 className="kaart-titel">{kaart.titel}</h2>
              <span className={`kaart-teller t-num ${bijna ? 'is-bijna' : ''}`} aria-label={`${Math.ceil(rest)} seconden`}>
                <IcoonKlok grootte={14} />
                {Math.ceil(rest)}
              </span>
            </div>
            <p className="kaart-vraag">{kaart.vraag ?? 'Wie maakte dit?'}</p>
          </div>

          {KEUZES.map(({ keuze, label, Icoon }) => (
            <span key={keuze} className={`stempel is-${keuze}`} style={{ opacity: hint === keuze ? sterkte : 0 }}>
              <Icoon grootte={16} /> {label}
            </span>
          ))}
          <span className="stempel is-te-laat" style={{ opacity: weg === 'te_laat' ? 1 : 0 }}>
            Te laat
          </span>
        </div>
      </div>

      {/* Swipen is de hoofdzaak; tikken blijft kunnen voor wie niet kan of wil slepen. */}
      <div className="richtingen" role="group" aria-label="Swipe de kaart of kies hier wie het maakte">
        {KEUZES.map(({ keuze, label, pijl, woord, Icoon }) => (
          <button
            key={keuze}
            className={`richting is-${keuze} ${hint === keuze ? 'is-hint' : ''}`}
            onClick={() => kies(keuze)}
            aria-label={`${label} (swipe naar ${woord})`}
          >
            {keuze !== 'machine' && <span className="richting-pijl">{pijl}</span>}
            <Icoon grootte={14} />
            {label}
            {keuze === 'machine' && <span className="richting-pijl">{pijl}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

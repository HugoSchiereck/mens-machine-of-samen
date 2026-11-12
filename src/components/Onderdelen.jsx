// Gedeelde onderdelen van het ontwerpsysteem. Schermen bouwen hiermee, niet met losse stijlen.
import { createContext, useContext, useEffect, useState } from 'react'
import { HuLogo, IcoonChevron, IcoonKoffer, IcoonMachine, IcoonMens, IcoonTerug, KEUZE_ICOON } from './Iconen.jsx'
import { BAAN_PER_ID, KEUZES, salarisTekst } from '../lib/spel.js'

// 1–5-schaal: voor de angstmeting en voor "hoe leuk vind je dit onderwerp?".
export function Schaal({ waarde = null, onKies, uitersten = ['Helemaal niet', 'Heel erg'], compact = false, label }) {
  const [gekozen, setGekozen] = useState(waarde)
  function kies(n) {
    setGekozen(n)
    navigator.vibrate?.(8)
    setTimeout(() => onKies(n), 180)
  }
  return (
    <div className={`schaal ${compact ? 'schaal-compact' : ''}`}>
      <div className="schaal-rij" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} role="radio" aria-checked={gekozen === n} className={`schaal-knop t-num ${gekozen === n ? 'is-gekozen' : ''}`} onClick={() => kies(n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="schaal-uitersten">
        <span>{uitersten[0]}</span>
        <span>{uitersten[1]}</span>
      </div>
    </div>
  )
}

export function AntwoordTag({ antwoord, groot = false }) {
  const Icoon = KEUZE_ICOON[antwoord]
  return (
    <span className={`tag tag-${antwoord} ${groot ? 'tag-lg' : ''}`}>
      <Icoon grootte={groot ? 14 : 12} />
      {KEUZES[antwoord].label}
    </span>
  )
}

export function Kop({ onTerug, titel, sub, rechts }) {
  return (
    <header className="kopbalk">
      {onTerug && (
        <button className="terugknop" onClick={onTerug} aria-label="Terug">
          <IcoonTerug />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub && <div className="t-eyebrow">{sub}</div>}
        {titel && <div className="t-h3">{titel}</div>}
      </div>
      {rechts ?? <HuLogo klein hoogte={22} />}
    </header>
  )
}

// ---------- banen ----------

export const BaanContext = createContext({ open: () => {}, matchPer: {} })
export const useBanen = () => useContext(BaanContext)

export function BaanRij({ id }) {
  const { open, matchPer } = useBanen()
  const baan = BAAN_PER_ID[id]
  if (!baan) return null
  const pct = matchPer?.[id]
  return (
    <button className="rij" onClick={() => open(id)}>
      <span className="rij-icoon">
        <IcoonKoffer />
      </span>
      <span className="rij-tekst">
        <b>{baan.titel}</b>
        <span>{baan.wat}</span>
      </span>
      {pct != null ? <span className="rij-rechts t-num">{pct}%</span> : <span className="rij-chevron"><IcoonChevron /></span>}
    </button>
  )
}

export function AiJij({ baan }) {
  return (
    <div className="ai-jij">
      <div className="is-ai">
        <IcoonMachine grootte={16} />
        <b>Wat AI al doet</b>
        <p>{baan.aiDoet}</p>
      </div>
      <div className="is-mens">
        <IcoonMens grootte={16} />
        <b>Wat jij blijft doen</b>
        <p>{baan.jijDoet}</p>
      </div>
    </div>
  )
}

export function BaanFeiten({ baan }) {
  const salaris = salarisTekst(baan)
  const s = baan.startsalaris
  return (
    <>
      <div className="feitje">
        <span>Startsalaris</span>
        {salaris ? (
          <b>
            {salaris}
            {(s.niveau || s.bron) && (
              <span className="vak">
                {[s.niveau, s.bron, s.jaar ?? s.geraadpleegd].filter(Boolean).join(' · ')}
              </span>
            )}
          </b>
        ) : s?.opmerking ? (
          <b>{s.opmerking}</b>
        ) : (
          <b className="is-leeg">Nog in te vullen</b>
        )}
      </div>
      <div className="feitje">
        <span>Leer je bij</span>
        <span className="tags" style={{ justifyContent: 'flex-end' }}>
          {baan.vakken.map((v) => (
            <span key={v} className="tag">
              {v}
            </span>
          ))}
        </span>
      </div>
    </>
  )
}

export function BaanSheet({ id, onSluit }) {
  const { matchPer } = useBanen()
  const baan = BAAN_PER_ID[id]
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onSluit()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onSluit])
  if (!baan) return null
  const pct = matchPer?.[id]
  return (
    <div className="sheet-achter" onClick={onSluit}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={baan.titel} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-greep" />
        <div className="sectie" style={{ gap: 'var(--s-4)' }}>
          <div className="baan-kop">
            <div className="sectie" style={{ gap: 'var(--s-1)' }}>
              <span className="t-eyebrow">ICT-baan</span>
              <h2 className="t-h1" style={{ fontSize: 'var(--fs-2xl)' }}>
                {baan.titel}
              </h2>
            </div>
            {pct != null && <span className="tag tag-ink tag-lg t-num">{pct}% match</span>}
          </div>
          <p className="t-body">{baan.wat}</p>
          <AiJij baan={baan} />
          <p className="t-small">Past bij je als: {baan.pastBij.charAt(0).toLowerCase() + baan.pastBij.slice(1)}</p>
          <BaanFeiten baan={baan} />
          <button className="btn btn-secondary btn-block" onClick={onSluit}>
            Sluiten
          </button>
        </div>
      </div>
    </div>
  )
}

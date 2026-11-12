import { useEffect, useRef, useState } from 'react'
import { Media } from '../components/Media.jsx'
import { IcoonKruis, Merk } from '../components/Iconen.jsx'
import { BaanRij, Schaal } from '../components/Onderdelen.jsx'
import { BONUS, ONDERWERPEN, PUNTEN_PER_FOUT, onderwerpInZin, welkeFout } from '../lib/spel.js'

// Een gevonden of gemiste fout als ring op het podium.
export function FoutRing({ fout, nr, status }) {
  return (
    <span className={`foutring is-${status}`} style={{ left: `${fout.x * 100}%`, top: `${fout.y * 100}%`, width: `${fout.straal * 2 * 100}%` }}>
      <b>{nr}</b>
    </span>
  )
}

export function FoutenLijst({ fouten, gevonden, vakLabel = '' }) {
  return (
    <ol className="fouten">
      {fouten.map((f, i) => (
        <li key={i} className={`fout-rij ${gevonden[i] ? 'is-gevonden' : 'is-gemist'}`} style={{ animationDelay: `${i * 50}ms` }}>
          <b className="fout-nr">{i + 1}</b>
          <span>
            {f.uitleg}
            <span className="vak">
              {vakLabel}
              {f.vak}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}

export default function VindDeFout({ onKlaar, onLeuk }) {
  const [gestart, setGestart] = useState(false)
  const [gevonden, setGevonden] = useState([])
  const [missers, setMissers] = useState([])
  const [klaar, setKlaar] = useState(false)
  const [rest, setRest] = useState(BONUS.seconden)
  const begin = useRef(0)
  const fouten = BONUS.fouten
  const onderwerp = ONDERWERPEN[BONUS.onderwerp] ?? BONUS.onderwerp
  const onderwerpZin = onderwerpInZin(BONUS.onderwerp)

  useEffect(() => {
    if (!gestart || klaar) return
    begin.current = performance.now()
    const id = setInterval(() => {
      const r = BONUS.seconden - (performance.now() - begin.current) / 1000
      setRest(Math.max(0, r))
      if (r <= 0) setKlaar(true)
    }, 200)
    return () => clearInterval(id)
  }, [gestart, klaar])

  function tik(p) {
    if (!gestart || klaar) return
    const i = welkeFout(p, fouten, 1.15)
    if (i >= 0 && !gevonden.includes(i)) {
      navigator.vibrate?.(12)
      const nieuw = [...gevonden, i]
      setGevonden(nieuw)
      if (nieuw.length === fouten.length) setTimeout(() => setKlaar(true), 400)
    } else if (i < 0) {
      const m = { ...p, id: Math.random() }
      setMissers((ms) => [...ms, m])
      setTimeout(() => setMissers((ms) => ms.filter((x) => x.id !== m.id)), 600)
    }
  }

  const punten = gevonden.length * PUNTEN_PER_FOUT
  const resultaat = { gevonden: gevonden.length, punten }

  return (
    <div className="pagina">
      <div className="kopbalk">
        <Merk />
      </div>
      <div className="sectie" style={{ gap: 'var(--s-3)' }}>
        <span className="tag tag-samen" style={{ alignSelf: 'flex-start' }}>
          Bonuskaart
        </span>
        <h1 className="t-h1">Vind de fouten</h1>
        <p className="t-small">{BONUS.intro}</p>
        <div className="bonus-status">
          <span className="t-h2 t-num">
            {gevonden.length}/{fouten.length}
          </span>
          {klaar ? (
            <span className="t-h3 t-num" style={{ marginLeft: 'auto' }}>
              +{punten} pt
            </span>
          ) : (
            <span className="balk" aria-label={`${Math.ceil(rest)} seconden over`}>
              <i style={{ width: `${(rest / BONUS.seconden) * 100}%` }} />
            </span>
          )}
        </div>
      </div>

      <div className="media-kaart bonus-media">
        <Media media={BONUS.media[0]} onTik={tik} alt={BONUS.titel}>
          {fouten.map((f, i) => {
            if (gevonden.includes(i)) return <FoutRing key={i} fout={f} nr={i + 1} status="gevonden" />
            if (klaar) return <FoutRing key={i} fout={f} nr={i + 1} status="gemist" />
            return null
          })}
          {missers.map((m) => (
            <span key={m.id} className="misser" style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}>
              <IcoonKruis grootte={22} />
            </span>
          ))}
          {!gestart && (
            <div className="bonus-start">
              <button className="btn btn-primary" onClick={() => setGestart(true)}>
                Start · {BONUS.seconden} seconden
              </button>
            </div>
          )}
        </Media>
      </div>

      {klaar && (
        <>
          <FoutenLijst fouten={fouten} gevonden={fouten.map((_, i) => gevonden.includes(i))} />
          {BONUS.banen?.length > 0 && (
            <section className="sectie">
              <h3 className="t-h3">Banen achter deze kaart</h3>
              <div className="rijen">
                {BONUS.banen.map((id) => (
                  <BaanRij key={id} id={id} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="onderbalk">
        {klaar ? (
          <div className="beoordeel">
            <div className="beoordeel-vraag">
              <span>Hoe leuk vind je {onderwerpZin}?</span>
              <button className="btn btn-ghost" onClick={() => onKlaar(resultaat)}>
                Overslaan
              </button>
            </div>
            <Schaal
              compact
              uitersten={['Niks voor mij', 'Wil ik meer van']}
              label={`Hoe leuk vind je ${onderwerp}?`}
              onKies={(waarde) => {
                onLeuk(waarde)
                onKlaar(resultaat)
              }}
            />
          </div>
        ) : (
          gestart && (
            <button className="btn btn-secondary btn-block" onClick={() => setKlaar(true)}>
              Ik ben klaar
            </button>
          )
        )}
      </div>
    </div>
  )
}

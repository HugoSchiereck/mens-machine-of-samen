import { useEffect, useRef, useState } from 'react'
import { Media } from '../components/Media.jsx'
import { IcoonCheck, IcoonKruis } from '../components/Iconen.jsx'
import { Kop } from '../components/Onderdelen.jsx'
import { FoutRing, FoutenLijst } from './VindDeFout.jsx'
import { PUNTEN_PER_OVERLAP, raakt } from '../lib/spel.js'
import { stuur } from '../lib/api.js'

const STAP_NAMEN = { prompt: 'Prompt', blik: 'Jouw blik', schuif: 'Voor en na', duel: 'Promptduel' }

function Prompt({ m, onVerder }) {
  return (
    <>
      <h2 className="t-h1">Dit vroeg de student aan AI</h2>
      <div className="prompt">
        <span className="prompt-wie">{m.maker}</span>
        <p className="prompt-tekst">{m.prompt}</p>
        {m.promptIsVoorbeeld && <span className="prompt-noot">Voorbeeldprompt, wordt vervangen door de echte</span>}
      </div>
      <div className="sectie" style={{ gap: 'var(--s-2)' }}>
        <span className="t-eyebrow">AI maakte dit</span>
        <div className="ai-antwoord">
          <Media media={m.aiVersie} />
        </div>
      </div>
      <div className="onderbalk">
        <button className="btn btn-primary btn-block" onClick={onVerder}>
          Wat zou jij aanpassen?
        </button>
      </div>
    </>
  )
}

function Blik({ m, onPunten, onVerder }) {
  const [tikken, setTikken] = useState([])
  const [klaar, setKlaar] = useState(false)
  const max = m.fouten.length + 2

  function tik(p) {
    if (klaar) return
    const dichtbij = tikken.findIndex((t) => Math.hypot((t.x - p.x) * 360, (t.y - p.y) * 480) < 22)
    if (dichtbij >= 0) setTikken(tikken.filter((_, i) => i !== dichtbij))
    else if (tikken.length < max) setTikken([...tikken, p])
  }

  const overlap = m.fouten.map((f) => tikken.some((t) => [f, ...(f.extra ?? [])].some((plek) => raakt(t, plek, 1.3))))
  const aantal = overlap.filter(Boolean).length

  return (
    <>
      <div className="sectie" style={{ gap: 'var(--s-2)' }}>
        <h2 className="t-h1">{klaar ? 'Dit zag de ICT’er' : 'Wat zou jij aanpassen?'}</h2>
        <p className="t-small">
          {klaar
            ? `Jij zag er ${aantal} van de ${m.fouten.length}.${aantal ? ` +${aantal * PUNTEN_PER_OVERLAP} punten.` : ''} In de opleiding leer je ze allemaal te zien.`
            : `Dit is de eerste AI-versie. Tik aan wat jij fout vindt. Nog een keer tikken haalt een stip weg.`}
        </p>
      </div>
      <div className="media-kaart">
        <Media media={m.aiVersie} onTik={tik}>
          {tikken.map((t, i) => (
            <span key={i} className="tikstip" style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }} />
          ))}
          {klaar && m.fouten.map((f, i) => <FoutRing key={i} fout={f} nr={i + 1} status={overlap[i] ? 'gevonden' : 'gemist'} />)}
        </Media>
      </div>
      {klaar && <FoutenLijst fouten={m.fouten} gevonden={overlap} vakLabel="Leer je bij: " />}
      <div className="onderbalk">
        {klaar ? (
          <button className="btn btn-primary btn-block" onClick={onVerder}>
            Bekijk voor en na
          </button>
        ) : (
          <button
            className="btn btn-primary btn-block"
            disabled={tikken.length === 0}
            onClick={() => {
              setKlaar(true)
              onPunten(aantal * PUNTEN_PER_OVERLAP)
            }}
          >
            Laat zien wat de ICT’er zag
          </button>
        )}
      </div>
    </>
  )
}

function Schuifbalk({ voor, na }) {
  const [pos, setPos] = useState(50)
  const ref = useRef(null)
  const sleept = useRef(false)

  // Kort heen en weer bij binnenkomst, zodat je ziet dat je kunt slepen.
  useEffect(() => {
    const timers = [36, 64, 50].map((p, i) => setTimeout(() => !sleept.current && setPos(p), 500 + i * 420))
    return () => timers.forEach(clearTimeout)
  }, [])

  function zet(e) {
    const r = ref.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)))
  }

  return (
    <div
      ref={ref}
      className="schuif"
      style={{ '--pos': `${pos}%` }}
      onPointerDown={(e) => {
        sleept.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        zet(e)
      }}
      onPointerMove={(e) => sleept.current && e.buttons && zet(e)}
      onPointerUp={() => (sleept.current = false)}
    >
      <Media media={na} />
      <div className="schuif-voor">
        <Media media={voor} />
      </div>
      <span className="schuif-label schuif-label-voor tag tag-machine">AI-versie</span>
      <span className="schuif-label schuif-label-na tag tag-mens">Eindversie</span>
      <span
        className="schuif-greep"
        role="slider"
        tabIndex={0}
        aria-label="Schuif tussen AI-versie en eindversie"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5))
          if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5))
        }}
      >
        <i>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </i>
      </span>
    </div>
  )
}

function VoorNa({ m, onVerder, laatste }) {
  return (
    <>
      <div className="sectie" style={{ gap: 'var(--s-2)' }}>
        <h2 className="t-h1">Van AI-versie naar eindversie</h2>
        <p className="t-small">Sleep de balk. Bij elke wijziging: wat, waarom en in welk vak je dat leert.</p>
      </div>
      <div className="media-kaart">
        <Schuifbalk voor={m.aiVersie} na={m.eindVersie} />
      </div>
      <ol className="sectie" style={{ gap: 'var(--s-2)' }}>
        {m.wijzigingen.map((w, i) => (
          <li key={i} className="wijziging">
            <b className="wijziging-nr t-num">{i + 1}</b>
            <div>
              <b>{w.wat}</b>
              <p>{w.waarom}</p>
              <span className="vak">Leer je bij: {w.vak}</span>
            </div>
          </li>
        ))}
      </ol>
      <div className="onderbalk">
        <button className="btn btn-primary btn-block" onClick={onVerder}>
          {laatste ? 'Terug naar je score' : 'Naar het promptduel'}
        </button>
      </div>
    </>
  )
}

const CHECK_LABELS = { werkt: 'Werkt', veilig: 'Veilig', leesbaar: 'Leesbaar' }

function Duel({ m, onVerder }) {
  const [gekozen, setGekozen] = useState(0)
  const d = m.promptDuel[gekozen]
  return (
    <>
      <div className="sectie" style={{ gap: 'var(--s-2)' }}>
        <h2 className="t-h1">Promptduel</h2>
        <p className="t-small">Dezelfde opdracht, drie prompts. Welke levert het meeste op?</p>
      </div>
      <div className="seg" role="tablist">
        {m.promptDuel.map((p, i) => (
          <button key={p.niveau} role="tab" aria-selected={i === gekozen} onClick={() => setGekozen(i)}>
            {p.niveau}
          </button>
        ))}
      </div>
      <div className="duel-kaart" key={gekozen}>
        <p className="prompt-tekst">{d.prompt}</p>
        <p className="t-body">{d.resultaat}</p>
        {d.checks && (
          <div className="tags">
            {Object.entries(d.checks).map(([k, ok]) => (
              <span key={k} className={`tag ${ok ? 'tag-ink' : 'tag-fout'}`}>
                {ok ? <IcoonCheck grootte={12} /> : <IcoonKruis grootte={12} />}
                {CHECK_LABELS[k] ?? k}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="t-h2">Kennis geeft betere prompts. Dat leer je hier.</p>
      <div className="onderbalk">
        <button className="btn btn-primary btn-block" onClick={onVerder}>
          Terug naar je score
        </button>
      </div>
    </>
  )
}

export default function MakingOf({ kaart, spelerId, onTerug }) {
  const m = kaart.makingOf
  const stappen = ['prompt', 'blik', 'schuif', ...(m.promptDuel?.length ? ['duel'] : [])]
  const [stap, setStap] = useState(0)
  const [punten, setPunten] = useState(0)

  useEffect(() => {
    stuur({ type: 'makingof', spelerId, kaartId: kaart.id })
  }, [kaart.id, spelerId])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stap])

  const verder = () => (stap + 1 < stappen.length ? setStap(stap + 1) : onTerug(punten))
  const huidig = stappen[stap]

  return (
    <div className="pagina" key={huidig}>
      <Kop onTerug={() => onTerug(punten)} sub="Making-of" titel={kaart.titel} />
      <ol className="stappen">
        {stappen.map((s, i) => (
          <li key={s} className={i === stap ? 'is-nu' : i < stap ? 'is-klaar' : ''}>
            <span>{i < stap ? <IcoonCheck grootte={11} /> : i + 1}</span> {STAP_NAMEN[s]}
          </li>
        ))}
      </ol>
      {huidig === 'prompt' && <Prompt m={m} onVerder={verder} />}
      {huidig === 'blik' && <Blik m={m} onPunten={setPunten} onVerder={verder} />}
      {huidig === 'schuif' && <VoorNa m={m} onVerder={verder} laatste={stap === stappen.length - 1} />}
      {huidig === 'duel' && <Duel m={m} onVerder={verder} />}
    </div>
  )
}

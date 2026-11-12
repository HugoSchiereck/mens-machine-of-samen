import { useCallback, useState } from 'react'
import SwipeKaart from './SwipeKaart.jsx'
import Onthulling from './Onthulling.jsx'
import { HuLogo, IcoonVlam } from '../components/Iconen.jsx'
import { puntenVoorKaart } from '../lib/spel.js'
import { groepsStem, stuur } from '../lib/api.js'
import { useOptellen } from './hooks.js'

const UITGANG = 280 // ms: zo lang schuift de onthulling weg (gelijk aan .onthulling.is-weg)

function Rondebalk({ kaarten, i, antwoorden, score, reeks }) {
  const getoond = useOptellen(score, 500)
  return (
    <header className="rondebalk">
      <ol className="voortgang" aria-label={`Kaart ${i + 1} van ${kaarten.length}`}>
        {kaarten.map((k, n) => {
          const a = antwoorden[n]
          return <li key={k.id} className={a ? (a.goed ? 'is-goed' : 'is-mis') : n === i ? 'is-nu' : ''} />
        })}
      </ol>
      <div className="rondebalk-rij">
        <HuLogo klein hoogte={18} />
        <span className="t-eyebrow t-num">
          Kaart {i + 1} van {kaarten.length}
        </span>
        <span className={`reeks t-num ${reeks >= 2 ? 'is-aan' : ''}`} aria-label={`${reeks} goed op rij`}>
          <IcoonVlam grootte={13} /> {reeks}
        </span>
        <span className="rondebalk-score t-num">
          {getoond}
          <small>pt</small>
        </span>
      </div>
    </header>
  )
}

export default function Ronde({ kaarten, stats, spelerId, onKlaar }) {
  const [i, setI] = useState(0)
  const [fase, setFase] = useState('kaart')
  const [antwoorden, setAntwoorden] = useState([])
  const [beoordelingen, setBeoordelingen] = useState({})
  const [score, setScore] = useState(0)
  const [reeks, setReeks] = useState(0)
  const [besteReeks, setBesteReeks] = useState(0)
  const [weg, setWeg] = useState(false)
  const kaart = kaarten[i]

  const kies = useCallback(
    (keuze, resterend) => {
      const goed = keuze === kaart.antwoord
      const nieuweReeks = goed ? reeks + 1 : 0
      const punten = puntenVoorKaart({ goed, resterend, reeks: nieuweReeks })
      setReeks(nieuweReeks)
      setBesteReeks((b) => Math.max(b, nieuweReeks))
      setScore((s) => s + punten.totaal)
      setAntwoorden((a) => [...a, { kaartId: kaart.id, keuze, goed, punten, resterend }])
      stuur({ type: 'stem', spelerId, kaartId: kaart.id, keuze, goed })
      setFase('onthulling')
      window.scrollTo(0, 0)
    },
    [kaart, reeks, spelerId],
  )

  function volgende(waarde) {
    if (weg) return
    const nieuw = waarde ? { ...beoordelingen, [kaart.id]: waarde } : beoordelingen
    if (waarde) {
      setBeoordelingen(nieuw)
      stuur({ type: 'leuk', spelerId, kaartId: kaart.id, onderwerp: kaart.onderwerp, waarde })
    }
    // Eerst schuift de onthulling naar links weg, daarna komt de volgende kaart van rechts.
    setWeg(true)
    setTimeout(() => {
      if (i + 1 >= kaarten.length) {
        onKlaar({ antwoorden, score, besteReeks, beoordelingen: nieuw })
        return
      }
      setI(i + 1)
      setFase('kaart')
      setWeg(false)
      window.scrollTo(0, 0)
    }, UITGANG)
  }

  return (
    <div className="ronde">
      <Rondebalk kaarten={kaarten} i={i} antwoorden={antwoorden} score={score} reeks={reeks} />
      {fase === 'kaart' ? (
        <SwipeKaart key={kaart.id} kaart={kaart} onKeuze={kies} nogTeGaan={kaarten.length - i - 1} eerste={i === 0} />
      ) : (
        <Onthulling
          key={`o-${kaart.id}`}
          kaart={kaart}
          antwoord={antwoorden[antwoorden.length - 1]}
          groep={groepsStem(stats, kaart.id)}
          laatste={i + 1 >= kaarten.length}
          weg={weg}
          onVolgende={volgende}
        />
      )}
    </div>
  )
}

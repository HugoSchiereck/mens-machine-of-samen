import { useMemo, useState } from 'react'
import Lobby, { Uitleg, WelkomTerug } from './Lobby.jsx'
import Ronde from './Ronde.jsx'
import VindDeFout from './VindDeFout.jsx'
import Match from './Match.jsx'
import Eind from './Eind.jsx'
import MakingOf from './MakingOf.jsx'
import Toekomst from './Toekomst.jsx'
import { BaanContext, BaanSheet, Schaal } from '../components/Onderdelen.jsx'
import { Merk } from '../components/Iconen.jsx'
import { bewaarProfiel, haalStats, laadProfiel, stuur, uid } from '../lib/api.js'
import { BONUS, KAART_PER_ID, berekenMatch, maakRonde } from '../lib/spel.js'
import '../styles/telefoon.css'

// Schermen: lobby → uitleg → ronde (8 kaarten) → bonus → meting → match → eind ⇄ making-of / toekomst
export default function TelefoonApp() {
  const [profiel, setProfiel] = useState(laadProfiel)
  const [scherm, setScherm] = useState(profiel ? 'terug' : 'lobby')
  const [vorige, setVorige] = useState('eind')
  const [ronde, setRonde] = useState(null)
  const [stats, setStats] = useState(null)
  const [makingOfId, setMakingOfId] = useState(null)
  const [baanId, setBaanId] = useState(null)

  // Beoordelingen tellen over alle rondes heen: hoe meer je speelt, hoe beter je match.
  const matches = useMemo(() => berekenMatch(profiel?.beoordelingen ?? {}), [profiel?.beoordelingen])
  const banen = useMemo(
    () => ({ open: setBaanId, matchPer: Object.fromEntries(matches.map((m) => [m.baan.id, m.pct])) }),
    [matches],
  )

  function updateProfiel(wijziging) {
    setProfiel((p) => {
      const nieuw = { ...p, ...wijziging }
      bewaarProfiel(nieuw)
      return nieuw
    })
  }

  function aanmelden(p) {
    bewaarProfiel(p)
    setProfiel(p)
    stuur({ type: 'join', spelerId: p.id, bijnaam: p.bijnaam, rol: p.rol, hobby: p.hobby, angstVoor: p.angstVoor })
    setScherm('uitleg')
  }

  function startRonde() {
    const kaarten = maakRonde({ hobby: profiel.hobby, gezien: profiel.gezien ?? [] })
    setRonde({ id: uid(), kaarten, resultaat: null, bonus: null, makingOfPunten: 0, makingOfGedaan: {} })
    setScherm('ronde')
    haalStats().then(setStats)
    window.scrollTo(0, 0)
  }

  function naar(s) {
    setScherm(s)
    window.scrollTo(0, 0)
  }

  function naRonde() {
    if (!profiel.angstNa) return naar('meting')
    naar(berekenMatch(profiel.beoordelingen ?? {}).length ? 'match' : 'eind')
  }

  function beoordeel(kaartId, waarde) {
    updateProfiel({ beoordelingen: { ...(profiel.beoordelingen ?? {}), [kaartId]: waarde } })
  }

  let inhoud
  switch (scherm) {
    case 'lobby':
      inhoud = <Lobby onKlaar={aanmelden} />
      break
    case 'terug':
      inhoud = (
        <WelkomTerug
          profiel={profiel}
          onSpelen={() => {
            // Opnieuw aanmelden: de server kan herstart zijn of het is een nieuwe dag.
            stuur({ type: 'join', spelerId: profiel.id, bijnaam: profiel.bijnaam, rol: profiel.rol, hobby: profiel.hobby, angstVoor: profiel.angstVoor })
            startRonde()
          }}
          onAnder={() => {
            bewaarProfiel(null)
            setProfiel(null)
            naar('lobby')
          }}
        />
      )
      break
    case 'uitleg':
      inhoud = <Uitleg onStart={startRonde} />
      break
    case 'ronde':
      inhoud = (
        <Ronde
          key={ronde.id}
          kaarten={ronde.kaarten}
          stats={stats}
          spelerId={profiel.id}
          onKlaar={(resultaat) => {
            setRonde((r) => ({ ...r, resultaat }))
            updateProfiel({
              gezien: [...new Set([...(profiel.gezien ?? []), ...ronde.kaarten.map((k) => k.id)])],
              beoordelingen: { ...(profiel.beoordelingen ?? {}), ...resultaat.beoordelingen },
            })
            naar('bonus')
          }}
        />
      )
      break
    case 'bonus':
      inhoud = (
        <VindDeFout
          onLeuk={(waarde) => {
            beoordeel(BONUS.id, waarde)
            stuur({ type: 'leuk', spelerId: profiel.id, kaartId: BONUS.id, onderwerp: BONUS.onderwerp, waarde })
          }}
          onKlaar={(bonus) => {
            setRonde((r) => ({ ...r, bonus }))
            // profiel wordt asynchroon bijgewerkt; wacht één tik zodat de match de bonus meeneemt
            setTimeout(naRonde, 0)
          }}
        />
      )
      break
    case 'meting':
      inhoud = (
        <div className="pagina">
          <div className="kopbalk">
            <Merk />
          </div>
          <div className="sectie" style={{ gap: 'var(--s-2)', marginTop: 'var(--s-6)' }}>
            <span className="t-eyebrow">Nog één vraag</span>
            <h1 className="t-h1">En nu? Hoe bang ben je dat AI banen in de ICT overneemt?</h1>
          </div>
          <Schaal
            label="Hoe bang ben je nu dat AI banen in de ICT overneemt?"
            onKies={(angstNa) => {
              updateProfiel({ angstNa })
              naar(matches.length ? 'match' : 'eind')
            }}
          />
        </div>
      )
      break
    case 'match':
      inhoud = (
        <Match
          matches={matches}
          onVerder={() => naar('eind')}
          onToekomst={() => {
            setVorige('match')
            naar('toekomst')
          }}
        />
      )
      break
    case 'eind':
      inhoud = (
        <Eind
          profiel={profiel}
          ronde={ronde}
          matches={matches}
          onMakingOf={(id) => {
            setMakingOfId(id)
            naar('makingof')
          }}
          onToekomst={() => {
            setVorige('eind')
            naar('toekomst')
          }}
          onOpnieuw={startRonde}
        />
      )
      break
    case 'makingof':
      inhoud = (
        <MakingOf
          kaart={KAART_PER_ID[makingOfId]}
          spelerId={profiel.id}
          onTerug={(punten) => {
            // Punten voor 'wat zou jij aanpassen' tellen één keer per kaart.
            setRonde((r) =>
              r.makingOfGedaan[makingOfId] != null || punten === 0
                ? r
                : { ...r, makingOfPunten: r.makingOfPunten + punten, makingOfGedaan: { ...r.makingOfGedaan, [makingOfId]: punten } },
            )
            naar('eind')
          }}
        />
      )
      break
    case 'toekomst':
      inhoud = <Toekomst onTerug={() => naar(vorige)} />
      break
    default:
      inhoud = null
  }

  return (
    <BaanContext.Provider value={banen}>
      <main className="app">{inhoud}</main>
      {baanId && <BaanSheet id={baanId} onSluit={() => setBaanId(null)} />}
    </BaanContext.Provider>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Media } from '../components/Media.jsx'
import { IcoonChevron, IcoonVlam, Merk } from '../components/Iconen.jsx'
import { BaanRij } from '../components/Onderdelen.jsx'
import { berekenRadar, CATEGORIEEN, KAART_PER_ID, radarZin } from '../lib/spel.js'
import { haalStats, stuur } from '../lib/api.js'
import { useOptellenVanafNul } from './hooks.js'

// AI-radar: de stippellijn is "precies goed". Erbuiten = je overschat AI, erbinnen = je onderschat AI.
export function AiRadar({ radar }) {
  const cats = Object.keys(CATEGORIEEN)
  const C = 120
  const R = 90
  const ring = R * 0.55
  const punt = (i, r) => {
    const hoek = (Math.PI * 2 * i) / cats.length - Math.PI / 2
    return [C + Math.cos(hoek) * r, C + Math.sin(hoek) * r]
  }
  const straal = (cat) => {
    const r = radar[cat]
    if (!r?.n) return ring
    const gem = r.som / r.n // -2 .. 2
    return gem > 0 ? ring + (gem / 2) * (R - ring) : ring + (gem / 2) * ring
  }
  const vorm = cats.map((c, i) => punt(i, straal(c)).join(',')).join(' ')

  return (
    <svg className="radar" viewBox="-56 -8 352 256" role="img" aria-label="AI-radar per categorie">
      <circle cx={C} cy={C} r={R} className="radar-buiten" />
      <circle cx={C} cy={C} r={ring} className="radar-ring" />
      {cats.map((c, i) => {
        const [x, y] = punt(i, R)
        return <line key={c} x1={C} y1={C} x2={x} y2={y} className="radar-as" />
      })}
      <polygon points={vorm} className="radar-vorm" />
      {cats.map((c, i) => {
        const r = radar[c]
        const gespeeld = r?.n > 0
        const [x, y] = punt(i, straal(c))
        const [lx, ly] = punt(i, R + 14)
        const soort = !gespeeld ? 'is-leeg' : r.som > 0 ? 'is-over' : r.som < 0 ? 'is-onder' : ''
        return (
          <g key={c}>
            <circle cx={x} cy={y} r={gespeeld ? 5 : 3} className={`radar-punt ${soort}`} />
            <text x={lx} y={ly} className={`radar-label ${gespeeld ? '' : 'is-leeg'}`} textAnchor={lx < C - 10 ? 'end' : lx > C + 10 ? 'start' : 'middle'} dominantBaseline="middle">
              {CATEGORIEEN[c].label}
            </text>
          </g>
        )
      })}
      <text x={C} y={C - ring + 11} className="radar-ringtekst" textAnchor="middle">
        precies goed
      </text>
    </svg>
  )
}

function Ranglijst({ stats, spelerId, score, bijnaam }) {
  if (!stats) {
    return (
      <section className="sectie">
        <h3 className="t-h3">Ranglijst van vandaag</h3>
        <p className="t-small">Geen verbinding. Je score komt op de ranglijst zodra de wifi het weer doet.</p>
      </section>
    )
  }
  const top = stats.ranglijst.slice(0, 5)
  const ikInTop = top.some((r) => r.id === spelerId)
  const { scholier, ouder } = stats.ouderVsKind
  const som = (scholier.gem ?? 0) + (ouder.gem ?? 0)
  return (
    <section className="sectie">
      <h3 className="t-h3">Ranglijst van vandaag</h3>
      <ol className="ranglijst">
        {top.map((r, n) => (
          <li key={r.id} className={r.id === spelerId ? 'is-ik' : ''}>
            <span className="ranglijst-nr t-num">{n + 1}</span>
            <span className="ranglijst-naam">
              {r.bijnaam}
              {r.rol === 'ouder' && <span className="tag">ouder</span>}
            </span>
            <span className="ranglijst-score t-num">{r.score}</span>
          </li>
        ))}
        {!ikInTop && stats.positie && (
          <li className="is-ik">
            <span className="ranglijst-nr t-num">{stats.positie}</span>
            <span className="ranglijst-naam">{bijnaam}</span>
            <span className="ranglijst-score t-num">{score}</span>
          </li>
        )}
      </ol>
      {scholier.n > 0 && ouder.n > 0 && (
        <div className="duel">
          <div className="duel-namen t-num">
            <span className="t-mens">Scholieren · {Math.round(scholier.gem)}</span>
            <span className="t-samen">Ouders · {Math.round(ouder.gem)}</span>
          </div>
          <div className="duel-balk">
            <i style={{ width: `${(scholier.gem / som) * 100}%` }} />
          </div>
        </div>
      )}
    </section>
  )
}

function angstTekst(voor, na) {
  if (na < voor) return 'Je bent minder bang dan voor het spel.'
  if (na > voor) return 'Je bent iets banger geworden. Vraag een student wat jou zorgen geeft.'
  return 'Je denkt er hetzelfde over als voor het spel.'
}

export default function Eind({ profiel, ronde, matches, onMakingOf, onToekomst, onOpnieuw }) {
  const [stats, setStats] = useState(undefined)
  const { resultaat, bonus, makingOfPunten } = ronde
  const totaal = resultaat.score + (bonus?.punten ?? 0) + makingOfPunten
  const getoond = useOptellenVanafNul(totaal, 1200, 100)
  const verstuurd = useRef(null)

  const radar = useMemo(() => berekenRadar(resultaat.antwoorden), [resultaat])
  const aantalGoed = resultaat.antwoorden.filter((a) => a.goed).length

  useEffect(() => {
    if (verstuurd.current === totaal) return
    verstuurd.current = totaal
    stuur({ type: 'klaar', spelerId: profiel.id, rondeId: ronde.id, score: totaal, angstNa: profiel.angstNa, match: matches[0]?.baan.id })
    haalStats(profiel.id).then(setStats)
  }, [totaal, profiel.id, profiel.angstNa, ronde.id, matches])

  // Making-of-kaarten uit deze ronde; missers eerst, die openen het gesprek met een student.
  const makingOfs = resultaat.antwoorden
    .map((a) => ({ ...a, kaart: KAART_PER_ID[a.kaartId] }))
    .filter((a) => a.kaart?.makingOf)
    .sort((a, b) => Number(a.goed) - Number(b.goed))

  return (
    <div className="pagina">
      <div className="kopbalk">
        <Merk />
      </div>
      <section className="score-held">
        <span className="t-eyebrow">Jouw score</span>
        <div className="score-getal t-num">{getoond}</div>
        <p className="t-small">
          {stats === undefined
            ? 'Ranglijst laden…'
            : stats?.positie
              ? `Plek ${stats.positie} van vandaag, van ${stats.aantalKlaar} spelers`
              : 'Je komt op de ranglijst zodra er wifi is'}
        </p>
      </section>

      <div className="feiten">
        <div className="feit">
          <b className="t-num">
            {aantalGoed}/{resultaat.antwoorden.length}
          </b>
          <span>goed</span>
        </div>
        <div className="feit">
          <b className="t-num">
            <IcoonVlam grootte={15} /> {resultaat.besteReeks}
          </b>
          <span>beste reeks</span>
        </div>
        <div className="feit">
          <b className="t-num">{bonus?.gevonden ?? 0}</b>
          <span>fouten gevonden</span>
        </div>
      </div>

      {matches.length > 0 && (
        <section className="sectie">
          <div className="sectie-kop">
            <h3 className="t-h3">Jouw ICT-matches</h3>
          </div>
          <div className="rijen">
            {matches.slice(0, 3).map((m) => (
              <BaanRij key={m.baan.id} id={m.baan.id} />
            ))}
          </div>
          <button className="btn btn-secondary btn-block" onClick={onToekomst}>
            Alle banen met toekomst
          </button>
        </section>
      )}

      <section className="sectie">
        <h3 className="t-h3">Jouw AI-radar</h3>
        <p className="t-body">{radarZin(radar)}</p>
        <AiRadar radar={radar} />
        <div className="radar-legenda">
          <span className="is-machine">Buiten de lijn: je overschat AI</span>
          <span className="is-mens">Binnen de lijn: je onderschat AI</span>
        </div>
      </section>

      {profiel.angstVoor && profiel.angstNa && (
        <section className="sectie">
          <h3 className="t-h3">Angst voor AI, voor en na</h3>
          <div className="voorna t-num">
            <span className="voorna-getal is-voor">{profiel.angstVoor}</span>
            <span className="voorna-pijl">→</span>
            <span className="voorna-getal">{profiel.angstNa}</span>
            <small>op een schaal van 5</small>
          </div>
          <p className="t-small">{angstTekst(profiel.angstVoor, profiel.angstNa)}</p>
        </section>
      )}

      {makingOfs.length > 0 && (
        <section className="sectie">
          <div className="sectie" style={{ gap: 'var(--s-1)' }}>
            <h3 className="t-h3">Hoe is het gemaakt?</h3>
            <p className="t-small">Bekijk de making-of samen met een student.</p>
          </div>
          <div className="rijen">
            {makingOfs.map((a, n) => (
              <button key={a.kaartId} className="rij" onClick={() => onMakingOf(a.kaartId)}>
                <Media media={a.kaart.makingOf.aiVersie} className="rij-duim" />
                <span className="rij-tekst">
                  <b>{a.kaart.titel}</b>
                  <span>{a.goed ? 'Had je goed' : n === 0 ? 'Je grootste misser' : 'Had je fout'}</span>
                </span>
                <span className="rij-chevron">
                  <IcoonChevron />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <Ranglijst stats={stats} spelerId={profiel.id} score={totaal} bijnaam={profiel.bijnaam} />

      <section className="boodschap">
        <p>
          AI verandert ICT-werk. Daardoor zijn mensen die AI <strong>begrijpen</strong>, <strong>controleren</strong> en <strong>sturen</strong> juist nodig.
        </p>
        <h3>Dat leer je hier.</h3>
      </section>

      <div className="onderbalk">
        <button className="btn btn-primary btn-block" onClick={onOpnieuw}>
          Nog een ronde
        </button>
      </div>
    </div>
  )
}

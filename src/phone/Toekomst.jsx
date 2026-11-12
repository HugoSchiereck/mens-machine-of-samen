import { useState } from 'react'
import { IcoonMachine, IcoonMens } from '../components/Iconen.jsx'
import { BaanRij, Kop, useBanen } from '../components/Onderdelen.jsx'
import { BANEN, ONDERWERPEN } from '../lib/spel.js'

// Toekomstbeeld: ICT-banen die blijven, eerlijk over wat AI verandert.
export default function Toekomst({ onTerug }) {
  const { matchPer } = useBanen()
  const [filter, setFilter] = useState(null)

  const banen = BANEN.filter((b) => !filter || (b.onderwerpen?.[filter] ?? 0) >= 0.5).sort(
    (a, b) => (matchPer[b.id] ?? -1) - (matchPer[a.id] ?? -1) || a.titel.localeCompare(b.titel),
  )

  return (
    <div className="pagina">
      <Kop onTerug={onTerug} sub="Toekomstbeeld" />

      <div className="sectie" style={{ gap: 'var(--s-3)' }}>
        <h1 className="t-h1">Banen met toekomst</h1>
        <p className="t-lead" style={{ color: 'var(--text-2)' }}>
          AI verandert elke ICT-baan. Maar in al deze banen blijft werk over dat een mens moet doen.
        </p>
      </div>

      <section className="wie">
        <div className="is-ai">
          <span className="t-eyebrow" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <IcoonMachine grootte={12} /> Gaat naar AI
          </span>
          <p>Herhalend werk, eerste versies maken en patronen zoeken.</p>
        </div>
        <div className="is-mens">
          <span className="t-eyebrow" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <IcoonMens grootte={12} /> Blijft mensenwerk
          </span>
          <p>Snappen wat mensen nodig hebben, keuzes maken en controleren of het klopt.</p>
        </div>
      </section>

      <section className="sectie">
        <div className="filter" role="toolbar" aria-label="Filter op onderwerp">
          <button aria-pressed={!filter} onClick={() => setFilter(null)}>
            Alle banen
          </button>
          {Object.entries(ONDERWERPEN).map(([id, label]) => (
            <button key={id} aria-pressed={filter === id} onClick={() => setFilter(filter === id ? null : id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="rijen">
          {banen.map((b) => (
            <BaanRij key={b.id} id={b.id} />
          ))}
        </div>
        <p className="t-small">Tik op een baan voor wat AI al doet, wat jij blijft doen en wat je verdient.</p>
      </section>

      <div className="onderbalk">
        <button className="btn btn-primary btn-block" onClick={onTerug}>
          Terug
        </button>
      </div>
    </div>
  )
}

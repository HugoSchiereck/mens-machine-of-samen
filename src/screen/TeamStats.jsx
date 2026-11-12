import { useLiveStats, stuur } from '../lib/api.js'
import { BANEN, BAAN_PER_ID, BONUS, KAARTEN, KEUZES, ONDERWERPEN } from '../lib/spel.js'
import { HuLogo } from '../components/Iconen.jsx'
import '../styles/scherm.css'

// Team-dashboard: de metingen uit hoofdstuk 13 van het concept, plus interesse per onderwerp.
const pct = (n) => (n == null || Number.isNaN(n) ? '–' : `${Math.round(n * 100)}%`)
const komma = (n) => (n == null ? '–' : n.toFixed(1).replace('.', ','))

export default function TeamStats() {
  const { stats: s, verbonden } = useLiveStats()

  const makingOfs = Object.values(s?.makingOfs ?? {}).reduce((a, b) => a + b, 0)
  const uren = Object.entries(s?.gesprekken?.perUur ?? {}).sort((a, b) => a[0] - b[0])
  const maxUur = Math.max(1, ...uren.map(([, n]) => n))
  const nuUur = s?.gesprekken?.perUur?.[new Date().getHours()] ?? 0
  const alleKaarten = [...KAARTEN, BONUS]
  const nietGecontroleerd = alleKaarten.filter((k) => !k.gecontroleerdDoorDocent).length
  const zonderSalaris = BANEN.filter((b) => !b.startsalaris?.van && !b.startsalaris?.opmerking).length
  const onderwerpen = Object.entries(s?.onderwerpen ?? {}).sort((a, b) => b[1].gem - a[1].gem)
  const matches = Object.entries(s?.matches ?? {}).sort((a, b) => b[1] - a[1])

  return (
    <div className="ts">
      <header className="ts-kop">
        <div className="sectie" style={{ gap: 'var(--s-2)' }}>
          <HuLogo hoogte={30} />
          <span className="t-eyebrow" style={{ marginTop: 'var(--s-4)' }}>
            Team-dashboard · {s?.datum ?? '…'} · {verbonden ? 'live' : 'verbinden…'}
          </span>
          <h1 className="t-h1">Werkt het?</h1>
        </div>
        <nav className="ts-links">
          <a className="btn btn-secondary btn-sm" href="/scherm">
            Groot scherm
          </a>
          <a className="btn btn-secondary btn-sm" href="/kaarten">
            Kaarten
          </a>
          <a className="btn btn-secondary btn-sm" href="/api/stats" download="stats.json">
            Download JSON
          </a>
        </nav>
      </header>

      <section className="ts-kpis">
        <div className="ts-kpi">
          <span className="t-eyebrow">Spelers</span>
          <b className="t-num">{s?.aantalSpelers ?? 0}</b>
        </div>
        <div className="ts-kpi">
          <span className="t-eyebrow">Haalt het eindscherm</span>
          <b className="t-num">{s?.aantalSpelers ? pct(s.aantalKlaar / s.aantalSpelers) : '–'}</b>
          <span className="t-small">{s?.aantalKlaar ?? 0} uitgespeeld</span>
        </div>
        <div className="ts-kpi">
          <span className="t-eyebrow">Angst voor → na</span>
          <b className="t-num">
            {komma(s?.angst?.paarVoor)} → {komma(s?.angst?.paarNa)}
          </b>
          <span className="t-small">dezelfde {s?.angst?.nPaar ?? 0} bezoekers, schaal 1–5</span>
        </div>
        <div className="ts-kpi">
          <span className="t-eyebrow">Making-ofs geopend</span>
          <b className="t-num">{makingOfs}</b>
        </div>
        <div className="ts-kpi">
          <span className="t-eyebrow">Nog te doen</span>
          <b className="t-num">{nietGecontroleerd}</b>
          <span className="t-small">
            kaarten niet gecontroleerd · {zonderSalaris} banen zonder salaris
          </span>
        </div>
      </section>

      <section className="ts-gesprek">
        <div className="sectie" style={{ gap: 'var(--s-1)' }}>
          <span className="t-eyebrow">Gesprekken turven</span>
          <span className="t-h2 t-num">
            {s?.gesprekken?.totaal ?? 0} vandaag · {nuUur} dit uur
          </span>
        </div>
        <button className="btn btn-primary" onClick={() => stuur({ type: 'gesprek' })}>
          +1 gesprek
        </button>
        <div className="ts-uren" aria-label="Gesprekken per uur">
          {uren.map(([uur, n]) => (
            <span key={uur} data-uur={uur} style={{ height: `${(n / maxUur) * 100}%` }} title={`${uur}:00 · ${n}`} />
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--s-6)' }}>
        <section className="sectie">
          <h2 className="t-h3">Leukste onderwerpen</h2>
          <div className="ts-tabel-wrap">
            <table className="ts-tabel">
              <tbody>
                {onderwerpen.length === 0 && (
                  <tr>
                    <td className="t-small">Nog geen beoordelingen</td>
                  </tr>
                )}
                {onderwerpen.map(([id, o]) => (
                  <tr key={id}>
                    <td>{ONDERWERPEN[id] ?? id}</td>
                    <td className="ts-num">{komma(o.gem)} / 5</td>
                    <td className="ts-num t-small">{o.n}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="sectie">
          <h2 className="t-h3">ICT-matches vandaag</h2>
          <div className="ts-tabel-wrap">
            <table className="ts-tabel">
              <tbody>
                {matches.length === 0 && (
                  <tr>
                    <td className="t-small">Nog geen matches</td>
                  </tr>
                )}
                {matches.map(([id, n]) => (
                  <tr key={id}>
                    <td>{BAAN_PER_ID[id]?.titel ?? id}</td>
                    <td className="ts-num">{n}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="sectie">
        <h2 className="t-h3">Welke kaarten werken?</h2>
        <p className="t-small">Te makkelijk: meer dan 90% goed. Te moeilijk: minder dan 20% goed (vanaf 5 stemmen).</p>
        <div className="ts-tabel-wrap">
          <table className="ts-tabel">
            <thead>
              <tr>
                <th>Kaart</th>
                <th>Antwoord</th>
                <th className="ts-num">Stemmen</th>
                <th className="ts-num">Goed</th>
                <th>Mens · machine · samen</th>
                <th className="ts-num">Leuk</th>
                <th className="ts-num">Making-of</th>
                <th>Inhoud</th>
              </tr>
            </thead>
            <tbody>
              {KAARTEN.map((k) => {
                const st = s?.kaarten?.[k.id]
                const totaal = st ? st.goed + st.fout : 0
                const goed = totaal ? st.goed / totaal : null
                const stemmen = st ? st.mens + st.machine + st.samen : 0
                const vlag = totaal >= 5 && goed > 0.9 ? 'te makkelijk' : totaal >= 5 && goed < 0.2 ? 'te moeilijk' : null
                const leuk = s?.leuk?.[k.id]
                return (
                  <tr key={k.id}>
                    <td>{k.titel}</td>
                    <td>{KEUZES[k.antwoord].label}</td>
                    <td className="ts-num">{totaal}</td>
                    <td className="ts-num">
                      {pct(goed)} {vlag && <span className="tag tag-fout">{vlag}</span>}
                    </td>
                    <td>
                      <span className="ts-verdeling">
                        {['mens', 'machine', 'samen'].map((x) => (
                          <i key={x} style={{ width: stemmen ? `${(st[x] / stemmen) * 100}%` : 0 }} />
                        ))}
                      </span>
                    </td>
                    <td className="ts-num">{leuk ? komma(leuk.gem) : '–'}</td>
                    <td className="ts-num">{k.makingOf ? (s?.makingOfs?.[k.id] ?? 0) : '–'}</td>
                    <td>
                      <span className={`tag ${k.status === 'concept' || !k.gecontroleerdDoorDocent ? 'tag-samen' : ''}`}>
                        {k.status === 'concept' ? 'Voorbeeld' : 'Eigen'}
                        {k.gecontroleerdDoorDocent ? '' : ', niet gecheckt'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Media } from '../components/Media.jsx'
import { IcoonMachine, IcoonMens, KEUZE_ICOON, Merk } from '../components/Iconen.jsx'
import { groepsStem, useLiveStats } from '../lib/api.js'
import { BAAN_PER_ID, BANEN, KAART_PER_ID, KAARTEN, KEUZES } from '../lib/spel.js'
import '../styles/scherm.css'

const komma = (n, d = 1) => (n == null ? '–' : n.toFixed(d).replace('.', ','))

function useSpeelUrl() {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const vast = new URLSearchParams(location.search).get('url')
    if (vast) return setUrl(vast)
    if (!['localhost', '127.0.0.1', '::1'].includes(location.hostname)) return setUrl(location.origin)
    fetch('/api/info')
      .then((r) => r.json())
      .then(({ adressen }) => setUrl(adressen[0] ? `http://${adressen[0]}${location.port ? `:${location.port}` : ''}` : location.origin))
      .catch(() => setUrl(location.origin))
  }, [])
  return url
}

function QR({ url }) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    if (url) QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#121211', light: '#ffffff' } }).then(setSvg)
  }, [url])
  return <div className="gs-qr" dangerouslySetInnerHTML={{ __html: svg }} />
}

function Klok() {
  const [nu, setNu] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNu(new Date()), 10000)
    return () => clearInterval(id)
  }, [])
  return <span className="t-num">{nu.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
}

// Wat staat er in het middenpaneel? De laatst gestemde kaart; is het stil, dan afwisselend
// een kaart met stemmen en een baan in de spotlight.
function useMidden(stats, flits) {
  const [tik, setTik] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTik((t) => t + 1), 9000)
    return () => clearInterval(id)
  }, [])
  return useMemo(() => {
    const stil = !flits || Date.now() - flits.ontvangen > 20000
    if (!stil && KAART_PER_ID[flits.kaartId]) return { soort: 'kaart', kaart: KAART_PER_ID[flits.kaartId] }
    const metStemmen = KAARTEN.filter((k) => groepsStem(stats, k.id))
    if (tik % 2 === 1 || !metStemmen.length) return { soort: 'baan', baan: BANEN[Math.floor(tik / 2) % BANEN.length] }
    return { soort: 'kaart', kaart: metStemmen[Math.floor(tik / 2) % metStemmen.length] }
  }, [stats, tik, flits])
}

function LiveKaart({ kaart, stats, flits }) {
  const groep = groepsStem(stats, kaart.id)
  const flitsHier = flits?.kaartId === kaart.id ? flits : null
  return (
    <>
      <div className="gs-paneel-kop">
        <span className="gs-label">
          <span className="gs-livepunt" /> Live · zo stemt iedereen
        </span>
        {flitsHier?.bijnaam && flitsHier.keuze && (
          <span className={`tag tag-${flitsHier.keuze} gs-flits`} key={flitsHier.id}>
            {flitsHier.bijnaam} kiest {KEUZES[flitsHier.keuze].label.toLowerCase()}
          </span>
        )}
      </div>
      <div className="gs-live" key={kaart.id}>
        <figure className="gs-kaart">
          <Media media={kaart.media[0]} />
          <figcaption>{kaart.titel}</figcaption>
        </figure>
        <div className="gs-zuilen">
          {Object.keys(KEUZES).map((k) => {
            const Icoon = KEUZE_ICOON[k]
            const pct = groep ? Math.round(groep[k] * 100) : 0
            return (
              <div key={k} className={`gs-zuil is-${k} ${flitsHier?.keuze === k ? 'is-flits' : ''}`}>
                <span className="gs-zuil-pct t-num">{pct}%</span>
                <span className="gs-zuil-buis">
                  <i style={{ height: `${Math.max(1.5, pct)}%` }} />
                </span>
                <span className="gs-zuil-naam">
                  <Icoon grootte={22} /> {KEUZES[k].label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <p className="gs-voetregel t-num">{groep ? `${groep.totaal} ${groep.totaal === 1 ? 'stem' : 'stemmen'}` : ''}</p>
    </>
  )
}

function Spotlight({ baan }) {
  return (
    <>
      <div className="gs-paneel-kop">
        <span className="gs-label">Banen met toekomst</span>
      </div>
      <div className="gs-spotlight" key={baan.id}>
        <h2 className="gs-spot-titel">{baan.titel}</h2>
        <p className="gs-spot-wat">{baan.wat}</p>
        <div className="gs-spot-rijen">
          <div className="is-ai">
            <span className="gs-label">
              <IcoonMachine grootte={14} /> Wat AI al doet
            </span>
            <p>{baan.aiDoet}</p>
          </div>
          <div className="is-mens">
            <span className="gs-label">
              <IcoonMens grootte={14} /> Wat jij blijft doen
            </span>
            <p>{baan.jijDoet}</p>
          </div>
        </div>
        <p className="gs-voetregel">Speel mee en ontdek welke ICT-baan bij jou past.</p>
      </div>
    </>
  )
}

export default function GrootScherm() {
  const [flits, setFlits] = useState(null)
  const { stats, verbonden } = useLiveStats((e) => {
    if (e.type === 'stem') setFlits({ ...e, id: Math.random(), ontvangen: Date.now() })
  })
  const url = useSpeelUrl()
  const midden = useMidden(stats, flits)

  const angst = stats?.angst
  const daling = angst?.paarVoor != null && angst?.paarNa != null ? angst.paarVoor - angst.paarNa : null
  const getrapt = stats?.inGetrapt ? KAART_PER_ID[stats.inGetrapt.kaartId] : null
  const topBaan = stats?.topMatch ? BAAN_PER_ID[stats.topMatch.baanId] : null
  const lijst = stats?.ranglijst ?? []
  const { scholier = {}, ouder = {} } = stats?.ouderVsKind ?? {}
  const som = (scholier.gem ?? 0) + (ouder.gem ?? 0)

  return (
    <div className="gs">
      <header className="gs-kop">
        <Merk vol />
        <span className={`tag ${verbonden ? 'tag-fout' : ''} gs-status`}>{verbonden ? 'Live' : 'Verbinden…'}</span>
        <span className="gs-kop-rechts">
          <span>
            <b className="t-num">{stats?.aantalSpelers ?? 0}</b> spelers vandaag
          </span>
          <Klok />
        </span>
      </header>

      <main className="gs-grid">
        <section className="gs-paneel gs-doemee">
          <h1 className="gs-titel">Speel mee</h1>
          <QR url={url} />
          <p className="gs-url t-mono">{url.replace(/^https?:\/\//, '')}</p>
          <ol className="gs-stappen">
            <li>Scan de code met je telefoon</li>
            <li>Kies een bijnaam</li>
            <li>Raad: mens, machine of samen?</li>
          </ol>
        </section>

        <section className="gs-paneel gs-midden">
          {midden.soort === 'kaart' ? <LiveKaart kaart={midden.kaart} stats={stats} flits={flits} /> : <Spotlight baan={midden.baan} />}
        </section>

        <section className="gs-paneel gs-rang">
          <span className="gs-label">Ranglijst van vandaag</span>
          {lijst.length === 0 ? (
            <p className="gs-leeg">Nog niemand. Word jij de dagkampioen?</p>
          ) : (
            <ol>
              {lijst.slice(0, 6).map((r, i) => (
                <li key={r.id} className={i === 0 ? 'is-eerste' : ''}>
                  <span className="gs-rang-nr t-num">{i + 1}</span>
                  <span className="gs-rang-naam">
                    <span>{r.bijnaam}</span>
                    {r.rol === 'ouder' && <span className="tag">ouder</span>}
                  </span>
                  <span className="gs-rang-score t-num">{r.score}</span>
                </li>
              ))}
            </ol>
          )}
          <div className="gs-duel">
            <span className="gs-label">Ouders tegen scholieren</span>
            <div className="gs-duel-namen t-num">
              <span className="t-mens">
                Scholieren <b>{scholier.gem ? Math.round(scholier.gem) : '–'}</b>
              </span>
              <span className="t-samen">
                <b>{ouder.gem ? Math.round(ouder.gem) : '–'}</b> Ouders
              </span>
            </div>
            <div className="gs-duel-balk">
              <i style={{ width: som ? `${(scholier.gem / som) * 100}%` : '50%' }} />
            </div>
          </div>
        </section>
      </main>

      <footer className="gs-voet">
        <div className="gs-tegel">
          <span className="gs-label">Angst voor AI, voor en na het spel</span>
          <div className="gs-angst t-num">
            <span className="gs-groot is-zacht">{komma(angst?.paarVoor)}</span>
            <span className="gs-pijl">→</span>
            <span className="gs-groot">{komma(angst?.paarNa)}</span>
            <span className="gs-klein">
              {daling > 0 ? `${komma(daling)} punt minder bang` : 'schaal 1 tot 5'}
              <br />
              {angst?.nPaar ?? 0} bezoekers gemeten
            </span>
          </div>
        </div>
        <div className="gs-tegel">
          <span className="gs-label">Hier trapten de meesten in</span>
          {getrapt ? (
            <div className="gs-angst t-num">
              <span className="gs-groot t-samen">{Math.round(stats.inGetrapt.pctFout * 100)}%</span>
              <span className="gs-klein">
                zat fout bij
                <br />
                <b>{getrapt.titel}</b>
              </span>
            </div>
          ) : (
            <p className="gs-leeg">Nog te weinig stemmen</p>
          )}
        </div>
        <div className="gs-tegel">
          <span className="gs-label">Populairste match vandaag</span>
          {topBaan ? (
            <div className="gs-angst t-num">
              <span className="gs-middel">{topBaan.titel}</span>
              <span className="gs-klein">{stats.topMatch.n}×</span>
            </div>
          ) : (
            <p className="gs-leeg">Nog geen matches</p>
          )}
        </div>
      </footer>
    </div>
  )
}

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Merk } from '../components/Iconen.jsx'
import { useLiveStats } from '../lib/api.js'
import '../styles/uitnodiging.css'

function useSpeelUrl() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    const vast = new URLSearchParams(location.search).get('url')
    if (vast) {
      setUrl(vast)
      return
    }
    if (!['localhost', '127.0.0.1', '::1'].includes(location.hostname)) {
      setUrl(location.origin)
      return
    }
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
    if (!url) return
    QRCode.toString(url, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'H',
      color: { dark: '#00004d', light: '#ffffff' },
    }).then(setSvg)
  }, [url])

  return <div className="uit-qr" aria-label={`QR-code naar ${url}`} dangerouslySetInnerHTML={{ __html: svg }} />
}

export default function Uitnodiging() {
  const url = useSpeelUrl()
  const { stats, verbonden } = useLiveStats()
  const [missieIndex, setMissieIndex] = useState(0)
  const aantalSpelers = Number.isFinite(stats?.aantalSpelers) ? stats.aantalSpelers : null
  const missies = [
    'Kun jij AI herkennen?',
    'Welke ICT-baan past bij jou?',
    'Mens, machine of samen?',
    'Klaar om jouw talent te ontdekken?',
  ]
  const socialeBewijs = !verbonden || aantalSpelers === null
    ? 'De stand wordt zo bijgewerkt — doe mee met de competitie.'
    : aantalSpelers === 0
      ? 'Er speelt nog niemand mee — jij kunt de eerste zijn.'
      : `${aantalSpelers} ${aantalSpelers === 1 ? 'deelnemer doet' : 'deelnemers doen'} al mee.`

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const timer = window.setInterval(() => {
      setMissieIndex((index) => (index + 1) % missies.length)
    }, 7000)

    return () => window.clearInterval(timer)
  }, [missies.length])

  return (
    <main className="uit">
      <div className="uit-vorm uit-vorm-links" />
      <div className="uit-vorm uit-vorm-rechts" />
      <div className="uit-raster" aria-hidden="true" />
      <div className="uit-orbit uit-orbit-een" aria-hidden="true"><i /><i /><i /></div>
      <div className="uit-orbit uit-orbit-twee" aria-hidden="true" />
      <header className="uit-kop">
        <Merk vol />
        <span className="uit-live">Open dag · speel mee</span>
      </header>

      <section className="uit-inhoud">
        <div className="uit-tekst">
          <h1>AI of <span>mens</span></h1>
          <p className="uit-belofte">Doe mee in 2 minuten</p>
          <p className="uit-intro">Scan de code en ontdek welke ICT-baan bij jou past.</p>
          <div className="uit-missie" aria-label="Missie-teaser">
            <span className="uit-missie-label">Missie</span>
            <p key={missieIndex} className="uit-missie-tekst" aria-live="polite" aria-atomic="true">{missies[missieIndex]}</p>
            <span className="uit-missie-punten" aria-hidden="true">
              {missies.map((missie, index) => <i key={missie} className={index === missieIndex ? 'actief' : ''} />)}
            </span>
          </div>
          <div className="uit-social" aria-live="polite">
            <p className="uit-social-regel">{socialeBewijs}</p>
            <p className="uit-competitie">Durf jij de nummer 1 te verslaan?</p>
          </div>
          <div className="uit-stappen" aria-label="Zo doe je mee">
            <span><b>1</b> Pak je telefoon</span>
            <span><b>2</b> Scan de code</span>
            <span><b>3</b> Speel mee</span>
          </div>
        </div>

        <div className="uit-codekaart">
          <span className="uit-code-label">Jouw missie begint hier</span>
          <div className="uit-qr-wrap">
            <QR url={url} />
          </div>
          <p className="uit-scan">Scan &amp; speel mee</p>
          {url && <p className="uit-url">{url.replace(/^https?:\/\//, '')}</p>}
        </div>
      </section>

      <footer className="uit-voet">
        <span>Een interactieve ontdekkingstocht van Hogeschool Utrecht</span>
        <span className="uit-vormen" aria-hidden="true"><i /><i /><i /></span>
      </footer>
    </main>
  )
}

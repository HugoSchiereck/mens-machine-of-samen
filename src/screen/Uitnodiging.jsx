import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { HuLogo } from '../components/Iconen.jsx'
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
  const [missieIndex, setMissieIndex] = useState(0)
  const missies = [
    'Kun jij AI herkennen?',
    'Klaar om jouw talent te ontdekken?',
  ]

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
        <HuLogo />
        <span className="uit-live">Open dag</span>
      </header>

      <section className="uit-inhoud">
        <div className="uit-tekst">
          <p className="uit-context">AI of mens</p>
          <h1>Welke <span>ICT-baan</span> past bij jou?</h1>
          <p className="uit-belofte">Doe mee in 2 minuten</p>
          <p className="uit-intro">Ontdek wat AI kan doen — en welke rol jij houdt.</p>
          <div className="uit-missie" aria-label="Missie-teaser">
            <span className="uit-missie-label">Missie</span>
            <p key={missieIndex} className="uit-missie-tekst" aria-live="polite" aria-atomic="true">{missies[missieIndex]}</p>
            <span className="uit-missie-punten" aria-hidden="true">
              {missies.map((missie, index) => <i key={missie} className={index === missieIndex ? 'actief' : ''} />)}
            </span>
          </div>
          <div className="uit-stappen" aria-label="Zo doe je mee">
            <span><b>1</b> Pak je telefoon</span>
            <span><b>2</b> Scan de code</span>
            <span><b>3</b> Ontdek jouw ICT-match</span>
          </div>
        </div>

        <div className="uit-codekaart">
          <span className="uit-code-label">Scan om te beginnen</span>
          <div className="uit-qr-wrap">
            <QR url={url} />
          </div>
          <p className="uit-scan">Scan mij</p>
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

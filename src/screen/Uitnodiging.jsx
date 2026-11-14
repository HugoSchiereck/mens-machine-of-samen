import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Merk } from '../components/Iconen.jsx'
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
          <p className="uit-intro">Scan de code, speel mee en ontdek welke ICT-baan bij jou past.</p>
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

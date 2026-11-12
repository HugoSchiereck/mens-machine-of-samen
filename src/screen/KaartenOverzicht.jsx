import { Media, Vlak } from '../components/Media.jsx'
import { AntwoordTag } from '../components/Onderdelen.jsx'
import { FoutRing } from '../phone/VindDeFout.jsx'
import { BAAN_PER_ID, BONUS, KAARTEN, ONDERWERPEN } from '../lib/spel.js'
import { HuLogo } from '../components/Iconen.jsx'
import '../styles/telefoon.css'
import '../styles/scherm.css'

// Overzicht voor het team: alle kaarten met vlakken en fouten, om coördinaten in kaarten.json te controleren.
function Fouten({ media, fouten }) {
  return (
    <figure className="ko-fig">
      <Media media={media}>
        {fouten.map((f, i) => (
          <span key={i}>
            <FoutRing fout={f} nr={i + 1} status="gevonden" />
            {(f.extra ?? []).map((e, j) => (
              <FoutRing key={j} fout={e} nr={i + 1} status="gemist" />
            ))}
          </span>
        ))}
      </Media>
      <figcaption>AI-versie met fouten (gestippeld = extra tikplek)</figcaption>
    </figure>
  )
}

function Info({ kaart, children }) {
  return (
    <div className="ko-info">
      <span className="t-eyebrow">
        {ONDERWERPEN[kaart.onderwerp] ?? kaart.onderwerp} · {kaart.id}
      </span>
      <h2 className="t-h2">{kaart.titel}</h2>
      {children}
      <div className="tags">
        {(kaart.onthulling?.banen ?? kaart.banen ?? []).map((id) => (
          <span key={id} className="tag">
            {BAAN_PER_ID[id]?.titel ?? id}
          </span>
        ))}
      </div>
      <span className={`tag ${kaart.gecontroleerdDoorDocent ? '' : 'tag-samen'}`}>
        {kaart.status === 'concept' ? 'Voorbeeldinhoud' : 'Eigen inhoud'} · {kaart.gecontroleerdDoorDocent ? 'gecontroleerd' : 'docent moet nog controleren'}
      </span>
    </div>
  )
}

export default function KaartenOverzicht() {
  return (
    <div className="ts">
      <header className="ts-kop">
        <div className="sectie" style={{ gap: 'var(--s-2)' }}>
          <HuLogo hoogte={30} />
          <span className="t-eyebrow" style={{ marginTop: 'var(--s-4)' }}>Voor het team · {KAARTEN.length} kaarten en een bonuskaart</span>
          <h1 className="t-h1">Kaartenoverzicht</h1>
        </div>
        <nav className="ts-links">
          <a className="btn btn-secondary btn-sm" href="/stats">
            Team-dashboard
          </a>
          <a className="btn btn-secondary btn-sm" href="/">
            Spel
          </a>
        </nav>
      </header>
      {KAARTEN.map((k) => (
        <section key={k.id} className="ko-kaart">
          <Info kaart={k}>
            <AntwoordTag antwoord={k.antwoord} />
            <p className="t-small">{k.onthulling.kort}</p>
            <ol>
              {(k.onthulling.vlakken ?? []).map((v, i) => (
                <li key={i} className={v.door === 'ai' ? 't-machine' : 't-mens'}>
                  {v.uitleg}
                </li>
              ))}
            </ol>
          </Info>
          <div className="ko-beelden">
            <figure className="ko-fig">
              <Media media={k.media[0]}>
                {(k.onthulling.vlakken ?? []).map((v, i) => (
                  <Vlak key={i} vlak={v} nr={i} />
                ))}
              </Media>
              <figcaption>Kaart met vlakken</figcaption>
            </figure>
            {k.makingOf && <Fouten media={k.makingOf.aiVersie} fouten={k.makingOf.fouten} />}
            {k.makingOf && (
              <figure className="ko-fig">
                <Media media={k.makingOf.eindVersie} />
                <figcaption>Eindversie</figcaption>
              </figure>
            )}
          </div>
        </section>
      ))}
      <section className="ko-kaart">
        <Info kaart={{ ...BONUS, onthulling: { banen: BONUS.banen } }}>
          <ol>
            {BONUS.fouten.map((f, i) => (
              <li key={i}>{f.uitleg}</li>
            ))}
          </ol>
        </Info>
        <div className="ko-beelden">
          <Fouten media={BONUS.media[0]} fouten={BONUS.fouten} />
        </div>
      </section>
    </div>
  )
}

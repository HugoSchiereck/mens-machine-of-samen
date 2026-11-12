import { useState } from 'react'
import { Media, Vlak } from '../components/Media.jsx'
import { IcoonCheck, IcoonKlok, IcoonKruis, IcoonVlam, KEUZE_ICOON } from '../components/Iconen.jsx'
import { BaanRij, Schaal } from '../components/Onderdelen.jsx'
import { KEUZES, ONDERWERPEN, onderwerpInZin } from '../lib/spel.js'
import { useOptellenVanafNul } from './hooks.js'

function GroepsStem({ groep, keuze, antwoord }) {
  return (
    <section className="sectie">
      <div className="sectie-kop">
        <h3 className="t-h3">Zo stemden anderen</h3>
        {groep && <span className="t-small t-num">{groep.totaal} {groep.totaal === 1 ? 'stem' : 'stemmen'}</span>}
      </div>
      {groep ? (
        <>
          <div className="stemmen">
            {Object.keys(KEUZES).map((k) => (
              <div key={k} className={`stem-rij ${k === antwoord ? 'is-juist' : ''}`}>
                <span className="stem-naam">
                  {KEUZES[k].label}
                  {k === keuze && <span className="jij">jij</span>}
                </span>
                <span className={`balk balk-${k}`}>
                  <i style={{ width: `${Math.round(groep[k] * 100)}%` }} />
                </span>
                <span className="stem-pct t-num">{Math.round(groep[k] * 100)}%</span>
              </div>
            ))}
          </div>
          <p className="t-small">{Math.round(groep.goed * 100)}% van de bezoekers had deze goed.</p>
        </>
      ) : (
        <p className="t-small">Jij bent de eerste die deze kaart vandaag speelt.</p>
      )}
    </section>
  )
}

const TIJD_RIJEN = [
  ['zonderAI', 'Zonder AI', 'is-mens'],
  ['alleenAI', 'Alleen AI', 'is-machine'],
  ['samen', "ICT'er met AI", 'is-samen'],
]

function minutenTekst(m) {
  if (m < 60) return `${m} min`
  const u = Math.floor(m / 60)
  return m % 60 ? `${u} u ${m % 60} min` : `${u} uur`
}

export function TijdBalken({ tijd }) {
  const max = Math.max(1, ...TIJD_RIJEN.map(([k]) => tijd[k]?.minuten ?? 0))
  return (
    <section className="sectie">
      <h3 className="t-h3">Tijd en resultaat</h3>
      <div className="tijd">
        {TIJD_RIJEN.map(([k, label, kleur]) => {
          const t = tijd[k]
          if (!t) return null
          const gemeten = t.minuten != null
          return (
            <div key={k} className={`tijd-rij ${kleur}`}>
              <span className="tijd-label">{label}</span>
              <span className={`tijd-balk ${gemeten ? '' : 'is-ongemeten'}`}>
                <i style={{ width: gemeten ? `${Math.max(4, (t.minuten / max) * 100)}%` : '100%' }} />
                <b className="t-num">{gemeten ? `${minutenTekst(t.minuten)}${t.schatting ? ' (schatting)' : ''}` : 'Tijd nog meten'}</b>
              </span>
              <span className={`tijd-resultaat ${t.ok ? '' : 'is-fout'}`}>
                {t.ok ? <IcoonCheck grootte={14} /> : <IcoonKruis grootte={14} />}
                {t.resultaat}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function Onthulling({ kaart, antwoord, groep, laatste, weg = false, onVolgende }) {
  const o = kaart.onthulling
  const [actief, setActief] = useState(null)
  const { goed, keuze, punten } = antwoord
  const vlakken = o.vlakken ?? []
  const vlak = actief != null ? vlakken[actief] : null
  const onderwerp = ONDERWERPEN[kaart.onderwerp] ?? kaart.onderwerp
  const onderwerpZin = onderwerpInZin(kaart.onderwerp)
  const AntwoordIcoon = KEUZE_ICOON[kaart.antwoord]
  const getoond = useOptellenVanafNul(goed ? punten.totaal : 0, 700, 250)

  return (
    <div className={`onthulling ${weg ? 'is-weg' : ''}`}>
      <section className={`uitslag is-${kaart.antwoord}`}>
        <div className="uitslag-rij">
          <span className={`uitslag-status ${goed ? 'is-goed' : 'is-mis'}`}>
            {goed ? <IcoonCheck grootte={16} /> : keuze ? <IcoonKruis grootte={16} /> : <IcoonKlok grootte={16} />}
            {goed ? 'Goed' : keuze ? 'Mis' : 'Te laat'}
          </span>
          {goed ? (
            <span className="uitslag-punten t-num">
              {punten.factor > 1 && (
                <span className="tag tag-samen t-num">
                  <IcoonVlam grootte={12} /> ×{String(punten.factor).replace('.', ',')}
                </span>
              )}
              +{getoond}
            </span>
          ) : (
            keuze && <span className="uitslag-jij">Jij koos {KEUZES[keuze].label.toLowerCase()}</span>
          )}
        </div>
        <div className="uitslag-antwoord">
          <span className="uitslag-het-was">Het was</span>
          <strong>
            <AntwoordIcoon grootte={28} />
            {KEUZES[kaart.antwoord].label}
          </strong>
        </div>
        <p className="uitslag-kort">{o.kort}</p>
      </section>

      <div className="media-kaart">
        <Media media={kaart.media[0]} alt={kaart.titel} onTik={() => setActief(null)}>
          {vlakken.map((v, n) => (
            <Vlak key={n} vlak={v} nr={n} actief={actief === n} onClick={() => setActief(actief === n ? null : n)} />
          ))}
          {vlak && (
            <div className={`onderschrift ${vlak.door === 'ai' ? 'is-ai' : 'is-mens'}`} key={actief} aria-live="polite">
              <span className={`tag ${vlak.door === 'ai' ? 'tag-machine' : 'tag-mens'}`}>{vlak.door === 'ai' ? 'AI' : 'Mens'}</span>
              <span>{vlak.uitleg}</span>
            </div>
          )}
        </Media>
      </div>
      {vlakken.length > 0 && (
        <p className="legenda">
          Tik op een vlak:
          <span className="is-ai">AI deed dit</span>
          <span className="is-mens">mens deed dit</span>
        </p>
      )}

      {o.wieDoetWat && (
        <section className="wie">
          <div className="is-ai">
            <span className="t-eyebrow">AI / machine</span>
            <p>{o.wieDoetWat.ai}</p>
          </div>
          <div className="is-mens">
            <span className="t-eyebrow">Mens</span>
            <p>{o.wieDoetWat.mens}</p>
          </div>
        </section>
      )}

      {o.bron && (
        <p className="t-small">
          Bron:{' '}
          {o.bron.url ? (
            <a href={o.bron.url} target="_blank" rel="noreferrer">
              {o.bron.titel}
            </a>
          ) : (
            o.bron.titel
          )}
        </p>
      )}

      {o.banen?.length > 0 && (
        <section className="sectie">
          <h3 className="t-h3">Banen achter deze kaart</h3>
          <div className="rijen">
            {o.banen.map((id) => (
              <BaanRij key={id} id={id} />
            ))}
          </div>
        </section>
      )}

      <GroepsStem groep={groep} keuze={keuze} antwoord={kaart.antwoord} />

      {o.tijd && <TijdBalken tijd={o.tijd} />}

      <div className="onderbalk beoordeel">
        <div className="beoordeel-kop">
          <div>
            <h3 className="beoordeel-vraag">
              Hoe leuk vind je <b>{onderwerpZin}</b>?
            </h3>
            <p className="t-small">{laatste ? 'Daarna volgt de bonusronde.' : 'Zo vinden we welke ICT-baan bij je past.'}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onVolgende(null)}>
            Overslaan
          </button>
        </div>
        <Schaal uitersten={['Niks voor mij', 'Wil ik meer van']} label={`Hoe leuk vind je ${onderwerp}?`} onKies={onVolgende} />
      </div>
    </div>
  )
}

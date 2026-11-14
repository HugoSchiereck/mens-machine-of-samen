import { useState } from 'react'
import { Media } from '../components/Media.jsx'
import { Schaal } from '../components/Onderdelen.jsx'
import { IcoonDobbel, IcoonKoffer, IcoonMachine, IcoonMens, IcoonSamen, Merk } from '../components/Iconen.jsx'
import { bijnaamOk, verzinBijnaam } from '../lib/bijnaam.js'
import { HOBBYWERELDEN } from '../lib/spel.js'
import { uid } from '../lib/api.js'

const STAPPEN = ['naam', 'rol', 'wereld', 'angst']

function Voorproef() {
  return (
    <div className="voorproef" aria-hidden="true">
      <div className="voorproef-kaart">
        <Media media={{ type: 'mockup', id: 'operatierobot' }} />
      </div>
      <div className="voorproef-kaart">
        <Media media={{ type: 'mockup', id: 'voetbal-site', versie: 'eind' }} />
      </div>
      <div className="voorproef-kaart">
        <Media media={{ type: 'mockup', id: 'game-level' }} />
      </div>
    </div>
  )
}

function Keuze({ gekozen, titel, sub, onClick }) {
  return (
    <button className={`keuze ${gekozen ? 'is-gekozen' : ''}`} onClick={onClick}>
      <span className="keuze-tekst">
        <b>{titel}</b>
        {sub && <span>{sub}</span>}
      </span>
      <span className="keuze-radio" />
    </button>
  )
}

export default function Lobby({ onKlaar }) {
  const [stap, setStap] = useState('naam')
  const [bijnaam, setBijnaam] = useState('')
  const [fout, setFout] = useState('')
  const [rol, setRol] = useState(null)
  const [hobby, setHobby] = useState(null)
  const nr = STAPPEN.indexOf(stap)

  function naamVerder(e) {
    e.preventDefault()
    if (!bijnaamOk(bijnaam)) {
      setFout(bijnaam.trim().length < 2 ? 'Kies een bijnaam van minstens 2 tekens.' : 'Die bijnaam kan niet. Kies een andere.')
      return
    }
    setStap('rol')
  }

  if (stap === 'naam') {
    return (
      <div className="pagina">
        <div className="lobby-held">
          <Merk groot />
          <p className="t-lead" style={{ color: 'var(--text-2)' }}>
            Swipe kaarten en raad wie het maakte. Ontdek welke ICT-baan bij jou past.
          </p>
        </div>
        <Voorproef />
        <form className="formulier" onSubmit={naamVerder} style={{ marginTop: 'auto' }}>
          <label className="t-eyebrow" htmlFor="bijnaam">
            Bijnaam
          </label>
          <div className="veld">
            <input
              id="bijnaam"
              value={bijnaam}
              onChange={(e) => {
                setBijnaam(e.target.value)
                setFout('')
              }}
              maxLength={16}
              autoComplete="off"
              autoCapitalize="words"
              placeholder="Bijv. Snelle Kip"
              enterKeyHint="next"
            />
            <button type="button" className="btn btn-secondary btn-icon" onClick={() => setBijnaam(verzinBijnaam())} aria-label="Verzin een bijnaam">
              <IcoonDobbel />
            </button>
          </div>
          {fout && <p className="veldfout">{fout}</p>}
          <button className="btn btn-primary btn-block" type="submit">
            Doe mee
          </button>
          <p className="voetnoot">Alleen een bijnaam. Geen echte naam, e-mail of foto.</p>
        </form>
      </div>
    )
  }

  return (
    <div className="pagina" key={stap}>
      <div className="kopbalk">
        <Merk />
        <ol className="stapjes" aria-label={`Stap ${nr + 1} van ${STAPPEN.length}`}>
          {STAPPEN.map((s, i) => (
            <li key={s} className={i <= nr ? 'is-aan' : ''} />
          ))}
        </ol>
      </div>

      {stap === 'rol' && (
        <div className="sectie" style={{ gap: 'var(--s-5)', marginTop: 'var(--s-6)' }}>
          <h1 className="t-h1">Wie ben jij?</h1>
          <div className="keuzes">
            {[
              ['scholier', 'Scholier', 'Ik kom kijken voor mezelf'],
              ['ouder', 'Ouder of begeleider', 'Ik ben mee met een scholier'],
            ].map(([id, titel, sub]) => (
              <Keuze
                key={id}
                titel={titel}
                sub={sub}
                gekozen={rol === id}
                onClick={() => {
                  setRol(id)
                  setTimeout(() => setStap('wereld'), 160)
                }}
              />
            ))}
          </div>
          <p className="t-small">Ouders en scholieren hebben elk een eigen ranglijst.</p>
        </div>
      )}

      {stap === 'wereld' && (
        <div className="sectie" style={{ gap: 'var(--s-5)', marginTop: 'var(--s-6)' }}>
          <div className="sectie" style={{ gap: 'var(--s-2)' }}>
            <h1 className="t-h1">Wat vind je leuk?</h1>
            <p className="t-small">Je krijgt dan meer kaarten uit jouw hoek.</p>
          </div>
          <div className="keuzes keuzes-2">
            {HOBBYWERELDEN.map((w) => (
              <Keuze
                key={w.id}
                titel={w.label}
                gekozen={hobby === w.id}
                onClick={() => {
                  setHobby(w.id)
                  setTimeout(() => setStap('angst'), 160)
                }}
              />
            ))}
          </div>
          <button className="btn btn-ghost" onClick={() => setStap('angst')}>
            Sla over
          </button>
        </div>
      )}

      {stap === 'angst' && (
        <div className="sectie" style={{ gap: 'var(--s-6)', marginTop: 'var(--s-6)' }}>
          <div className="sectie" style={{ gap: 'var(--s-2)' }}>
            <span className="t-eyebrow">Eerlijk antwoord</span>
            <h1 className="t-h1">Hoe bang ben je dat AI banen in de ICT overneemt?</h1>
          </div>
          <Schaal
            label="Hoe bang ben je dat AI banen in de ICT overneemt?"
            onKies={(angstVoor) => onKlaar({ id: uid(), bijnaam: bijnaam.trim(), rol, hobby, angstVoor, angstNa: null, gezien: [] })}
          />
        </div>
      )}
    </div>
  )
}

export function Uitleg({ onStart }) {
  return (
    <div className="pagina">
      <div className="kopbalk">
        <Merk />
      </div>
      <div className="sectie" style={{ gap: 'var(--s-2)' }}>
        <span className="t-eyebrow">Zo werkt het</span>
        <h1 className="t-h1">Wie maakte dit?</h1>
      </div>
      <div className="demo" aria-hidden="true">
        <div className="demo-kaart">
          <Media media={{ type: 'mockup', id: 'muziek-jaar' }} />
          <span className="demo-label demo-mens tag tag-mens">Mens</span>
          <span className="demo-label demo-machine tag tag-machine">Machine</span>
          <span className="demo-label demo-samen tag tag-samen">Samen</span>
        </div>
      </div>
      <ul className="regels">
        <li className="regel is-mens">
          <span className="regel-icoon">
            <IcoonMens grootte={18} />
          </span>
          <div>
            <b>
              Mens <span className="toets">← swipe links</span>
            </b>
            <p>Een mens bedacht en maakte het. De computer is hooguit gereedschap.</p>
          </div>
        </li>
        <li className="regel is-samen">
          <span className="regel-icoon">
            <IcoonSamen grootte={20} />
          </span>
          <div>
            <b>
              Samen <span className="toets">↑ swipe omhoog</span>
            </b>
            <p>AI én mens deden allebei echt iets.</p>
          </div>
        </li>
        <li className="regel is-machine">
          <span className="regel-icoon">
            <IcoonMachine grootte={18} />
          </span>
          <div>
            <b>
              Machine <span className="toets">swipe rechts →</span>
            </b>
            <p>AI of software deed het zelf.</p>
          </div>
        </li>
        <li className="regel">
          <span className="regel-icoon">
            <IcoonKoffer />
          </span>
          <div>
            <b>Daarna: hoe leuk vind je het onderwerp?</b>
            <p>Met jouw antwoorden zoeken we welke ICT-baan bij je past.</p>
          </div>
        </li>
      </ul>
      <p className="t-small">8 kaarten · 30 seconden per kaart · sneller is meer punten</p>
      <div className="onderbalk">
        <button className="btn btn-primary btn-block" onClick={onStart}>
          Start de ronde
        </button>
      </div>
    </div>
  )
}

export function WelkomTerug({ profiel, onSpelen, onAnder }) {
  return (
    <div className="pagina pagina-midden">
      <Merk groot />
      <p className="t-lead">
        Hoi <b>{profiel.bijnaam}</b>, nog een ronde?
      </p>
      <div className="sectie">
        <button className="btn btn-primary btn-block" onClick={onSpelen}>
          Speel een ronde
        </button>
        <button className="btn btn-secondary btn-block" onClick={onAnder}>
          Ik ben iemand anders
        </button>
      </div>
    </div>
  )
}

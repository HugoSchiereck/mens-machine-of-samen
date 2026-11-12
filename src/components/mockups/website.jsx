// Websites: de voetbalclub (making-of) en de inlogpagina (vind de fout).
// Alles staat absoluut op het 360x480-podium, zodat vlakken en fouten precies passen.

export const Abs = ({ x, y, w, h, s, children, className }) => (
  <div className={className} style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...s }}>
    {children}
  </div>
)

function Slot({ kleur = '#1c7c43' }) {
  return (
    <svg width="9" height="10" viewBox="0 0 9 10" style={{ marginRight: 4, flex: 'none' }}>
      <rect x="0.5" y="4" width="8" height="5.5" rx="1" fill={kleur} />
      <path d="M2.3 4V3a2.2 2.2 0 0 1 4.4 0v1" fill="none" stroke={kleur} strokeWidth="1.2" />
    </svg>
  )
}

export function Browser({ url, veilig, children, bg = '#fff' }) {
  return (
    <div className="mk-browser" style={{ background: bg }}>
      <div className="mk-chrome">
        <span className="mk-dots">
          <i />
          <i />
          <i />
        </span>
        <div className="mk-url">
          {veilig ? <Slot /> : <span className="mk-onveilig">⚠ Niet veilig</span>}
          <span className="mk-url-tekst">{veilig ? url : `http://${url}`}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

const LANGE_TEKST =
  'Welkom op de officiële website van SV Kraaienburg! Onze club is opgericht met als doel het plezier in voetbal te bevorderen voor jong en oud in de regio. Wij bieden een breed scala aan teams, van de allerkleinsten tot onze veteranen, en wij geloven in de kracht van sport om mensen samen te brengen. Bij ons staan respect, sportiviteit en gezelligheid centraal. Of je nu een beginner bent of een ervaren speler, iedereen is welkom om deel uit te maken van onze voetbalfamilie. Neem gerust een kijkje op onze website om meer te weten te komen over onze teams, trainingen, activiteiten en nog veel meer…'

function Wapen() {
  return (
    <svg width="26" height="30" viewBox="0 0 26 30">
      <path d="M13 1 25 5v10c0 7-5 12-12 14C6 27 1 22 1 15V5z" fill="#c8102e" stroke="#111" strokeWidth="1.5" />
      <path d="M9 4v22M17 4v22" stroke="#fff" strokeWidth="3" />
      <circle cx="13" cy="15" r="5" fill="#fff" stroke="#111" strokeWidth="1.2" />
      <path d="M13 11.5l2 1.5-.8 2.4h-2.4L11 13z" fill="#111" />
    </svg>
  )
}

export function VoetbalSite({ versie }) {
  const ai = versie === 'ai'
  return (
    <Browser url="svkraaienburg.nl" veilig={!ai}>
      {/* navigatie 30–66 */}
      <Abs x={0} y={30} w={360} h={36} s={{ background: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
        <Wapen />
        <b style={{ fontSize: 13, letterSpacing: -0.2 }}>SV Kraaienburg</b>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#555', display: 'flex', gap: 10 }}>
          <span>Teams</span>
          <span>Uitslagen</span>
          <span>Contact</span>
        </span>
      </Abs>

      {/* hero 66–206 */}
      <Abs
        x={0}
        y={66}
        w={360}
        h={140}
        s={{
          background: 'repeating-linear-gradient(115deg, #c8102e 0 34px, #b30d28 34px 68px)',
          color: '#fff',
          padding: '18px 16px',
        }}
      >
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.85 }}>Sinds 1928</div>
        <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.05, marginTop: 4, letterSpacing: -0.5 }}>
          Samen voetballen
          <br />
          in Kraaienburg
        </div>
      </Abs>
      <Abs
        x={16}
        y={162}
        w={150}
        h={30}
        s={{
          background: ai ? '#ffe9a8' : '#ffd23f',
          color: ai ? '#fffbe9' : '#151515',
          borderRadius: 6,
          display: 'grid',
          placeItems: 'center',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: ai ? 'none' : '0 2px 0 #151515',
        }}
      >
        Word lid →
      </Abs>
      <Abs x={232} y={96} w={104} h={96}>
        <svg viewBox="0 0 104 96" width="104" height="96">
          <circle cx="52" cy="48" r="40" fill="#fff" />
          <path d="M52 22l14 10-5 17H43l-5-17z" fill="#111" />
          <path d="M52 22v-14M66 32l13-6M61 49l9 13M43 49l-9 13M38 32l-13-6" stroke="#111" strokeWidth="2" />
          <path d="M70 62l10 8M34 62l-10 8M52 8a40 40 0 0 1 0 0" stroke="#111" strokeWidth="2" />
        </svg>
      </Abs>

      {/* tekst 206–318 */}
      {ai ? (
        <Abs x={0} y={206} w={360} h={112} s={{ padding: '10px 14px', fontSize: 9.6, lineHeight: '12.6px', color: '#333', overflow: 'hidden', background: '#fff' }}>
          {LANGE_TEKST}
        </Abs>
      ) : (
        <Abs x={0} y={206} w={360} h={112} s={{ padding: '14px 16px', background: '#fff' }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Voetballen bij jou om de hoek.</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['Vanaf 5 jaar', 'Training di & do', '1e maand gratis'].map((t) => (
              <span key={t} style={{ fontSize: 11, fontWeight: 700, background: '#f3efe8', border: '1px solid #ddd5c6', borderRadius: 99, padding: '4px 9px' }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: '#444', marginTop: 10 }}>Kom gratis een keer meetrainen!</div>
        </Abs>
      )}

      {/* formulier 318–480 */}
      <Abs x={0} y={318} w={360} h={162} s={{ background: '#f6f4f0', borderTop: '3px solid #c8102e', padding: '10px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Inschrijven</div>
      </Abs>
      {['Naam', 'E-mailadres'].map((label, i) => (
        <Abs
          key={label}
          x={16}
          y={352 + i * 34}
          w={328}
          h={26}
          s={{ background: '#fff', border: '1px solid #cfc8bb', borderRadius: 5, fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', padding: '0 8px' }}
        >
          {label}
        </Abs>
      ))}
      {ai && (
        <Abs x={150} y={404} w={194} h={18} s={{ background: '#fff', border: '1px solid #e0a3a3', borderRadius: 4, fontSize: 9, color: '#b3261e', display: 'flex', alignItems: 'center', padding: '0 6px', boxShadow: '0 3px 8px rgba(0,0,0,.12)' }}>
          ⚠ Dit formulier is niet beveiligd
        </Abs>
      )}
      <Abs x={16} y={426} w={110} h={28} s={{ background: '#c8102e', color: '#fff', borderRadius: 5, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>
        Verstuur
      </Abs>
      {!ai && (
        <Abs x={136} y={428} w={210} h={26} s={{ fontSize: 9.5, color: '#1c7c43', display: 'flex', alignItems: 'center' }}>
          <Slot /> Versleuteld verstuurd · privacyverklaring
        </Abs>
      )}
    </Browser>
  )
}

export function Inlogpagina() {
  return (
    <Browser url="mijn.schoolportaal.nl/login" veilig={false} bg="#eef1f6">
      <Abs x={30} y={52} w={300} h={412} s={{ background: '#fff', borderRadius: 12, boxShadow: '0 6px 20px rgba(20,30,60,.12)' }} />
      <Abs x={50} y={72} w={260} h={28} s={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 24, height: 24, borderRadius: 6, background: '#2949c8', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>S</span>
        <b style={{ fontSize: 13, color: '#1d2440' }}>Schoolportaal</b>
      </Abs>
      <Abs x={50} y={110} w={260} h={28} s={{ fontSize: 21, fontWeight: 700, color: '#1d2440' }}>
        Inloggen
      </Abs>
      <Abs x={50} y={148} w={260} h={14} s={{ fontSize: 10, color: '#556' }}>
        Leerlingnummer
      </Abs>
      <Abs x={50} y={164} w={260} h={30} s={{ border: '1px solid #c9cfdc', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', padding: '0 10px', color: '#1d2440' }}>
        184522
      </Abs>
      <Abs x={50} y={204} w={260} h={14} s={{ fontSize: 10, color: '#556' }}>
        Wachtwoord
      </Abs>
      <Abs x={50} y={220} w={260} h={30} s={{ border: '1px solid #c9cfdc', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', padding: '0 10px', color: '#1d2440' }}>
        Welkom123
      </Abs>
      <Abs x={50} y={262} w={260} h={16} s={{ fontSize: 10.5, color: '#556', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 12, height: 12, border: '1px solid #9aa3b8', borderRadius: 3, background: '#2949c8' }} /> Onthoud mij
      </Abs>
      <Abs x={50} y={290} w={260} h={34} s={{ background: '#2949c8', borderRadius: 7, color: '#fff', fontWeight: 700, fontSize: 13, display: 'grid', placeItems: 'center' }}>
        Inloggen
      </Abs>
      <Abs x={50} y={338} w={260} h={54} s={{ background: '#fdecec', border: '1px solid #f3b6b6', borderRadius: 7, fontSize: 10, color: '#8a1c1c', padding: '7px 9px', lineHeight: 1.35 }}>
        Wachtwoord van leerling 184522 klopt niet.
        <br />
        Hint: het begint met ‘W’ en eindigt op ‘123’.
      </Abs>
      <Abs x={50} y={404} w={260} h={34} s={{ fontSize: 10, color: '#2949c8', lineHeight: 1.35 }}>
        Wachtwoord vergeten? Wij mailen je huidige wachtwoord naar je toe.
      </Abs>
    </Browser>
  )
}

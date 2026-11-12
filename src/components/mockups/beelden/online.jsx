// Illustraties: dingen die je online tegenkomt.
import { Abs, DISPLAY, MONO } from './basis.js'

// ---------- Klik alle verkeerslichten ----------
// Een eigen ontwerp van zo'n test, geen kopie van een bestaand product.
const T = 74
const TEGELS = [
  { gebouw: 22, licht: 'rood', gekozen: true },
  { boom: true },
  { gebouw: 40, boom: true },
  { boom: true, auto: true },
  { licht: 'groen', gekozen: true },
  { gebouw: 30, licht: 'oranje' },
  { auto: true },
  { gebouw: 46 },
  { boom: true, gebouw: 18 },
]
const LAMP = { rood: '#e5483d', oranje: '#f2b230', groen: '#35b46b' }

function Tegel({ t }) {
  return (
    <svg width={T} height={T} viewBox={`0 0 ${T} ${T}`} style={{ display: 'block' }}>
      <rect width={T} height={T} fill="#c3d6e7" />
      {t.gebouw && <rect x="6" y={T - 22 - t.gebouw} width="30" height={t.gebouw} fill="#b9b2a7" />}
      {t.gebouw && <rect x="40" y={T - 22 - t.gebouw * 0.7} width="24" height={t.gebouw * 0.7} fill="#9fa8b3" />}
      {t.boom && (
        <>
          <rect x="56" y="40" width="3" height="18" fill="#6b5a45" />
          <circle cx="57.5" cy="36" r="11" fill="#6a9a57" />
        </>
      )}
      <rect y={T - 22} width={T} height="22" fill="#878d96" />
      <rect x="8" y={T - 12} width="14" height="2" fill="#e8e8e8" />
      <rect x="34" y={T - 12} width="14" height="2" fill="#e8e8e8" />
      <rect x="60" y={T - 12} width="14" height="2" fill="#e8e8e8" />
      {t.auto && (
        <>
          <rect x="18" y={T - 30} width="34" height="12" rx="4" fill="#c4473a" />
          <rect x="24" y={T - 37} width="20" height="9" rx="3" fill="#c4473a" />
          <circle cx="26" cy={T - 18} r="4" fill="#2a2d31" />
          <circle cx="45" cy={T - 18} r="4" fill="#2a2d31" />
        </>
      )}
      {t.licht && (
        <>
          <rect x="36.5" y="34" width="3" height={T - 34} fill="#3b3f45" />
          <rect x="31" y="8" width="14" height="32" rx="3" fill="#2a2d31" />
          {['rood', 'oranje', 'groen'].map((kleur, i) => (
            <circle key={kleur} cx="38" cy={15 + i * 9} r="3.4" fill={LAMP[kleur]} opacity={t.licht === kleur ? 1 : 0.28} />
          ))}
        </>
      )}
    </svg>
  )
}

function Verkeerslichten() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#e4e9ef', fontFamily: DISPLAY }}>
      <Abs x={53} y={16} w={254} h={314} s={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 2px rgba(20,30,45,.08), 0 18px 36px -18px rgba(20,30,45,.35)', overflow: 'hidden' }}>
        <div style={{ background: '#2b3340', color: '#fff', padding: '11px 14px 12px' }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Selecteer alle vakjes met</div>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.15 }}>verkeerslichten</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, ${T}px)`, gap: 4, padding: 12, justifyContent: 'center' }}>
          {TEGELS.map((t, i) => (
            <div key={i} style={{ position: 'relative', width: T, height: T, background: '#fff' }}>
              <div style={{ transform: t.gekozen ? 'scale(0.84)' : 'none' }}>
                <Tegel t={t} />
              </div>
              {t.gekozen && (
                <span style={{ position: 'absolute', left: 2, top: 2, width: 20, height: 20, borderRadius: '50%', background: '#2b3340', display: 'grid', placeItems: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </Abs>
    </div>
  )
}

// Telefoon met rand en scherm; de onderkant loopt door achter het bijschrift.
function Telefoon({ x, y, w, h = 600, scherm, rand = '#1c1d21', r = 34, dik = 8, s, children }) {
  return (
    <Abs x={x} y={y} w={w} h={h} s={{ background: rand, borderRadius: r, padding: dik, boxShadow: '0 1px 2px rgba(20,20,30,.1), 0 22px 40px -20px rgba(20,20,30,.45)', ...s }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: r - dik, background: scherm, overflow: 'hidden' }}>
        {children}
      </div>
    </Abs>
  )
}

// ---------- De groene blokjes ----------
// Een groepsapp waarin vrienden hun uitslag van een woordspel delen.
const VAK = { g: '#5ea95a', y: '#e2b43c', x: '#d1d4d9' }
const BUBBEL = { padding: '8px 10px 10px', borderRadius: 14, boxShadow: '0 1px 1px rgba(30,30,40,.08)' }

function Uitslag({ score, rijen, eigen }) {
  return (
    <div style={{ ...BUBBEL, alignSelf: eigen ? 'flex-end' : 'flex-start', background: eigen ? '#e2dcf4' : '#fff', borderBottomRightRadius: eigen ? 4 : 14, borderBottomLeftRadius: eigen ? 14 : 4 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#2d2f36', marginBottom: 6 }}>
        Woordspel <span style={{ fontFamily: MONO, fontWeight: 500 }}>{score}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 14px)', gap: 3 }}>
        {rijen.join('').split('').map((c, i) => (
          <span key={i} style={{ width: 14, height: 14, borderRadius: 3, background: VAK[c] }} />
        ))}
      </div>
    </div>
  )
}

function GroeneBlokjes() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#e8e4f4', fontFamily: DISPLAY }}>
      <Telefoon x={62} y={14} w={236} scherm="#f2f1ef">
        {/* kop van de groepsapp */}
        <div style={{ height: 56, background: '#fff', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px 0', borderBottom: '1px solid #e4e2de' }}>
          <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true">
            <path d="M8 2L2 8l6 6" fill="none" stroke="#5a5d66" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#f0b48c', color: '#fff', fontSize: 14, fontWeight: 800, display: 'grid', placeItems: 'center' }}>V</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1f2128', lineHeight: 1 }}>Vrienden</span>
            <span style={{ width: 64, height: 4, borderRadius: 2, background: '#d9d6d0' }} />
          </span>
        </div>
        {/* berichten */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px' }}>
          <Uitslag score="4/6" rijen={['xxyxx', 'xgxyx', 'ggxxg', 'ggggg']} />
          <Uitslag score="3/6" rijen={['yxxgx', 'gggxg', 'ggggg']} eigen />
          <div style={{ ...BUBBEL, padding: '8px 11px', alignSelf: 'flex-start', background: '#fff', borderBottomLeftRadius: 4, fontSize: 13, color: '#2d2f36' }}>
            Niks verklappen!
          </div>
        </div>
      </Telefoon>
    </div>
  )
}

// ---------- Het Netflix-plaatje ----------
// Twee telefoons, dezelfde (verzonnen) serie, een ander plaatje. Geen echt merk.
function PlaatjeLandschap() {
  return (
    <svg width="124" height="176" viewBox="0 0 124 176" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="netflix-plaatje-lucht" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ee9a7c" />
          <stop offset="1" stopColor="#fbd7a8" />
        </linearGradient>
      </defs>
      <rect width="124" height="176" fill="url(#netflix-plaatje-lucht)" />
      <circle cx="82" cy="96" r="20" fill="#fff3dc" />
      <path d="M0 104 Q 30 90 60 100 T 124 98 V 120 H 0 Z" fill="#d98a7e" />
      <rect y="112" width="124" height="64" fill="#2f5d78" />
      <rect x="66" y="120" width="32" height="2.5" rx="1.2" fill="#f6c9a0" />
      <rect x="72" y="128" width="20" height="2.5" rx="1.2" fill="#f6c9a0" opacity=".7" />
      {/* eiland met vuurtoren */}
      <path d="M0 120 Q 10 98 30 94 Q 44 92 52 108 Q 58 116 62 124 H 0 Z" fill="#33463f" />
      <path d="M24 94 L 27 64 H 35 L 38 94 Z" fill="#f7f1e8" />
      <path d="M25.2 82 H 36.8 L 37.4 88 H 24.6 Z M 26.4 70 H 35.6 L 36.2 76 H 25.8 Z" fill="#c9524a" />
      <rect x="26" y="56" width="10" height="8" rx="1.5" fill="#33463f" />
      <rect x="28" y="58" width="6" height="5" fill="#ffe7a8" />
      <path d="M25 56 L 31 50 L 37 56 Z" fill="#c9524a" />
    </svg>
  )
}

function PlaatjeFiguur() {
  return (
    <svg width="124" height="176" viewBox="0 0 124 176" style={{ display: 'block' }}>
      <rect width="124" height="176" fill="#1b4a54" />
      {[[16, 22], [104, 30], [96, 12], [22, 60], [110, 76]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="#d6ecea" />
      ))}
      <circle cx="68" cy="84" r="46" fill="#f3dfa8" />
      {/* silhouet van opzij, van dichtbij */}
      <path d="M4 176 C 8 150 24 138 40 134 L 42 118 C 30 110 26 94 28 80 C 30 58 46 46 64 46 C 82 46 92 58 92 72 L 92 78 C 92 82 98 88 99 92 C 100 95 96 97 93 97 L 93 101 C 95 102 95 105 92 106 C 94 108 94 111 91 112 C 91 116 88 120 80 121 L 74 122 L 74 130 C 92 136 112 146 120 176 Z" fill="#0d1d22" />
    </svg>
  )
}

function StreamTelefoon({ x, wie, Plaatje }) {
  return (
    <>
      <Abs x={x} y={22} w={152} h={24} s={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#24313a' }}>
        {wie}
      </Abs>
      <Telefoon x={x} y={54} w={152} r={24} dik={6} rand="#111215" scherm="#17181c">
        <div style={{ display: 'flex', gap: 6, padding: '12px 10px 0' }}>
          {[20, 28, 24].map((b, i) => (
            <span key={i} style={{ width: b, height: 5, borderRadius: 3, background: i ? '#3a3c43' : '#8a8d96' }} />
          ))}
        </div>
        <div style={{ position: 'relative', margin: '12px 8px 0', borderRadius: 8, overflow: 'hidden' }}>
          <Plaatje />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '22px 8px 8px', background: 'linear-gradient(180deg, rgba(10,10,12,0), rgba(10,10,12,.75))', color: '#fff', fontSize: 16, fontWeight: 800, letterSpacing: 0.2, textAlign: 'center' }}>
            Het Eiland
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '9px 8px 0' }}>
          <span style={{ flex: 1, height: 22, borderRadius: 6, background: '#f2f2f4', display: 'grid', placeItems: 'center' }}>
            <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden="true"><path d="M1 1l7 4-7 4z" fill="#17181c" /></svg>
          </span>
          <span style={{ flex: 1, height: 22, borderRadius: 6, background: '#33353c', display: 'grid', placeItems: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 1v8M1 5h8" stroke="#c9cbd1" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </span>
        </div>
        <span style={{ display: 'block', width: 48, height: 5, borderRadius: 3, background: '#3a3c43', margin: '14px 8px 8px' }} />
        <div style={{ display: 'flex', gap: 6, padding: '0 8px' }}>
          {['#5c4a6b', '#7a5a3c', '#3f5f55'].map((k) => (
            <span key={k} style={{ width: 38, height: 54, borderRadius: 5, background: k }} />
          ))}
        </div>
      </Telefoon>
    </>
  )
}

function NetflixPlaatje() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#dde6e6', fontFamily: DISPLAY }}>
      <StreamTelefoon x={18} wie="Jij" Plaatje={PlaatjeLandschap} />
      <StreamTelefoon x={190} wie="Je vriend" Plaatje={PlaatjeFiguur} />
    </div>
  )
}

// ---------- Spotify Wrapped ----------
// Een jaaroverzicht als 'story': eigen kleuren, geen echt merk.
const PLUM = '#2b1640'
const TOP = [
  ['#ffd34e', 92, 58],
  ['#9fd8cf', 74, 46],
  ['#c4b5ff', 100, 64],
  ['#ff9f7a', 66, 40],
  ['#f2f0ea', 84, 52],
]

function SpotifyWrapped() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f6efd6', fontFamily: DISPLAY }}>
      <Telefoon x={52} y={14} w={256} rand="#1b1720" scherm="#f2577f">
        {/* vlakken op de achtergrond */}
        <span style={{ position: 'absolute', left: 150, top: 48, width: 150, height: 150, borderRadius: '50%', background: '#ffd34e' }} />
        <span style={{ position: 'absolute', left: 168, top: 128, width: 52, height: 52, borderRadius: '50%', background: '#c4b5ff' }} />
        {/* voortgang van de story */}
        <div style={{ position: 'absolute', left: 12, right: 12, top: 12, display: 'flex', gap: 4 }}>
          {[1, 1, 0, 0, 0].map((vol, i) => (
            <span key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: vol ? '#fff' : 'rgba(255,255,255,.45)' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 16, top: 26, color: PLUM, fontSize: 30, fontWeight: 800, lineHeight: 1.02, letterSpacing: -0.6 }}>
          Jouw jaar
          <br />
          in muziek
        </div>
        <div style={{ position: 'absolute', left: 16, top: 98, color: PLUM }}>
          <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1, letterSpacing: -1.5 }}>41.207</div>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 4 }}>minuten</div>
        </div>
        {/* top 5 */}
        <div style={{ position: 'absolute', left: 12, right: 12, top: 164, padding: '10px 12px', borderRadius: 12, background: PLUM, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#ffd34e', letterSpacing: 0.2 }}>Topnummers</span>
          {TOP.map(([hoes, titel, artiest], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, fontFamily: MONO, fontSize: 11, color: '#ffd34e' }}>{i + 1}</span>
              <span style={{ width: 16, height: 16, borderRadius: 3, background: hoes }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ width: titel, height: 5, borderRadius: 3, background: '#fff' }} />
                <span style={{ width: artiest, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.4)' }} />
              </span>
            </div>
          ))}
        </div>
      </Telefoon>
    </div>
  )
}

// ---------- De scheldende chatbot ----------
// Chatvenster van een verzonnen pakketbezorger, eigen kleur, geen echt merk.
const PETROL = '#17706b'

function Doos({ kleur, maat = 18 }) {
  return (
    <svg width={maat} height={maat} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7z" fill="none" stroke={kleur} strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M3.8 7.2 12 11.4l8.2-4.2M12 11.4v9.6M7.8 4.9l8.3 4.3" fill="none" stroke={kleur} strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  )
}

function ScheldendeChatbot() {
  const bot = { display: 'flex', alignItems: 'flex-end', gap: 7 }
  const avatar = { width: 26, height: 26, flex: 'none', borderRadius: '50%', background: '#d5ebe8', display: 'grid', placeItems: 'center' }
  const bubbel = { background: '#fff', border: '1px solid #e1e6e5', borderRadius: 14, borderBottomLeftRadius: 4 }
  const klant = { alignSelf: 'flex-end', background: PETROL, color: '#fff', fontSize: 14, padding: '9px 13px', borderRadius: 14, borderBottomRightRadius: 4 }
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f5e6db', fontFamily: DISPLAY }}>
      <Abs x={30} y={18} w={300} h={440} s={{ background: '#f3f5f5', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 2px rgba(40,30,20,.08), 0 18px 36px -18px rgba(40,30,20,.35)' }}>
        <div style={{ height: 58, background: PETROL, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center' }}>
            <Doos kleur={PETROL} />
          </span>
          <span style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>Pakketservice</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
          <div style={klant}>Waar is mijn pakket?</div>
          {/* een standaardantwoord, als grijze regels */}
          <div style={bot}>
            <span style={avatar}><Doos kleur={PETROL} maat={15} /></span>
            <span style={{ ...bubbel, padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[132, 104, 60].map((b) => (
                <span key={b} style={{ width: b, height: 5, borderRadius: 3, background: '#cdd3d2' }} />
              ))}
            </span>
          </div>
          <div style={klant}>Scheld eens!</div>
          <div style={bot}>
            <span style={avatar}><Doos kleur={PETROL} maat={15} /></span>
            <span style={{ ...bubbel, padding: '6px 16px 8px', fontSize: 32, fontWeight: 800, letterSpacing: 1.5, color: '#232c2b', lineHeight: 1.1 }}>#@%&amp;!</span>
          </div>
        </div>
      </Abs>
    </div>
  )
}

export const ONLINE = {
  'klik-verkeerslichten': Verkeerslichten,
  'groene-blokjes': GroeneBlokjes,
  'netflix-plaatje': NetflixPlaatje,
  'spotify-wrapped': SpotifyWrapped,
  'scheldende-chatbot': ScheldendeChatbot,
}

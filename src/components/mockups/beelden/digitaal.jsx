// Illustraties: software, servers en beveiliging.
import { Abs, DISPLAY, MONO } from './basis.js'

// ---------- De blauwe schermen (juli 2024) ----------
const SCHERMEN = [
  [24, 84, 150, 100],
  [186, 84, 150, 100],
  [24, 198, 150, 100],
  [186, 198, 150, 100],
]

function BlauweSchermen() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #e4e7eb 0%, #e4e7eb 68%, #c9ced5 68%)', fontFamily: DISPLAY }}>
      {/* bewegwijzering, zoals op een vliegveld */}
      <Abs x={24} y={22} w={312} h={40} s={{ background: '#23272e', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', color: '#f6c343' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" fill="#f6c343" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Vertrek</span>
        <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 11, color: '#c9ced5' }}>Gates D1–D12 →</span>
      </Abs>
      {/* ophangbalk */}
      <Abs x={0} y={72} w={360} h={4} s={{ background: '#9aa1aa' }} />
      {SCHERMEN.map(([x, y, w, h], i) => (
        <Abs key={i} x={x} y={y} w={w} h={h} s={{ background: '#1b1d21', borderRadius: 6, padding: 5, boxShadow: '0 10px 20px -12px rgba(0,0,0,.5)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 2, background: '#0f56b8', color: '#fff', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 300, lineHeight: 1 }}>:(</span>
            <span style={{ height: 4, width: '86%', borderRadius: 2, background: 'rgba(255,255,255,.8)' }} />
            <span style={{ height: 4, width: '64%', borderRadius: 2, background: 'rgba(255,255,255,.8)' }} />
            <span style={{ marginTop: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ width: 16, height: 16, background: '#fff', opacity: 0.85 }} />
              <span style={{ height: 3, width: 46, borderRadius: 2, background: 'rgba(255,255,255,.6)' }} />
            </span>
          </div>
        </Abs>
      ))}
    </div>
  )
}

// ---------- De halve seconde ----------
// Een rij serverkasten: in één server zit een deurtje dat er niet hoort.
const UNITS = [22, 22, 32, 22, 56, 22, 32, 22]
const LED = ['#5fd08f', '#5fd08f', '#f2b230', '#5fd08f', '#5fd08f', '#59606b']

function Rek({ x, w, nr, kast, unit, rand, deur }) {
  const ux = x + 12
  const breed = w - 24
  let y = 32
  return (
    <g>
      <rect x={x} y="20" width={w} height="282" rx="8" fill={kast} />
      {UNITS.map((h, i) => {
        const top = y
        y += h + 4
        const lampjes = [0, 1].map((k) => (
          <circle key={k} cx={ux + breed - 14 - k * 8} cy={top + 9} r="2.2" fill={LED[(i * 2 + k + nr * 3) % LED.length]} />
        ))
        return (
          <g key={i}>
            <rect x={ux} y={top} width={breed} height={h} rx="3" fill={unit} />
            <rect x={ux + 3} y={top + 3} width="4" height={h - 6} rx="1" fill={rand} />
            <rect x={ux + breed - 7} y={top + 3} width="4" height={h - 6} rx="1" fill={rand} />
            {h === 22 &&
              [0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={ux + 14 + k * 6} y={top + 6} width="3" height="10" rx="1" fill={rand} />)}
            {h === 32 &&
              Array.from({ length: Math.floor((breed - 50) / 26) }, (_, k) => (
                <g key={k}>
                  <rect x={ux + 14 + k * 26} y={top + 5} width="22" height={h - 10} rx="2" fill={rand} />
                  <circle cx={ux + 31 + k * 26} cy={top + 10} r="1.6" fill={LED[(k + i) % 2]} />
                </g>
              ))}
            {h === 56 &&
              [0, 1, 2].map((r) =>
                [0, 1, 2, 3, 4, 5].map((k) => <rect key={`${r}-${k}`} x={ux + 14 + k * 6} y={top + 9 + r * 13} width="3" height="10" rx="1" fill={rand} />),
              )}
            {lampjes}
            {deur && h === 56 && (
              <g>
                {/* licht achter het deurtje, dat op een kier staat */}
                <rect x={ux + 72} y={top + 8} width="34" height="40" rx="2" fill="#f4c95d" />
                <path d={`M${ux + 72} ${top + 8} L${ux + 97} ${top + 4} L${ux + 97} ${top + 52} L${ux + 72} ${top + 48} Z`} fill="#5b6370" />
                <path d={`M${ux + 76} ${top + 13} L${ux + 93} ${top + 10.5} L${ux + 93} ${top + 45.5} L${ux + 76} ${top + 43} Z`} fill="none" stroke="#4c535e" strokeWidth="1.5" />
                <circle cx={ux + 90} cy={top + 29} r="2" fill="#d5dae0" />
              </g>
            )}
          </g>
        )
      })}
    </g>
  )
}

function HalveSeconde() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <rect width="360" height="480" fill="#dde3e0" />
      {/* verhoogde vloer met tegels */}
      <rect y="302" width="360" height="178" fill="#c5ccc9" />
      {[318, 342, 374, 416, 468].map((y) => (
        <rect key={y} y={y} width="360" height="1.5" fill="#b3bbb8" />
      ))}
      {[-300, -160, -20, 120, 240, 380, 520, 660].map((x) => (
        <line key={x} x1={180 + (x - 180) * 0.3} y1="302" x2={x} y2="480" stroke="#b3bbb8" strokeWidth="1.5" />
      ))}
      <rect x="-70" y="302" width="500" height="8" fill="#b7bebb" />
      <Rek x={-66} w={120} nr={1} kast="#464c56" unit="#565d68" rand="#4c525c" />
      <Rek x={306} w={120} nr={2} kast="#464c56" unit="#565d68" rand="#4c525c" />
      <Rek x={80} w={200} nr={0} kast="#262a31" unit="#3b414b" rand="#30353d" deur />
    </svg>
  )
}

// ---------- De code van Google ----------
// Een stapel codevensters: er komt steeds meer code bij.
const SYNTAX = {
  donker: { romp: '#1f232c', kop: '#2a2f3a', stip: '#454c5b', nr: '#4c5466', kw: '#c3a6ff', fn: '#7ed6b7', str: '#ebc47f', num: '#f39b86', tx: '#b2bacb', co: '#465063' },
  licht: { romp: '#fdfcf9', kop: '#ebe8e0', stip: '#d1cdc3', nr: '#bdb9ae', kw: '#7d4fd8', fn: '#1d8f6c', str: '#c0831f', num: '#c8553d', tx: '#4b5262', co: '#d6d2c8' },
}
// [inspringing, [lengte, soort], ...]
const CODE = [
  [0, [24, 'kw'], [46, 'fn'], [16, 'tx']],
  [1, [30, 'tx'], [10, 'tx'], [42, 'str']],
  [1, [20, 'kw'], [28, 'tx'], [14, 'num']],
  [2, [36, 'fn'], [22, 'tx']],
  [2, [24, 'tx'], [52, 'str']],
  [1, [18, 'kw'], [30, 'tx']],
  [0],
  [0, [70, 'co']],
  [0, [24, 'kw'], [38, 'fn'], [22, 'tx']],
  [1, [28, 'tx'], [12, 'tx'], [30, 'num']],
  [1, [20, 'kw'], [46, 'fn']],
  [2, [34, 'tx'], [28, 'str']],
]

function Venster({ thema, start }) {
  const k = SYNTAX[thema]
  return (
    <g>
      <rect y="8" width="224" height="222" rx="10" fill="rgba(70,50,30,.16)" />
      <rect width="224" height="222" rx="10" fill={k.romp} />
      <path d="M0 10a10 10 0 0 1 10-10h204a10 10 0 0 1 10 10v16H0z" fill={k.kop} />
      {[14, 26, 38].map((x) => (
        <circle key={x} cx={x} cy="13" r="3.4" fill={k.stip} />
      ))}
      <rect x="58" y="9" width="46" height="8" rx="4" fill={k.stip} />
      <rect x="215" y="36" width="3" height="12" rx="1.5" fill={k.stip} />
      {CODE.map(([insp, ...stukken], i) => {
        const y = 44 + i * 15
        let x = 40 + insp * 14
        return (
          <g key={i}>
            <text x="30" y={y + 3} textAnchor="end" fontFamily={MONO} fontSize="8" fill={k.nr}>
              {start + i}
            </text>
            {stukken.map(([lengte, soort], j) => {
              const blok = <rect key={j} x={x} y={y - 2.5} width={lengte} height="5" rx="2.5" fill={k[soort]} />
              x += lengte + 5
              return blok
            })}
          </g>
        )
      })}
    </g>
  )
}

// achterste eerst: elk volgend venster schuift naar links en omlaag
const STAPEL = [
  ['donker', 4120],
  ['licht', 3388],
  ['donker', 2614],
  ['licht', 1907],
  ['donker', 1263],
  ['licht', 512],
  ['donker', 87],
  ['licht', 1],
]

function CodeVanGoogle() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <rect width="360" height="480" fill="#efe7da" />
      {STAPEL.map(([thema, start], i) => {
        const k = STAPEL.length - 1 - i
        return (
          <g key={start} transform={`translate(${18 + k * 16} ${104 - k * 13})`}>
            <Venster thema={thema} start={start} />
          </g>
        )
      })}
    </svg>
  )
}

// ---------- Het telefoontje ----------
// Een casino waar niets meer werkt: schermen en lampjes uit.
function Gokkast({ x, storing, hendel }) {
  return (
    <g transform={`translate(${x} 58)`}>
      <rect x="2" y="234" width="88" height="10" rx="5" fill="rgba(0,0,0,.28)" />
      {hendel && (
        <g>
          <rect x="90" y="96" width="8" height="26" rx="3" fill="#6b5a50" />
          <rect x="95" y="52" width="3.5" height="56" rx="1.7" fill="#b9b3ad" />
          <circle cx="96.7" cy="50" r="6" fill="#c2404f" />
        </g>
      )}
      {/* bovenbord, lampjes uit */}
      <rect x="4" y="0" width="84" height="40" rx="12" fill="#d3ad5b" />
      <rect x="12" y="8" width="68" height="20" rx="6" fill="#3a2a30" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <circle key={k} cx={20 + k * 10.4} cy="18" r="2.6" fill="#65544b" />
      ))}
      {/* kast */}
      <rect x="0" y="34" width="92" height="204" rx="10" fill="#a23447" />
      <rect x="78" y="34" width="14" height="204" rx="7" fill="#8a2a3c" />
      {/* scherm */}
      <rect x="9" y="48" width="70" height="80" rx="7" fill="#2b1f26" />
      <rect x="14" y="53" width="60" height="70" rx="4" fill="#141518" />
      {storing ? (
        <g>
          <path d="M44 66 l10 17 h-20 z" fill="none" stroke="#ff8577" strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="43" y="71.5" width="2" height="6" rx="1" fill="#ff8577" />
          <circle cx="44" cy="80" r="1.2" fill="#ff8577" />
          <text x="44" y="104" textAnchor="middle" fontFamily={MONO} fontSize="9.5" fontWeight="600" fill="#ff8577">
            STORING
          </text>
        </g>
      ) : (
        <g>
          <rect x="33" y="57" width="1.5" height="62" fill="#212329" />
          <rect x="53.5" y="57" width="1.5" height="62" fill="#212329" />
        </g>
      )}
      {/* knoppen */}
      <path d="M4 138 H84 L90 154 H-2 Z" fill="#d3ad5b" />
      {[12, 34, 56].map((bx) => (
        <rect key={bx} x={bx} y="143" width="18" height="6" rx="3" fill="#8a7559" />
      ))}
      {/* onderpaneel met muntbak */}
      <rect x="9" y="164" width="70" height="44" rx="6" fill="#8a2a3c" />
      <path d="M44 172 l4.5 9 l10 1.5 l-7.2 7 l1.7 10 l-9 -4.7 l-9 4.7 l1.7 -10 l-7.2 -7 l10 -1.5 z" fill="#b9454f" />
      <rect x="22" y="216" width="48" height="12" rx="3" fill="#2b1f26" />
    </g>
  )
}

function HetTelefoontje() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <rect width="360" height="480" fill="#3a2c43" />
      {[0, 80, 160, 240, 320].map((x) => (
        <rect key={x} x={x} y="0" width="40" height="272" fill="#3f304a" />
      ))}
      <rect width="360" height="16" fill="#2c2133" />
      {/* tapijt */}
      <rect y="272" width="360" height="208" fill="#5c1d2b" />
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 10 }, (_, c) => {
          const x = c * 40 + (r % 2) * 20
          const y = 288 + r * 26
          return <path key={`${r}-${c}`} d={`M${x} ${y - 5} l5 5 l-5 5 l-5 -5z`} fill="#7a2b3a" />
        }),
      )}
      <Gokkast x={28} />
      <Gokkast x={134} storing />
      <Gokkast x={240} hendel />
      {/* bordje op de grond */}
      <g transform="translate(18 222)">
        <rect x="8" y="94" width="6" height="10" rx="2" fill="#2a2220" />
        <rect x="80" y="94" width="6" height="10" rx="2" fill="#2a2220" />
        <path d="M14 0 H80 L90 98 H4 Z" fill="#f2c230" stroke="#f2c230" strokeWidth="8" strokeLinejoin="round" />
        <rect x="38" y="6" width="18" height="6" rx="3" fill="#c99d1c" />
        <path d="M47 24 l11 19 h-22 z" fill="none" stroke="#2a2220" strokeWidth="2.6" strokeLinejoin="round" />
        <rect x="46" y="30" width="2" height="7" rx="1" fill="#2a2220" />
        <circle cx="47" cy="40" r="1.3" fill="#2a2220" />
        <text x="47" y="66" textAnchor="middle" fontFamily={DISPLAY} fontSize="14" fontWeight="800" fill="#2a2220">
          Buiten
        </text>
        <text x="47" y="82" textAnchor="middle" fontFamily={DISPLAY} fontSize="14" fontWeight="800" fill="#2a2220">
          gebruik
        </text>
      </g>
    </svg>
  )
}

// ---------- De nepmail ----------
// Een rustige inbox, met daaromheen een zee van verdachte mails.
// [x, y, hoek, schaal, soort]
const ENVELOPPEN = [
  [30, 40, -14, 1, 'uit'], [80, 84, 10, 0.8, 'haak'], [24, 122, 8, 1.1, 'uit'], [72, 162, -18, 0.9, 'uit'],
  [30, 206, 12, 1, 'haak'], [78, 248, -6, 0.85, 'uit'], [26, 292, -10, 1.1, 'uit'], [74, 328, 14, 0.9, 'haak'],
  [30, 372, 6, 1, 'uit'], [82, 410, -12, 1, 'uit'], [36, 452, 10, 1, 'haak'],
  [332, 32, 12, 0.9, 'uit'], [284, 70, -8, 1.05, 'uit'], [334, 114, -16, 1, 'haak'], [282, 152, 14, 0.85, 'uit'],
  [330, 196, 6, 1.1, 'uit'], [286, 240, -14, 0.9, 'haak'], [334, 282, 10, 1, 'uit'], [288, 320, -6, 1.05, 'uit'],
  [330, 366, 16, 0.9, 'haak'], [286, 410, -10, 1, 'uit'], [332, 452, 8, 1, 'uit'],
  [140, 14, -6, 0.75, 'uit'], [222, 16, 10, 0.7, 'haak'], [140, 372, 8, 1, 'uit'], [210, 384, -12, 0.9, 'uit'],
  [168, 440, 4, 1.1, 'haak'], [236, 458, -6, 1, 'uit'],
]
// verder weg: kleinere, vagere mails
const VER = Array.from({ length: 34 }, (_, i) => [(i * 97 + 20) % 380, 10 + ((i * 53) % 470), ((i * 37) % 50) - 25])
const MAILS = [
  ['M', '#7bb98f', 58, 86],
  ['J', '#b28ad6', 44, 72],
  ['S', '#e0a458', 66, 90],
  ['K', '#e07a8f', 50, 78],
  ['L', '#5fb3b0', 62, 68],
  ['R', '#9aa5d6', 42, 84],
]

function Envelop({ x, y, hoek, schaal, soort, vaag }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${hoek}) scale(${schaal})`} opacity={vaag ? 0.22 : 1}>
      <rect x="-22" y="-15" width="44" height="30" rx="4" fill="#f6f1e8" />
      <path d="M-20 -13 L0 2 L20 -13" fill="none" stroke="#d3c9b9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {soort === 'uit' && (
        <g>
          <circle cx="19" cy="-13" r="7.5" fill="#e5483d" />
          <rect x="18" y="-17.5" width="2" height="5.5" rx="1" fill="#fff" />
          <circle cx="19" cy="-9" r="1.2" fill="#fff" />
        </g>
      )}
      {soort === 'haak' && (
        <path d="M0 -44 V 2 a 6 6 0 0 1 -12 0 v -5 l 3 3" fill="none" stroke="#1f2328" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </g>
  )
}

function DeNepmail() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#3d5c63', fontFamily: DISPLAY }}>
      <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
        {VER.map(([x, y, hoek]) => (
          <Envelop key={`${x}-${y}`} x={x} y={y} hoek={hoek} schaal={0.6} vaag />
        ))}
        {ENVELOPPEN.map(([x, y, hoek, schaal, soort]) => (
          <Envelop key={`${x}-${y}`} x={x} y={y} hoek={hoek} schaal={schaal} soort={soort} />
        ))}
      </svg>
      <Abs x={106} y={34} w={148} h={294} s={{ background: '#15181d', borderRadius: 26, padding: 5, boxShadow: '0 24px 40px -18px rgba(0,0,0,.55)' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 21, background: '#fff', overflow: 'hidden', padding: '8px 10px 0', color: '#1d2127' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 12 }}>
            <span style={{ fontSize: 8, fontWeight: 700 }}>08:15</span>
            <span style={{ width: 34, height: 10, borderRadius: 5, background: '#15181d' }} />
            <span style={{ width: 14, height: 7, borderRadius: 2, border: '1px solid #1d2127', padding: 1 }}>
              <span style={{ display: 'block', width: '70%', height: '100%', borderRadius: 1, background: '#1d2127' }} />
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3, margin: '12px 0 6px' }}>Inbox</div>
          {MAILS.map(([letter, kleur, naam, onderwerp], i) => (
            <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderTop: '1px solid #eef0f2' }}>
              <span style={{ width: 24, height: 24, flex: 'none', borderRadius: '50%', background: kleur, color: '#fff', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center' }}>
                {letter}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ height: 5, width: naam, borderRadius: 3, background: '#2a2f36' }} />
                  {i < 2 && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2a8a6a' }} />}
                </span>
                <span style={{ height: 4, width: onderwerp, borderRadius: 2, background: '#c4c9d0' }} />
              </span>
            </div>
          ))}
        </div>
      </Abs>
    </div>
  )
}

export const DIGITAAL = {
  'blauwe-schermen': BlauweSchermen,
  'halve-seconde': HalveSeconde,
  'code-van-google': CodeVanGoogle,
  'het-telefoontje': HetTelefoontje,
  'de-nepmail': DeNepmail,
}

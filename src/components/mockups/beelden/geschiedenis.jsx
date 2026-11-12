// Illustraties: geschiedenis, kunst, tekst, zorg en games.
import { Abs, DISPLAY, SYMBOOL_FONT } from './basis.js'

// ---------- De schaakmatch (1997) ----------
// [kolom a–h, rij 1–8, stuk, zwart?]
const STAND = [
  ['a', 8, '♜', true], ['d', 8, '♛', true], ['f', 8, '♜', true], ['g', 8, '♚', true],
  ['a', 7, '♟', true], ['b', 7, '♟', true], ['e', 7, '♝', true], ['f', 7, '♟', true], ['g', 7, '♟', true], ['h', 7, '♟', true],
  ['c', 6, '♟', true], ['f', 6, '♞', true], ['d', 5, '♟', true],
  ['d', 4, '♟', false], ['c', 3, '♞', false], ['e', 3, '♟', false], ['f', 3, '♞', false], ['d', 3, '♝', false],
  ['a', 2, '♟', false], ['b', 2, '♟', false], ['f', 2, '♟', false], ['g', 2, '♟', false], ['h', 2, '♟', false],
  ['a', 1, '♜', false], ['d', 1, '♛', false], ['f', 1, '♜', false], ['g', 1, '♚', false],
]

function Schaakmatch() {
  const V = 32
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 35%, #2f3a35 0%, #1a1f1d 70%)' }}>
      <Abs x={44} y={34} w={272} h={272} s={{ background: '#5b3a24', borderRadius: 6, padding: 8, rotate: '-4deg', boxShadow: '0 24px 40px -16px rgba(0,0,0,.6)' }}>
        <div style={{ position: 'relative', width: V * 8, height: V * 8 }}>
          {Array.from({ length: 64 }, (_, i) => {
            const r = Math.floor(i / 8)
            const k = i % 8
            return (
              <div
                key={i}
                style={{ position: 'absolute', left: k * V, top: r * V, width: V, height: V, background: (r + k) % 2 ? '#b07a52' : '#ecd9b8' }}
              />
            )
          })}
          {STAND.map(([kol, rij, stuk, zwart]) => (
            <div
              key={`${kol}${rij}`}
              style={{
                position: 'absolute',
                left: (kol.charCodeAt(0) - 97) * V,
                top: (8 - rij) * V,
                width: V,
                height: V,
                display: 'grid',
                placeItems: 'center',
                fontFamily: SYMBOOL_FONT,
                fontSize: 27,
                lineHeight: 1,
                color: zwart ? '#1d1a17' : '#fbf8f1',
                WebkitTextStroke: zwart ? '0' : '0.8px #3a2a1a',
                textShadow: '0 2px 2px rgba(0,0,0,.25)',
              }}
            >
              {stuk}
              {'︎'}
            </div>
          ))}
        </div>
      </Abs>
    </div>
  )
}

// ---------- De Nachtwacht (2021) ----------
// Gestileerd schilderij, geen kopie. De stroken die in 1715 zijn afgeknipt
// hangen er weer aan: links breed, boven, onder en rechts smal, met een dunne naad.
const DOEK = { x: 34, y: 58, r: 326, o: 278 }
const NAAD = { x: 76, y: 72, r: 318, o: 269 }
// Achterste rij figuren: [x, hoofd-y, licht op het gezicht]
const ACHTERRIJ = [
  [92, 128, 0.35], [114, 118, 0.5], [148, 114, 0.4], [240, 118, 0.45], [264, 126, 0.55], [292, 118, 0.4], [308, 134, 0.3],
]
// Voorste rij donkere figuren: [x, hoofd-y, kraag?]
const VOORRIJ = [[96, 150, true], [152, 146, false], [262, 150, true], [296, 158, false]]

// Een figuur: mantel, kraag, gezicht en een hoed met rand.
function Figuur({ x, y, r = 7, lijf = '#1d140d', gezicht = '#a77b4b', licht = 1, breed = 1, kraag, hoed = '#120c08' }) {
  const s = 15 * breed
  return (
    <g>
      <path d={`M${x - s} 280 V ${y + 34} Q ${x - s} ${y + 12} ${x} ${y + 10} Q ${x + s} ${y + 12} ${x + s} ${y + 34} V 280 Z`} fill={lijf} />
      {kraag && <ellipse cx={x} cy={y + r + 3} rx={r * 1.35} ry={r * 0.45} fill={kraag} />}
      <circle cx={x} cy={y} r={r} fill={gezicht} opacity={licht} />
      <ellipse cx={x} cy={y - r * 0.7} rx={r * 1.75} ry={r * 0.38} fill={hoed} />
      <rect x={x - r * 0.85} y={y - r * 1.75} width={r * 1.7} height={r * 1.1} rx={r * 0.45} fill={hoed} />
    </g>
  )
}

function Nachtwacht() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="nachtwacht-muur" cx="0.5" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#e4ddd1" />
          <stop offset="1" stopColor="#c9bfb0" />
        </radialGradient>
        <linearGradient id="nachtwacht-doek" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d1f15" />
          <stop offset="0.75" stopColor="#21160e" />
          <stop offset="1" stopColor="#140d08" />
        </linearGradient>
        <radialGradient id="nachtwacht-licht" cx="0.45" cy="0.62" r="0.5">
          <stop offset="0" stopColor="#9a6a34" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9a6a34" stopOpacity="0" />
        </radialGradient>
        <clipPath id="nachtwacht-clip">
          <rect x={DOEK.x} y={DOEK.y} width={DOEK.r - DOEK.x} height={DOEK.o - DOEK.y} />
        </clipPath>
        <filter id="nachtwacht-schaduw" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#3a2c1c" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* zaal: muur, plint en vloer */}
      <rect width="360" height="480" fill="url(#nachtwacht-muur)" />
      <rect y="322" width="360" height="6" fill="#ece6dc" />
      <rect y="328" width="360" height="152" fill="#a98559" />
      {/* gouden lijst */}
      <g filter="url(#nachtwacht-schaduw)">
        <rect x="20" y="44" width="320" height="248" rx="2" fill="#b78a3c" />
      </g>
      <rect x="24" y="48" width="312" height="240" fill="#d6ad5c" />
      <rect x="29" y="53" width="302" height="230" fill="#9b7230" />
      {/* het doek */}
      <g clipPath="url(#nachtwacht-clip)">
        <rect x={DOEK.x} y={DOEK.y} width={DOEK.r - DOEK.x} height={DOEK.o - DOEK.y} fill="url(#nachtwacht-doek)" />
        <rect x={DOEK.x} y={DOEK.y} width={DOEK.r - DOEK.x} height={DOEK.o - DOEK.y} fill="url(#nachtwacht-licht)" />
        {/* boog en vaandel op de achtergrond */}
        <path d="M206 160 V 104 a 38 38 0 0 1 76 0 V 160 Z" fill="#3a2818" />
        <path d="M222 160 V 108 a 22 22 0 0 1 44 0 V 160 Z" fill="#2a1c12" />
        <path d="M244 64 L 244 112" stroke="#5a442c" strokeWidth="2" />
        <path d="M244 66 h 26 l -4 9 l 4 9 h -26 Z" fill="#6b5234" />
        {/* lansen */}
        {[
          [70, 236, 100, 64],
          [118, 230, 86, 74],
          [196, 228, 222, 66],
          [276, 238, 312, 70],
          [300, 236, 286, 62],
        ].map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${x2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5c452d" strokeWidth="2" strokeLinecap="round" />
        ))}
        {/* achterste rij */}
        {ACHTERRIJ.map(([x, y, licht]) => (
          <Figuur key={`a${x}`} x={x} y={y} r={6} lijf="#24180f" licht={licht} breed={0.9} />
        ))}
        {/* figuren op de strook links: ze lopen gewoon door */}
        <Figuur x={48} y={138} r={7} lijf="#211610" licht={0.4} kraag="#6f6250" />
        <Figuur x={66} y={168} r={6} lijf="#2a1c12" licht={0.35} breed={0.75} />
        {/* voorste rij */}
        {VOORRIJ.map(([x, y, kraag]) => (
          <Figuur key={`v${x}`} x={x} y={y} lijf="#1a110b" licht={0.7} kraag={kraag ? '#8d7d63' : undefined} />
        ))}
        {/* het meisje in het licht */}
        <path d="M118 280 C 118 210, 124 188, 132 188 C 140 188, 146 210, 146 280 Z" fill="#e2c07a" />
        <path d="M127 280 C 127 216, 129 198, 132 198 C 135 198, 137 216, 137 280 Z" fill="#efd8a2" />
        <circle cx="132" cy="178" r="7" fill="#f0dcae" />
        {/* twee hoofdfiguren: donker met witte kraag en rode sjerp, en licht met een pluim */}
        <Figuur x={180} y={146} r={9} lijf="#110b07" gezicht="#d8ad79" breed={1.35} kraag="#ece3cf" />
        <path d="M164 188 L 198 216 L 196 224 L 162 196 Z" fill="#a33d25" />
        <Figuur x={220} y={156} r={8} lijf="#d4ad62" gezicht="#e6c28c" breed={1.15} kraag="#f3e6c4" hoed="#c9a35a" />
        <path d="M214 204 C 214 190, 217 184, 220 182 C 223 184, 226 190, 226 204 L 226 280 L 214 280 Z" fill="#ecd39a" />
        <path d="M224 141 c 4 -9 14 -12 20 -6 c -6 0 -12 2 -16 8 Z" fill="#f4ead3" />
        {/* de teruggezette stroken: net iets andere toon en een dunne naad */}
        <path
          d={`M${DOEK.x} ${DOEK.y} H ${DOEK.r} V ${DOEK.o} H ${DOEK.x} Z M${NAAD.x} ${NAAD.y} V ${NAAD.o} H ${NAAD.r} V ${NAAD.y} Z`}
          fill="#e8c890"
          fillOpacity="0.1"
          fillRule="evenodd"
        />
        <rect x={NAAD.x} y={NAAD.y} width={NAAD.r - NAAD.x} height={NAAD.o - NAAD.y} fill="none" stroke="#e9cf9c" strokeOpacity="0.55" strokeWidth="1" />
      </g>
      {/* museumbordje */}
      <rect x="270" y="299" width="50" height="16" rx="1.5" fill="#faf8f4" />
      <rect x="276" y="304" width="30" height="2" rx="1" fill="#8d877d" />
      <rect x="276" y="309" width="20" height="2" rx="1" fill="#bdb6aa" />
    </svg>
  )
}

// ---------- De AI-detector (2023) ----------
// Een eigen, neutrale webtool. Het citaat staat er modern in, niet als oud document.
const DETECTOR_ROOD = '#c4362c'

function AiDetector({ data = {} }) {
  const citaat = data.citaat ?? 'We the People of the United States, in Order to form a more perfect Union…'
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#e9e6e1', fontFamily: DISPLAY, color: '#1f2125' }}>
      <Abs
        x={22}
        y={18}
        w={316}
        h={304}
        s={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(40,30,20,.08), 0 18px 36px -18px rgba(40,30,20,.35)' }}
      >
        {/* kop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, height: 46, padding: '0 14px', borderBottom: '1px solid #ecebe8' }}>
          <span style={{ width: 24, height: 24, borderRadius: 7, background: '#25272b', display: 'grid', placeItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="#fff" strokeWidth="2.6" />
              <path d="M15.2 15.2l5 5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>AI-detector</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: 2, background: '#b9b6b0' }} />
            ))}
          </span>
        </div>
        {/* tekstvak */}
        <div style={{ margin: '14px 14px 0', padding: '11px 12px 12px', border: '1px solid #dedbd5', borderRadius: 8, background: '#fcfbfa' }}>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.55, letterSpacing: -0.1 }}>
            <span style={{ background: '#f9dcd8', borderRadius: 3, padding: '1px 2px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{citaat}</span>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 9 }}>
            {['92%', '78%'].map((w) => (
              <span key={w} style={{ height: 6, width: w, borderRadius: 3, background: '#f3d4d0' }} />
            ))}
          </div>
        </div>
        {/* resultaat */}
        <div style={{ padding: '16px 14px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
            <span style={{ color: '#8b8780' }}>Mens</span>
            <span style={{ color: DETECTOR_ROOD }}>AI</span>
          </div>
          <div style={{ position: 'relative', height: 10, borderRadius: 5, background: '#ecebe8' }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: 5, background: DETECTOR_ROOD }} />
            <span style={{ position: 'absolute', right: -3, top: -4, width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: `0 0 0 3px ${DETECTOR_ROOD}, 0 2px 4px rgba(0,0,0,.2)` }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 18 }}>
            <span style={{ flex: 'none', width: 22, height: 22, borderRadius: 11, background: DETECTOR_ROOD, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800, marginTop: 1 }}>!</span>
            <span style={{ fontSize: 17, lineHeight: 1.25, fontWeight: 700, letterSpacing: -0.2, color: '#8f2219' }}>Waarschijnlijk volledig door AI geschreven</span>
          </div>
        </div>
      </Abs>
    </div>
  )
}

// ---------- Borstkanker opsporen (Zweden) ----------
// Een donkere viewer vol abstracte scans: heel veel, allemaal even rustig. Geen markeringen.
// Per rij dezelfde kant op, de volgende rij gespiegeld (zo lijkt niets op een doorgesneden bol).
const SCAN = { b: 36, h: 46, gat: 5, x: 18, y: 128, kolommen: 8, rijen: 7 }
const toeval = (n) => {
  const s = Math.sin(n * 91.17) * 10000
  return s - Math.floor(s)
}

// Eén scan: een zachte druppelvorm vanaf de zijkant, met een paar vage lijntjes weefsel.
function Scan({ x, y, n, links }) {
  const k = links ? 1 : -1
  const x0 = links ? x : x + SCAN.b
  const boven = y + 3 + toeval(n) * 4
  const onder = y + SCAN.h - 3 - toeval(n + 7) * 5
  const bol = (SCAN.b - 8) * (0.68 + toeval(n + 3) * 0.32)
  const hoog = onder - boven
  const tip = [x0 + k * bol * 0.9, boven + hoog * 0.62]
  const d = [
    `M${x0} ${boven}`,
    `C ${x0 + k * bol * 0.45} ${boven + 3}, ${x0 + k * bol} ${boven + hoog * 0.4}, ${x0 + k * bol * 0.88} ${boven + hoog * 0.74}`,
    `Q ${x0 + k * bol * 0.7} ${onder}, ${x0} ${onder} Z`,
  ].join(' ')
  return (
    <g>
      <rect x={x} y={y} width={SCAN.b} height={SCAN.h} rx="3" fill="#1b1f25" />
      <path d={d} fill={`url(#tumor-vinden-${links ? 'l' : 'r'})`} opacity={0.72 + toeval(n + 11) * 0.28} />
      {[0.22, 0.5, 0.8].map((t) => (
        <path
          key={t}
          d={`M${tip[0] - k * 3} ${tip[1]} Q ${x0 + k * bol * 0.45} ${boven + hoog * (t * 0.8 + 0.15)}, ${x0 + k * 2} ${boven + hoog * t}`}
          fill="none"
          stroke="#e6e9ec"
          strokeOpacity="0.22"
          strokeWidth="0.8"
        />
      ))}
    </g>
  )
}

const SCANS = Array.from({ length: SCAN.kolommen * SCAN.rijen }, (_, n) => {
  const rij = Math.floor(n / SCAN.kolommen)
  return { n, x: SCAN.x + (n % SCAN.kolommen) * (SCAN.b + SCAN.gat), y: SCAN.y + rij * (SCAN.h + SCAN.gat), links: rij % 2 === 0 }
})

function TumorVinden() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#121519', fontFamily: DISPLAY, color: '#e8eaed' }}>
      <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          {['l', 'r'].map((kant) => (
            <linearGradient key={kant} id={`tumor-vinden-${kant}`} x1={kant === 'l' ? 0 : 1} y1="0" x2={kant === 'l' ? 1 : 0} y2="0">
              <stop offset="0" stopColor="#c2c6cb" />
              <stop offset="0.6" stopColor="#8d939b" />
              <stop offset="1" stopColor="#5f656d" />
            </linearGradient>
          ))}
        </defs>
        {SCANS.map((scan) => (
          <Scan key={scan.n} {...scan} />
        ))}
      </svg>
      {/* werkbalk van de viewer */}
      <Abs x={0} y={0} w={360} h={44} s={{ background: '#0c0e11', borderBottom: '1px solid #23272e', display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: '#3a3f47' }} />
        ))}
        <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: '#c3c8cf' }}>Screening</span>
        <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginLeft: 'auto' }} aria-hidden="true">
          {[3, 10, 17].map((x) => [3, 10, 17].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="1" fill="#6b727c" />))}
        </svg>
      </Abs>
      {/* de uitkomst */}
      <Abs x={14} y={58} w={332} h={56} s={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1, color: '#f29bbb' }}>+29%</span>
        <span style={{ fontSize: 15, lineHeight: 1.2, fontWeight: 600, color: '#c3c8cf' }}>
          meer tumoren
          <br />
          gevonden
        </span>
      </Abs>
    </div>
  )
}

// ---------- Een blokjeswereld ----------
// Eigen isometrische blokjes (geen game-texturen): berg met sneeuw, grot, rivier en bomen.
// Cijfer = hoogte van de kolom, w = water, z = zand langs de rivier. Rij = i (naar rechtsvoor), teken = j (naar linksvoor).
const KAART = [
  '6787643333',
  '7898733333',
  '6898633333',
  '5676533333',
  '4554333333',
  'ww43333333',
  'zwwwz33333',
  '3zzwww3333',
  '3333zwww33',
  '33333zww33',
]
const N = KAART.length
const BOMEN = [[3, 8], [6, 8], [6, 6], [8, 0], [9, 4]]
// Zijvlakken die donker worden: de grotopening in de berg.
const GROT = new Set(['1,4,3', '1,4,4', '2,4,3', '2,4,4'])
const KLEUR = {
  gras: { boven: '#86bf60', links: '#9a6b45', rechts: '#80583a', rand: ['#78b055', '#679a48'] },
  aarde: { boven: '#a8774c', links: '#9a6b45', rechts: '#80583a' },
  steen: { boven: '#acb0b3', links: '#959a9f', rechts: '#7d8288' },
  sneeuw: { boven: '#f6f8f9', links: '#959a9f', rechts: '#7d8288', rand: ['#e8ecee', '#d3d8dc'] },
  zand: { boven: '#e8d7a0', links: '#d3c08a', rechts: '#bba873' },
  water: { boven: '#5d9fd3', links: '#4d8bc0', rechts: '#4078aa' },
  stam: { boven: '#8a6440', links: '#7a5634', rechts: '#62452a' },
  blad: { boven: '#5ea552', links: '#4e9145', rechts: '#427c3a' },
}
const ISO = { b: 32, h: 17, x: 180, y: 160 }
const iso = (i, j, z) => [ISO.x + ((i - j) * ISO.b) / 2, ISO.y + ((i + j) * ISO.b) / 4 - z * ISO.h]
const punten = (...p) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

// De drie zichtbare vlakken van een blok vanaf (i, j, z) met afmetingen (di, dj, dz).
function vlakken(i, j, z, di = 1, dj = 1, dz = 1) {
  return {
    boven: punten(iso(i, j, z + dz), iso(i + di, j, z + dz), iso(i + di, j + dj, z + dz), iso(i, j + dj, z + dz)),
    links: punten(iso(i, j + dj, z), iso(i + di, j + dj, z), iso(i + di, j + dj, z + dz), iso(i, j + dj, z + dz)),
    rechts: punten(iso(i + di, j, z), iso(i + di, j + dj, z), iso(i + di, j + dj, z + dz), iso(i + di, j, z + dz)),
  }
}

const teken = (i, j) => KAART[i]?.[j]
// Vaste grond (water telt niet mee, daar ligt de bodem op hoogte 2).
const grond = (i, j) => {
  const t = teken(i, j)
  if (t === undefined) return 0
  return t === 'w' ? 2 : t === 'z' ? 3 : Number(t)
}
const soort = (i, j, z, h) => {
  const t = teken(i, j)
  if (t === 'w') return z === 1 ? 'zand' : z === 0 ? 'steen' : 'aarde'
  if (z === h - 1) return t === 'z' ? 'zand' : h >= 8 ? 'sneeuw' : h >= 6 ? 'steen' : 'gras'
  if (z >= 3) return 'steen'
  return z >= 1 ? 'aarde' : 'steen'
}

// Bouw alle vlakken één keer op, van achter naar voor (schildersvolgorde).
function bouwWereld() {
  const v = []
  const blok = (i, j, z, di, dj, dz, kleur) => {
    const f = vlakken(i, j, z, di, dj, dz)
    v.push([f.boven, kleur.boven], [f.links, kleur.links], [f.rechts, kleur.rechts])
  }
  for (let d = 0; d <= 2 * (N - 1); d++) {
    for (let i = 0; i < N; i++) {
      const j = d - i
      if (j < 0 || j >= N) continue
      const h = grond(i, j)
      for (let z = 0; z < h; z++) {
        const k = KLEUR[soort(i, j, z, h)]
        const f = vlakken(i, j, z)
        if (z === h - 1) v.push([f.boven, k.boven])
        if (j + 1 >= N || grond(i, j + 1) <= z) {
          v.push([f.links, GROT.has(`${i},${j},${z}`) ? (z === 4 ? '#221d1a' : '#2c2622') : k.links])
          if (k.rand && z === h - 1) v.push([vlakken(i, j, z + 0.74, 1, 1, 0.26).links, k.rand[0]])
        }
        if (i + 1 >= N || grond(i + 1, j) <= z) {
          v.push([f.rechts, k.rechts])
          if (k.rand && z === h - 1) v.push([vlakken(i, j, z + 0.74, 1, 1, 0.26).rechts, k.rand[1]])
        }
      }
      if (teken(i, j) === 'w') {
        const f = vlakken(i, j, 2, 1, 1, 0.8)
        v.push([f.boven, KLEUR.water.boven])
        if (j + 1 >= N) v.push([f.links, KLEUR.water.links])
        if (i + 1 >= N) v.push([f.rechts, KLEUR.water.rechts])
      }
      if (BOMEN.some(([bi, bj]) => bi === i && bj === j)) {
        blok(i + 0.38, j + 0.38, h, 0.24, 0.24, 1.1, KLEUR.stam)
        blok(i + 0.06, j + 0.06, h + 1, 0.88, 0.88, 0.9, KLEUR.blad)
        blok(i + 0.24, j + 0.24, h + 1.9, 0.52, 0.52, 0.5, KLEUR.blad)
      }
    }
  }
  return v
}
const WERELD = bouwWereld()

function MinecraftWereld() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="minecraft-wereld-lucht" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe4ef" />
          <stop offset="1" stopColor="#eef4ef" />
        </linearGradient>
      </defs>
      <rect width="360" height="480" fill="url(#minecraft-wereld-lucht)" />
      {/* blokwolken */}
      <g fill="#fff" opacity="0.9">
        <rect x="26" y="52" width="64" height="12" rx="2" />
        <rect x="40" y="42" width="30" height="12" rx="2" />
        <rect x="270" y="74" width="62" height="12" rx="2" />
        <rect x="290" y="64" width="26" height="12" rx="2" />
      </g>
      {WERELD.map(([p, kleur], n) => (
        <polygon key={n} points={p} fill={kleur} stroke={kleur} strokeWidth="0.6" strokeLinejoin="round" />
      ))}
    </svg>
  )
}

export const GESCHIEDENIS = {
  schaakmatch: Schaakmatch,
  nachtwacht: Nachtwacht,
  'ai-detector': AiDetector,
  'tumor-vinden': TumorVinden,
  'minecraft-wereld': MinecraftWereld,
}

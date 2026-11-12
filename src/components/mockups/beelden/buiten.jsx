// Illustraties: buiten, verkeer, weer en ruimte.
import { Abs, DISPLAY, MONO } from './basis.js'

// ---------- De Marsrover ----------
function Marsrover() {
  const wiel = (x) => (
    <g key={x}>
      <circle cx={x} cy="282" r="13" fill="#3a3330" />
      <circle cx={x} cy="282" r="5" fill="#8c8580" />
    </g>
  )
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="mars-lucht" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efd3bf" />
          <stop offset="1" stopColor="#dda98a" />
        </linearGradient>
      </defs>
      <rect width="360" height="480" fill="url(#mars-lucht)" />
      {/* de aarde, heel ver weg, met het signaal */}
      <circle cx="306" cy="58" r="10" fill="#4f86c6" />
      <path d="M299 55c3-2 6-1 8 1M303 63c2 1 5 0 6-2" stroke="#e9f1fa" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M294 66 C 250 110, 225 150, 214 190" stroke="#5b3b2c" strokeWidth="1.6" strokeDasharray="2 6" strokeLinecap="round" fill="none" />
      <g transform="translate(232 108)">
        <rect width="64" height="22" rx="11" fill="#2d211c" />
        <text x="32" y="15" textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize="11">20+ min</text>
      </g>
      {/* heuvels en grond */}
      <path d="M0 214 Q 60 190 120 206 T 240 198 T 360 204 V 260 H 0 Z" fill="#c98663" />
      <path d="M0 236 Q 90 214 170 230 T 360 226 V 480 H 0 Z" fill="#b8633f" />
      <ellipse cx="290" cy="300" rx="46" ry="8" fill="#c97a52" />
      <ellipse cx="60" cy="330" rx="60" ry="10" fill="#c97a52" />
      {[
        [300, 262, 14, 9],
        [262, 318, 9, 6],
        [330, 340, 18, 11],
        [24, 280, 11, 7],
        [180, 330, 7, 5],
      ].map(([x, y, rx, ry]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#7d3a22" />
          <ellipse cx={x - rx * 0.3} cy={y - ry * 0.35} rx={rx * 0.45} ry={ry * 0.35} fill="#a0573a" />
        </g>
      ))}
      {/* sporen achter de rover */}
      <path d="M0 300 Q 40 296 78 292" stroke="#9c4f31" strokeWidth="3" strokeDasharray="4 5" fill="none" />
      <path d="M0 308 Q 40 304 78 300" stroke="#9c4f31" strokeWidth="3" strokeDasharray="4 5" fill="none" />
      {/* de rover */}
      <ellipse cx="148" cy="296" rx="84" ry="8" fill="#8e4128" opacity=".45" />
      <path d="M86 282 L 116 262 L 146 282 M 146 282 L 176 262 L 206 282" stroke="#5b5550" strokeWidth="4" fill="none" strokeLinejoin="round" />
      {[86, 146, 206].map(wiel)}
      <rect x="92" y="226" width="116" height="34" rx="4" fill="#ece8e0" />
      <rect x="92" y="226" width="116" height="8" rx="3" fill="#d6d0c4" />
      <rect x="102" y="240" width="30" height="12" rx="2" fill="#c9c2b5" />
      <rect x="140" y="240" width="22" height="12" rx="2" fill="#c9c2b5" />
      <path d="M80 236 L 94 228 L 94 252 L 80 248 Z" fill="#6b6560" />
      <rect x="196" y="166" width="5" height="62" fill="#d6d0c4" />
      <rect x="186" y="152" width="28" height="16" rx="3" fill="#ece8e0" />
      <circle cx="194" cy="160" r="3.2" fill="#2d211c" />
      <circle cx="206" cy="160" r="3.2" fill="#2d211c" />
      <path d="M176 226 v -14 a 10 10 0 0 1 10 -10" stroke="#d6d0c4" strokeWidth="3" fill="none" />
    </svg>
  )
}

// ---------- Code oranje ----------
// Kruin van rondjes die met de wind mee naar rechts waait (voet van de stam op 0,0)
const KRUIN = [[18, -100, 27], [44, -106, 23], [66, -97, 18], [84, -89, 11], [30, -80, 20], [56, -80, 15]]
const KRUIN_LICHT = [[12, -108, 16], [40, -114, 13]]
// windvlagen, een paar met een krul aan het eind
const VLAGEN = [
  'M14 222 C 50 212, 86 222, 120 214 c 12 -3, 14 -16, 4 -18 c -6 -1, -9 4, -6 8',
  'M196 244 C 232 234, 266 244, 302 236',
  'M118 296 C 160 286, 204 296, 246 288 c 12 -3, 14 -16, 4 -18 c -6 -1, -9 4, -6 8',
]
const BLAADJES = [
  [150, 206, 30, '#9cbc62'],
  [174, 222, -20, '#d1ae4e'],
  [262, 206, 50, '#9cbc62'],
  [326, 258, 10, '#d1ae4e'],
  [94, 254, -40, '#9cbc62'],
  [272, 280, 70, '#d1ae4e'],
]

function WindBoom({ x, y, s = 1, kleur, licht }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C 0 -32, 6 -60, 24 -86" stroke="#4a3b2f" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M5 -48 C 16 -58, 30 -62, 46 -62" stroke="#4a3b2f" strokeWidth="4" fill="none" strokeLinecap="round" />
      {KRUIN.map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} fill={kleur} />
      ))}
      {KRUIN_LICHT.map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} fill={licht} />
      ))}
    </g>
  )
}

function CodeOranje() {
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: DISPLAY }}>
      <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="code-oranje-lucht" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#535d69" />
            <stop offset="0.6" stopColor="#a3acb4" />
          </linearGradient>
        </defs>
        <rect width="360" height="480" fill="url(#code-oranje-lucht)" />
        {/* donkere wolken */}
        <path d="M-10 70 C 20 40, 70 44, 92 62 C 120 36, 180 40, 196 68 C 230 50, 290 54, 300 80 C 330 70, 370 80, 370 100 V -10 H -10 Z" fill="#434d58" />
        <path d="M-10 196 C 26 178, 66 186, 84 200 C 108 182, 150 186, 162 204 Z" fill="#8c959e" />
        <path d="M196 200 C 224 182, 270 186, 284 204 C 306 194, 350 198, 370 210 V 214 H 196 Z" fill="#8c959e" />
        {/* polder met boerderij en bomenrij aan de horizon */}
        <rect y="268" width="360" height="212" fill="#809c5a" />
        {[24, 40, 54, 70, 228, 244, 258, 330, 346].map((x) => (
          <ellipse key={x} cx={x + 4} cy="262" rx="11" ry="7" transform={`rotate(12 ${x + 4} 262)`} fill="#6d8566" />
        ))}
        <path d="M120 268 V 252 L 138 238 L 156 252 V 268 Z" fill="#6c757b" />
        <path d="M156 268 V 254 H 186 V 268 Z" fill="#7b8489" />
        <path d="M0 300 Q 180 288 360 300 V 480 H 0 Z" fill="#6d8b4b" />
        {/* bomen in de storm */}
        <WindBoom x={196} y={286} s={0.6} kleur="#5c8452" licht="#6b945c" />
        <WindBoom x={40} y={316} s={0.95} kleur="#4c7743" licht="#5c8a50" />
        <WindBoom x={282} y={322} s={1.05} kleur="#466f3e" licht="#56814b" />
        {/* wind en wegwaaiende blaadjes */}
        {VLAGEN.map((d) => (
          <path key={d} d={d} stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".75" />
        ))}
        {BLAADJES.map(([x, y, hoek, kleur]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="6" ry="3" transform={`rotate(${hoek} ${x} ${y})`} fill={kleur} />
        ))}
      </svg>
      {/* de waarschuwing in een weer-app */}
      <Abs x={30} y={34} w={300} s={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 2px rgba(20,25,35,.12), 0 18px 36px -16px rgba(20,25,35,.55)' }}>
        <div style={{ background: '#f5a623', color: '#2a1d00', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5 L 21.5 20 H 2.5 Z" fill="#2a1d00" stroke="#2a1d00" strokeWidth="2" strokeLinejoin="round" />
            <rect x="11" y="9" width="2" height="6.5" rx="1" fill="#f5a623" />
            <circle cx="12" cy="17.6" r="1.2" fill="#f5a623" />
          </svg>
          <span style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.3 }}>Code oranje</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 12px' }}>
          <span style={{ width: 44, height: 44, flex: 'none', borderRadius: 12, background: '#fdf0d8', display: 'grid', placeItems: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#a96500" strokeWidth="2" strokeLinecap="round">
              <path d="M3 8.5h10.5a3 3 0 1 0-3-3" />
              <path d="M3 12.5h15a3 3 0 1 1-3 3" />
              <path d="M3 16.5h7" />
            </svg>
          </span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1d2126', lineHeight: 1.2 }}>Zware windstoten</div>
            <div style={{ fontSize: 13, color: '#6b7078', marginTop: 2 }}>Morgen</div>
          </div>
        </div>
        {/* schaal geel, oranje, rood */}
        <div style={{ display: 'flex', gap: 5, padding: '2px 16px 16px' }}>
          {['#f3d23e', '#f5a623', '#de4b3e'].map((kleur, i) => (
            <span key={kleur} style={{ flex: 1, height: 6, borderRadius: 3, background: kleur, opacity: i === 1 ? 1 : 0.28 }} />
          ))}
        </div>
      </Abs>
    </div>
  )
}

// ---------- Het onleesbare adres ----------
// Kriebelhandschrift: l = hoge lus, g = staart, e = lusje, n = boogje, spatie = nieuw woord
// Vaste 'toevalsgetallen' tussen 0 en 1, zodat het handschrift elke keer hetzelfde is
const toeval = (i) => {
  const v = Math.sin(i * 12.9898) * 43758.5453
  return v - Math.floor(v)
}

function kriebel(x, y, tekst) {
  let d = ''
  let px = x
  let nieuw = true
  Array.from(tekst).forEach((c, i) => {
    if (c === ' ') {
      px += 8
      nieuw = true
      return
    }
    const r = toeval(x + y + i)
    const h = { l: 17, g: -13, e: 7, n: 7 }[c] * (0.7 + r * 0.6)
    const lus = (c === 'n' ? 0.6 : c === 'e' ? 1.9 : 3) * (0.7 + r * 0.7)
    const breed = 1.05 + r * 0.45
    for (let s = nieuw ? 0 : 1; s <= 12; s++) {
      const t = (s / 12) * Math.PI * 2
      const hoog = (h * (1 - Math.cos(t))) / 2
      const lx = px + breed * t + lus * Math.sin(t) + hoog * (0.2 + r * 0.25)
      const ly = y - hoog + Math.sin((px + breed * t - x) / 14) * 1.6
      d += `${s === 0 ? 'M' : 'L'}${lx.toFixed(1)} ${ly.toFixed(1)} `
    }
    px += breed * Math.PI * 2
    nieuw = false
  })
  return d
}

// Hulstblad met stekelige randen, van 0,0 tot 36,0
function hulstblad() {
  const L = 36
  const B = 11
  const rand = (f) => Math.sin(f * Math.PI) * B
  const punten = [0, 0.25, 0.5, 0.75, 1]
  let d = 'M0 0'
  for (let i = 1; i < punten.length; i++) {
    const m = (punten[i - 1] + punten[i]) / 2
    d += ` Q${(m * L).toFixed(1)} ${(-rand(m) * 0.45).toFixed(1)} ${(punten[i] * L).toFixed(1)} ${(-rand(punten[i])).toFixed(1)}`
  }
  for (let i = punten.length - 2; i >= 0; i--) {
    const m = (punten[i + 1] + punten[i]) / 2
    d += ` Q${(m * L).toFixed(1)} ${(rand(m) * 0.45).toFixed(1)} ${(punten[i] * L).toFixed(1)} ${rand(punten[i]).toFixed(1)}`
  }
  return d + ' Z'
}

const HULST = hulstblad()
const INKT = '#2b3045'
const ENVELOP = '#fbf7ee'
// het adres: alleen 'Fam.' en '35' zijn nog te lezen
const ADRES = [kriebel(104, 92, 'lenle nelgen'), kriebel(58, 118, 'gelnenl enle'), kriebel(86, 144, 'ne'), kriebel(112, 144, 'lenelg')]
const FAM = 'M58 92 L 61 75 L 70 74 M 59 83 L 66 82.5 M79 86 C 77 83, 71 84, 71 89 C 71 93, 76 92, 78 88 L 78.5 85 C 78 89, 78 92, 81 92 M82 92 L 83.5 85 C 85 83, 88 83, 88 87 L 87.5 92 M 88 87 C 89 83, 93 83, 93.5 87 L 93 92'
const CIJFERS = 'M60 131 C 66 128, 71 133, 65 137 C 72 139, 70 147, 61 145 M82 130 L 75 130 L 73 137 C 80 135, 84 140, 81 144 C 78 147, 74 146, 72 144'

function OnleesbaarAdres() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="onleesbaar-tegels" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="40" height="40" fill="#ebe5d9" />
          <rect width="20" height="20" fill="#d3c9b8" />
          <rect x="20" y="20" width="20" height="20" fill="#d3c9b8" />
        </pattern>
        <pattern id="onleesbaar-kokos" width="12" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="#b58b53" />
          <path d="M1 3 h 5 M7 8 h 5" stroke="#a57c47" strokeWidth="2.4" strokeLinecap="round" />
        </pattern>
      </defs>
      {/* tegelvloer in de gang */}
      <rect width="360" height="480" fill="url(#onleesbaar-tegels)" />
      {/* deurmat */}
      <rect x="34" y="58" width="292" height="440" rx="16" fill="#4e4136" />
      <rect x="46" y="70" width="268" height="416" rx="8" fill="url(#onleesbaar-kokos)" />
      {/* de envelop met kerstkaart */}
      <g transform="translate(48 110) rotate(-6 132 84)">
        <rect x="5" y="9" width="264" height="168" rx="5" fill="#3e2a14" opacity=".28" />
        <rect width="264" height="168" rx="5" fill={ENVELOP} />
        {/* postzegel met kerstboom en stempel */}
        <rect x="202" y="14" width="46" height="56" fill="#fff" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i} fill={ENVELOP}>
            <circle cx={205 + i * 6.7} cy="14" r="2" />
            <circle cx={205 + i * 6.7} cy="70" r="2" />
            <circle cx="202" cy={17 + i * 8.4} r="2" />
            <circle cx="248" cy={17 + i * 8.4} r="2" />
          </g>
        ))}
        <rect x="207" y="19" width="36" height="46" fill="#c4453c" />
        <path d="M225 25 L 234 39 H 229 L 237 52 H 213 L 221 39 H 216 Z" fill="#f6ead8" />
        <rect x="223" y="52" width="4" height="6" fill="#f6ead8" />
        <circle cx="196" cy="44" r="18" fill="none" stroke="#3d4250" strokeWidth="1.6" opacity=".5" />
        {[32, 40, 48, 56].map((y) => (
          <path key={y} d={`M206 ${y} q 6 -4 12 0 t 12 0 t 12 0 t 12 0 t 12 0`} fill="none" stroke="#3d4250" strokeWidth="1.6" opacity=".5" />
        ))}
        {/* adres in kriebelhandschrift */}
        <g fill="none" stroke={INKT} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d={FAM} />
          {ADRES.map((d) => (
            <path key={d} d={d} />
          ))}
          <path d={CIJFERS} />
          <path d="M108 152 C 130 149, 150 154, 170 150" />
        </g>
        <circle cx="96.5" cy="91.5" r="1.3" fill={INKT} />
        {/* hulsttakje op de hoek */}
        <g transform="translate(10 150)">
          <path d={HULST} transform="rotate(-150)" fill="#2f6e46" />
          <path d={HULST} transform="rotate(-80)" fill="#3a8052" />
          <circle cx="2" cy="-3" r="5" fill="#c8323b" />
          <circle cx="-6" cy="4" r="5" fill="#b52a33" />
          <circle cx="6" cy="5" r="5" fill="#d23c43" />
        </g>
      </g>
    </svg>
  )
}

// ---------- Buitenspel op het WK ----------
// Gezichtsloze speler, kijkt naar rechts, voeten op 0,0. Benen: [heup, knie, enkel, teen], armen: [schouder, elleboog, hand].
const AANVALLER = {
  hoofd: [19, -136],
  schouder: [11, -117],
  heup: [0, -72],
  armAchter: [[12, -115], [30, -102], [40, -114]],
  armVoor: [[9, -115], [-12, -104], [-26, -94]],
  beenVoor: [[2, -72], [32, -46], [62, -12], [77, -6]],
  beenAchter: [[-2, -72], [-18, -38], [-54, -26], [-58, -14]],
}
const VERDEDIGER = {
  hoofd: [5, -141],
  schouder: [3, -122],
  heup: [0, -76],
  armAchter: [[4, -120], [18, -104], [26, -116]],
  armVoor: [[1, -120], [-16, -108], [-26, -98]],
  beenVoor: [[2, -76], [24, -46], [36, -10], [50, -5]],
  beenAchter: [[-2, -76], [-12, -42], [-42, -30], [-47, -18]],
}
const ROOD = { shirt: '#d8473b', broek: '#f4f4f2', kous: '#d8473b', schoen: '#1f2226', huid: '#8a5a3c', haar: '#1f1a17' }
const GEEL = { shirt: '#f2c230', broek: '#2c3038', kous: '#f2c230', schoen: '#f1f1ee', huid: '#e3b28f', haar: '#6b4a2f' }

const tussen = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]

function Lijn({ p, kleur, dikte }) {
  return <path d={'M' + p.map((q) => q.join(' ')).join(' L ')} stroke={kleur} strokeWidth={dikte} fill="none" strokeLinecap="round" strokeLinejoin="round" />
}

function Speler({ x, y, s = 1, p, k }) {
  const been = (b) => (
    <>
      <Lijn p={[b[0], b[1], b[2]]} kleur={k.huid} dikte={10} />
      <Lijn p={[tussen(b[1], b[2], 0.3), b[2]]} kleur={k.kous} dikte={10.5} />
      <Lijn p={[b[0], tussen(b[0], b[1], 0.36)]} kleur={k.broek} dikte={13} />
      <Lijn p={[b[2], b[3]]} kleur={k.schoen} dikte={8} />
    </>
  )
  const arm = (a) => (
    <>
      <Lijn p={a} kleur={k.huid} dikte={8} />
      <Lijn p={[a[0], tussen(a[0], a[1], 0.5)]} kleur={k.shirt} dikte={11} />
    </>
  )
  const [hx, hy] = p.hoofd
  const [sx, sy] = p.schouder
  const [px, py] = p.heup
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {arm(p.armAchter)}
      {been(p.beenAchter)}
      <Lijn p={[p.schouder, p.hoofd]} kleur={k.huid} dikte={7} />
      <path d={`M${sx - 10} ${sy} L ${sx + 10} ${sy} L ${px + 10} ${py - 6} L ${px - 10} ${py - 6} Z`} fill={k.shirt} stroke={k.shirt} strokeWidth="6" strokeLinejoin="round" />
      <rect x={px - 12} y={py - 10} width="24" height="14" rx="4" fill={k.broek} />
      {been(p.beenVoor)}
      {arm(p.armVoor)}
      <circle cx={hx} cy={hy} r="11" fill={k.huid} />
      <path d={`M${hx - 10.6} ${hy + 3} A 11 11 0 0 1 ${hx + 9} ${hy - 6.3} Q ${hx - 2} ${hy - 4} ${hx - 10.6} ${hy + 3} Z`} fill={k.haar} />
    </g>
  )
}

// Voetbalschoen, enkel op 0,0, punt naar rechts
const SCHOEN = 'M-14 -14 C -4 -17, 8 -15, 16 -11 C 30 -9, 44 -5, 50 1 C 53 5, 51 10, 45 10 L -12 10 C -17 10, -19 4, -18 -2 Z'
const ZOOM = { x: 262, y: 118, r: 78 }
const VOETEN = { x: 164, y: 248, r: 24 }

function Schoen({ x, y, hoek, schoen, kous, zool, been }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${hoek})`}>
      <path d={`M${been[0]} ${been[1]} L 0 -4`} stroke={kous} strokeWidth="30" strokeLinecap="round" />
      <path d={SCHOEN} fill={schoen} />
      <path d="M-12 10 H 45" stroke={zool} strokeWidth="4" strokeLinecap="round" />
      {[-6, 8, 26, 38].map((n) => (
        <rect key={n} x={n} y="11" width="5" height="4" rx="1" fill={zool} />
      ))}
    </g>
  )
}

function BuitenspelWk() {
  // kegel van het kleine naar het grote rondje
  const dx = ZOOM.x - VOETEN.x
  const dy = ZOOM.y - VOETEN.y
  const l = Math.hypot(dx, dy)
  const [nx, ny] = [-dy / l, dx / l]
  const banen = Array.from({ length: 12 }, (_, i) => i - 3)
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <clipPath id="buitenspel-zoom">
          <circle cx={ZOOM.x} cy={ZOOM.y} r={ZOOM.r} />
        </clipPath>
      </defs>
      {/* tribune met publiek */}
      <rect width="360" height="96" fill="#2b323c" />
      {Array.from({ length: 7 }, (_, r) =>
        Array.from({ length: 38 }, (_, k) => (
          <circle
            key={`${r}-${k}`}
            cx={k * 10 + (r % 2) * 5}
            cy={10 + r * 12}
            r="4"
            fill={['#4a5361', '#5d6776', '#7a6a5e', '#3f4855', '#8a5a52', '#56606e', '#6d7a6a'][(r * 5 + k * 3) % 7]}
          />
        )),
      )}
      {/* reclameborden zonder tekst */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 90} y="94" width="90" height="16" fill={i % 2 ? '#3b4654' : '#dfe3e8'} />
      ))}
      {/* gras met maaibanen */}
      <rect y="110" width="360" height="370" fill="#4f9d4c" />
      {banen.map((i) =>
        i % 2 ? null : (
          <path
            key={i}
            d={`M${180 + (i - 3.5) * 46} 110 L ${180 + (i - 2.5) * 46} 110 L ${180 + (i - 2.5) * 74} 480 L ${180 + (i - 3.5) * 74} 480 Z`}
            fill="#59a955"
          />
        ),
      )}
      {/* de bal, net gespeeld */}
      <ellipse cx="44" cy="306" rx="10" ry="3" fill="#2f6f30" opacity=".5" />
      <circle cx="44" cy="296" r="9" fill="#fff" />
      <path d="M44 291.5 l 4 3 -1.5 4.5 h -5 l -1.5 -4.5 z" fill="#2a2d31" />
      {[[16, 290, 12], [10, 297, 18], [18, 304, 10]].map(([x, y, w]) => (
        <path key={y} d={`M${x} ${y} h ${w}`} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
      ))}
      {/* twee spelers, voeten bijna op dezelfde hoogte */}
      <ellipse cx="124" cy="237" rx="42" ry="4.5" fill="#2f6f30" opacity=".35" />
      <ellipse cx="96" cy="271" rx="56" ry="6" fill="#2f6f30" opacity=".35" />
      <Speler x={120} y={236} s={0.88} p={VERDEDIGER} k={GEEL} />
      <Speler x={88} y={270} p={AANVALLER} k={ROOD} />
      {/* inzoomen op de voeten */}
      <g stroke="#fff" strokeWidth="1.5" opacity=".85">
        <line x1={VOETEN.x + nx * VOETEN.r} y1={VOETEN.y + ny * VOETEN.r} x2={ZOOM.x + nx * ZOOM.r} y2={ZOOM.y + ny * ZOOM.r} />
        <line x1={VOETEN.x - nx * VOETEN.r} y1={VOETEN.y - ny * VOETEN.r} x2={ZOOM.x - nx * ZOOM.r} y2={ZOOM.y - ny * ZOOM.r} />
      </g>
      <circle cx={VOETEN.x} cy={VOETEN.y} r={VOETEN.r} fill="none" stroke="#fff" strokeWidth="2.5" />
      <circle cx={ZOOM.x + 2} cy={ZOOM.y + 6} r={ZOOM.r + 3} fill="#1b3a1c" opacity=".3" />
      <g clipPath="url(#buitenspel-zoom)">
        <rect x={ZOOM.x - ZOOM.r} y={ZOOM.y - ZOOM.r} width={ZOOM.r * 2} height={ZOOM.r * 2} fill="#4f9d4c" />
        <path d="M150 0 L 236 0 L 262 240 L 176 240 Z" fill="#59a955" />
        <path d="M322 0 L 408 0 L 434 240 L 348 240 Z" fill="#59a955" />
        <ellipse cx="262" cy="128" rx="46" ry="6" fill="#2f6f30" opacity=".4" />
        <ellipse cx="258" cy="182" rx="50" ry="7" fill="#2f6f30" opacity=".4" />
        <Schoen x={238} y={106} hoek={12} been={[-30, -120]} schoen="#f1f1ee" kous="#f2c230" zool="#9aa0a6" />
        <Schoen x={244} y={160} hoek={14} been={[-110, -80]} schoen="#1f2226" kous="#d8473b" zool="#e8e8e4" />
      </g>
      <circle cx={ZOOM.x} cy={ZOOM.y} r={ZOOM.r} fill="none" stroke="#fff" strokeWidth="5" />
    </svg>
  )
}

// ---------- De nachtfoto ----------
// Grachtenpanden: [x, breedte, top van de gevel, soort gevel]
const PANDEN = [
  [-8, 48, 92, 'trap'],
  [40, 40, 108, 'hals'],
  [80, 52, 84, 'klok'],
  [132, 44, 100, 'trap'],
  [176, 54, 78, 'hals'],
  [230, 42, 104, 'tuit'],
  [272, 50, 88, 'trap'],
  [322, 46, 100, 'klok'],
]
const KADE = 240
const LANTAARNS = [30, 124, 216, 308]
const DONKER = {
  lucht: 'url(#nachtfoto-lucht-donker)',
  panden: ['#1d2333', '#242a3b', '#1a1f2d', '#272c3a', '#20263a'],
  raam: '#2a3145',
  raamAan: '#a88a52',
  kade: '#161b27',
  water: '#0e1320',
  lamp: '#f2c46a',
  paal: '#0b0e15',
  spiegel: 0.3,
  maan: '#e8e2c8',
  lichtkring: true,
}
const LICHT = {
  lucht: 'url(#nachtfoto-lucht-licht)',
  panden: ['#a8503d', '#d4a04a', '#6f9087', '#e1d2b2', '#8f3f38', '#c27b56', '#5f6f86', '#cfb48a'],
  raam: '#3a4560',
  raamAan: '#ffd889',
  kade: '#8a7f73',
  water: '#2f5079',
  lamp: '#fff1c4',
  paal: '#2a2f38',
  spiegel: 0.45,
}

function gevel(x, w, top, soort) {
  const sh = top + 30
  if (soort === 'tuit') return `M${x} ${sh} L ${x + w / 2} ${top} L ${x + w} ${sh} Z`
  if (soort === 'trap') {
    const st = w * 0.14
    return `M${x} ${sh} V${sh - 10} H${x + st} V${sh - 20} H${x + 2 * st} V${top} H${x + w - 2 * st} V${sh - 20} H${x + w - st} V${sh - 10} H${x + w} V${sh} Z`
  }
  if (soort === 'hals') {
    return `M${x} ${sh} Q ${x + w * 0.25} ${sh} ${x + w * 0.25} ${sh - 14} V ${top + 7} L ${x + w / 2} ${top} L ${x + w * 0.75} ${top + 7} V ${sh - 14} Q ${x + w * 0.75} ${sh} ${x + w} ${sh} Z`
  }
  return `M${x} ${sh} C ${x} ${sh - 14}, ${x + w * 0.22} ${sh - 12}, ${x + w * 0.26} ${sh - 22} C ${x + w * 0.3} ${top - 2}, ${x + w * 0.7} ${top - 2}, ${x + w * 0.74} ${sh - 22} C ${x + w * 0.78} ${sh - 12}, ${x + w} ${sh - 14}, ${x + w} ${sh} Z`
}

// Dezelfde gracht, in het donker of goed belicht. Het filter maakt alles behalve de lucht wat vaag.
function Gracht({ p, filter }) {
  return (
    <>
      <rect width="360" height={KADE} fill={p.lucht} />
      {p.maan && <path d="M46 30 A 14 14 0 1 0 62 52 A 11 11 0 0 1 46 30 Z" fill={p.maan} />}
      <g filter={filter}>
        <rect y={KADE} width="360" height="12" fill={p.kade} />
        <rect y={KADE + 12} width="360" height={480 - KADE} fill={p.water} />
        {PANDEN.map(([x, w, top, soort], i) => {
          const kleur = p.panden[i % p.panden.length]
          const sh = top + 30
          const kolommen = w < 46 ? 2 : 3
          const rijen = []
          for (let y = sh + 12; y < KADE - 24; y += 30) rijen.push(y)
          return (
            <g key={x}>
              <path d={gevel(x, w, top, soort)} fill={kleur} />
              <rect x={x} y={sh - 0.5} width={w} height={KADE - sh + 0.5} fill={kleur} />
              <rect x={x + w / 2 - 4} y={sh - 20} width="8" height="12" rx="1" fill={p.raam} />
              {rijen.map((y, r) =>
                Array.from({ length: kolommen }, (_, k) => (
                  <rect
                    key={`${r}-${k}`}
                    x={x + (w / (kolommen + 1)) * (k + 1) - 4.5}
                    y={y}
                    width="9"
                    height="15"
                    rx="1"
                    fill={(i * 3 + r * 5 + k * 7) % 5 === 0 ? p.raamAan : p.raam}
                  />
                )),
              )}
              <rect x={x + 3} y={KADE + 14} width={w - 6} height={(KADE - top) * 0.45} fill={kleur} opacity={p.spiegel} />
            </g>
          )
        })}
        {/* rimpels in het water */}
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1="0" x2="360" y1={KADE + 18 + i * 7} y2={KADE + 18 + i * 7} stroke={p.water} strokeWidth="2.5" />
        ))}
        {/* lantaarns met hun weerspiegeling */}
        {LANTAARNS.map((x) => (
          <g key={x}>
            {p.lichtkring && <circle cx={x} cy={KADE - 52} r="34" fill="url(#nachtfoto-lamp)" />}
            <rect x={x - 1.5} y={KADE - 46} width="3" height="50" fill={p.paal} />
            <path d={`M${x - 6} ${KADE - 46} L ${x - 8} ${KADE - 60} H ${x + 8} L ${x + 6} ${KADE - 46} Z`} fill={p.lamp} />
            <path d={`M${x - 9} ${KADE - 60} H ${x + 9} L ${x} ${KADE - 66} Z`} fill={p.paal} />
            {[[22, 14], [34, 10], [48, 6]].map(([dy, w]) => (
              <rect key={dy} x={x - w / 2} y={KADE + dy} width={w} height="2.5" rx="1.2" fill={p.lamp} opacity=".7" />
            ))}
          </g>
        ))}
      </g>
    </>
  )
}

function DeNachtfoto() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="nachtfoto-lucht-donker" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090d1a" />
          <stop offset="1" stopColor="#1a2136" />
        </linearGradient>
        <linearGradient id="nachtfoto-lucht-licht" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24396b" />
          <stop offset="0.45" stopColor="#5f7fb6" />
          <stop offset="1" stopColor="#c7a58d" />
        </linearGradient>
        <radialGradient id="nachtfoto-lamp">
          <stop offset="0" stopColor="#f2c46a" stopOpacity=".28" />
          <stop offset="1" stopColor="#f2c46a" stopOpacity="0" />
        </radialGradient>
        <filter id="nachtfoto-zacht">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <clipPath id="nachtfoto-scherm">
          <rect x="95" y="27" width="170" height="420" rx="24" />
        </clipPath>
      </defs>
      {/* de echte avond: donker en een beetje vaag */}
      <rect width="360" height="480" fill="#0e1320" />
      <Gracht p={DONKER} filter="url(#nachtfoto-zacht)" />
      {/* telefoon zonder hand */}
      <rect x="88" y="20" width="184" height="440" rx="31" fill="#15171c" stroke="#3a3e47" strokeWidth="1.5" />
      <g clipPath="url(#nachtfoto-scherm)">
        <Gracht p={LICHT} />
        <rect x="158" y="36" width="44" height="13" rx="6.5" fill="#0b0c0f" />
        {/* camera-interface */}
        <path d="M118 36 L 112 45 H 117 L 115 53 L 122 43 H 117 Z" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="242" cy="44" r="7" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="242" cy="44" r="2.2" fill="#fff" />
        <path d="M152 136 v -10 h 10 M198 126 h 10 v 10 M208 176 v 10 h -10 M162 186 h -10 v -10" fill="none" stroke="#f5c84c" strokeWidth="2" />
        <rect x="95" y="262" width="170" height="200" fill="#0b0d12" opacity=".55" />
        <circle cx="180" cy="298" r="24" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="180" cy="298" r="19" fill="#fff" />
        <rect x="112" y="286" width="24" height="24" rx="6" fill="#d4a04a" stroke="#fff" strokeWidth="1.5" />
        <rect x="113" y="287" width="22" height="10" rx="5" fill="#5f7fb6" />
        <circle cx="248" cy="298" r="13" fill="#fff" opacity=".18" />
        <path d="M242 296 a 6 6 0 0 1 11 -2 M254 300 a 6 6 0 0 1 -11 2" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M253 291 v 3.5 h -3.5 M243 305 v -3.5 h 3.5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

export const BUITEN = {
  marsrover: Marsrover,
  'code-oranje': CodeOranje,
  'onleesbaar-adres': OnleesbaarAdres,
  'buitenspel-wk': BuitenspelWk,
  'de-nachtfoto': DeNachtfoto,
}

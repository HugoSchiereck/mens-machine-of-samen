// Echte-wereld- en verrassingskaarten. Dit zijn illustraties van hoe zo'n systeem eruit kan zien,
// geen screenshots van echte producten. De docent controleert de uitleg in kaarten.json.
import { Abs } from './website.jsx'

const DISPLAY = "'Avenir Next', Avenir, 'Nunito Sans Variable', sans-serif"
const MONO = "'Geist Mono Variable', ui-monospace, monospace"
const AI_GROEN = '#22d17b'

const Label = ({ children, s }) => (
  <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', ...s }}>{children}</span>
)

// ---------- Kanker opsporen op scans ----------
export function KankerScan() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0b0d12', color: '#cfd6e4' }}>
      <Abs x={0} y={0} w={360} h={32} s={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderBottom: '1px solid #1f2430' }}>
        <Label s={{ color: '#fff' }}>Scanviewer</Label>
        <Label s={{ color: '#7d8799' }}>Borstonderzoek · 0472</Label>
      </Abs>
      <Abs
        x={12}
        y={44}
        w={224}
        h={300}
        s={{
          background:
            'radial-gradient(ellipse 60% 45% at 62% 40%, rgba(235,235,240,.55), transparent 70%), radial-gradient(ellipse 30% 20% at 40% 70%, rgba(220,220,230,.35), transparent 70%), radial-gradient(ellipse 85% 70% at 100% 50%, #5d6170 0%, #2a2d36 55%, #050608 80%)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 132, top: 120, width: 14, height: 12, borderRadius: '50%', background: 'radial-gradient(circle, #fff, rgba(255,255,255,.2) 70%)' }} />
        <div style={{ position: 'absolute', left: 74, top: 222, width: 16, height: 10, borderRadius: '50%', background: 'radial-gradient(circle, #e9e9ee, rgba(255,255,255,.1) 70%)' }} />
      </Abs>
      {[
        { x: 128, y: 146, p: '87%' },
        { x: 66, y: 246, p: '34%' },
      ].map((m) => (
        <Abs key={m.p} x={m.x} y={m.y} w={48} h={48} s={{ border: `2px dashed ${AI_GROEN}`, borderRadius: 4 }}>
          <span style={{ position: 'absolute', top: -15, left: -2, background: AI_GROEN, color: '#04361c', fontFamily: MONO, fontSize: 9, fontWeight: 700, padding: '1px 4px', borderRadius: 3 }}>AI {m.p}</span>
        </Abs>
      ))}
      <Abs x={244} y={44} w={104} h={300} s={{ background: '#131722', borderRadius: 4, padding: 10 }}>
        <Label s={{ color: AI_GROEN }}>AI-analyse</Label>
        <div style={{ fontSize: 11, marginTop: 8, lineHeight: 1.35 }}>2 plekken gemarkeerd</div>
        {[
          ['Plek 1', '87%', 'verdacht'],
          ['Plek 2', '34%', 'twijfel'],
        ].map(([p, pct, t]) => (
          <div key={p} style={{ marginTop: 12, fontSize: 10, borderLeft: `2px solid ${AI_GROEN}`, paddingLeft: 6 }}>
            <b style={{ color: '#fff' }}>{p}</b>
            <div style={{ fontFamily: MONO, color: AI_GROEN }}>{pct}</div>
            <div style={{ color: '#7d8799' }}>{t}</div>
          </div>
        ))}
      </Abs>
      <Abs x={12} y={356} w={336} h={112} s={{ background: '#f2f0ea', color: '#1b1d22', borderRadius: 6, padding: '10px 12px', fontSize: 11 }}>
        <Label s={{ color: '#2a46d6', fontWeight: 700 }}>Beoordeling radioloog</Label>
        <div style={{ marginTop: 8, display: 'grid', gap: 5 }}>
          <div>☑ Plek 1: verder onderzoeken</div>
          <div>☑ Plek 2: geen afwijking, oud litteken</div>
        </div>
        <div style={{ marginTop: 8, fontSize: 9.5, color: '#666' }}>Getekend door de radioloog · 14:32</div>
      </Abs>
    </div>
  )
}

// ---------- Weersvoorspelling ----------
export function Weer() {
  const uren = [
    ['09', '12°', 30],
    ['12', '14°', 55],
    ['15', '13°', 85],
    ['18', '12°', 95],
    ['21', '10°', 70],
    ['00', '9°', 40],
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #2b4c9b 0%, #6f94d6 60%, #a9c3ea 100%)', color: '#fff' }}>
      <Abs x={20} y={18} w={320} h={20} s={{ fontSize: 12, opacity: 0.9 }}>
        Kraaienburg · morgen
      </Abs>
      <Abs x={18} y={36} w={200} h={90} s={{ fontFamily: DISPLAY, fontWeight: 300, fontSize: 78, lineHeight: '86px' }}>
        14°
      </Abs>
      <Abs x={220} y={46} w={120} h={80}>
        <svg viewBox="0 0 120 80" width="120" height="80">
          <path d="M30 60a18 18 0 0 1 4-35 24 24 0 0 1 46 6 15 15 0 0 1 4 29z" fill="#fff" opacity=".95" />
          <path d="M6 30h30M2 42h22M10 54h18" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
        </svg>
      </Abs>
      <Abs x={14} y={136} w={332} h={70} s={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', background: 'rgba(255,255,255,.14)', borderRadius: 12, padding: '8px 4px', textAlign: 'center' }}>
        {uren.map(([u, t]) => (
          <div key={u} style={{ fontSize: 11 }}>
            <div style={{ opacity: 0.75 }}>{u}</div>
            <div style={{ fontSize: 16, fontWeight: 700, margin: '4px 0' }}>{t}</div>
            <div style={{ opacity: 0.85 }}>↗</div>
          </div>
        ))}
      </Abs>
      <Abs x={14} y={218} w={332} h={112} s={{ background: 'rgba(255,255,255,.14)', borderRadius: 12, padding: '8px 12px' }}>
        <div style={{ fontSize: 10, opacity: 0.85 }}>Windstoten (km/u)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 70, marginTop: 6 }}>
          {uren.map(([u, , w]) => (
            <div key={u} style={{ flex: 1, height: `${w}%`, background: w > 80 ? '#ffb21a' : 'rgba(255,255,255,.7)', borderRadius: '4px 4px 0 0' }} />
          ))}
        </div>
      </Abs>
      <Abs x={20} y={336} w={320} h={16} s={{ fontFamily: MONO, fontSize: 9, opacity: 0.85 }}>
        modelberekening 06:00 · 51 scenario's
      </Abs>
      <Abs x={16} y={362} w={328} h={100} s={{ background: '#ff8a00', borderRadius: 12, padding: '10px 12px', color: '#2a1400' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 20, letterSpacing: 0.5 }}>CODE ORANJE</div>
        <div style={{ fontSize: 11.5, marginTop: 2, lineHeight: 1.3 }}>Zware windstoten tot 100 km/u. Pas op langs open water.</div>
        <div style={{ fontSize: 9.5, marginTop: 6, opacity: 0.8 }}>Uitgegeven door de meteoroloog van dienst · 07:15</div>
      </Abs>
    </div>
  )
}

// ---------- VAR ----------
export function VarCheck() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(100deg, #2f8f3a 0 40px, #2a8034 40px 80px)', overflow: 'hidden' }}>
      <svg width="360" height="480" style={{ position: 'absolute', inset: 0 }}>
        <path d="M-20 360 L380 300" stroke="#fff" strokeWidth="3" opacity=".85" />
        <path d="M40 352 L80 160 L360 120" stroke="#fff" strokeWidth="3" fill="none" opacity=".85" />
        <path d="M150 336 L170 240 L360 214" stroke="#fff" strokeWidth="3" fill="none" opacity=".85" />
        <circle cx="160" cy="270" r="3" fill="#fff" />
        {/* spelers */}
        {[
          [120, 250, '#c8102e'],
          [180, 230, '#fff'],
          [200, 262, '#c8102e'],
          [230, 220, '#fff'],
          [90, 300, '#fff'],
          [260, 280, '#c8102e'],
        ].map(([x, y, k], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y + 22} rx="9" ry="3" fill="rgba(0,0,0,.25)" />
            <rect x={x - 6} y={y - 4} width="12" height="22" rx="5" fill={k} stroke="#111" strokeWidth="1" />
            <circle cx={x} cy={y - 9} r="5" fill="#e9c4a0" stroke="#111" strokeWidth="1" />
          </g>
        ))}
        <circle cx="188" cy="276" r="5" fill="#fff" stroke="#111" />
      </svg>
      <Abs x={12} y={12} w={150} h={24} s={{ display: 'flex', fontFamily: MONO, fontSize: 11, fontWeight: 700 }}>
        <span style={{ background: '#111', color: '#fff', padding: '4px 7px' }}>KRA 1–1 ZWA</span>
        <span style={{ background: '#ffd23f', color: '#111', padding: '4px 7px' }}>78'</span>
      </Abs>
      <Abs x={210} y={48} w={138} h={96} s={{ background: '#0c0f14', border: '2px solid #fff', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(80deg, #2f8f3a 0 18px, #2a8034 18px 36px)', filter: 'saturate(.7) brightness(.85)' }} />
        <div style={{ position: 'absolute', left: 52, top: 26, width: 16, height: 36, borderRadius: 7, background: '#c8102e', border: '1px solid #111' }} />
        <div style={{ position: 'absolute', left: 70, top: 34, width: 16, height: 34, borderRadius: 7, background: '#fff', border: '1px solid #111', transform: 'rotate(-25deg)' }} />
        <span style={{ position: 'absolute', left: 6, top: 4, color: '#fff', fontFamily: MONO, fontSize: 8, background: 'rgba(0,0,0,.5)', padding: '1px 4px' }}>● REPLAY · CAM 4</span>
      </Abs>
      <Abs x={12} y={400} w={336} h={60} s={{ background: '#0d1b3f', borderLeft: '6px solid #ffd23f', color: '#fff', padding: '8px 12px' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>VAR-CHECK</div>
        <div style={{ fontSize: 11, opacity: 0.9 }}>Mogelijke strafschop · scheidsrechter kijkt terug</div>
      </Abs>
    </div>
  )
}

// ---------- Verkeerslichten ----------
export function Verkeerslichten() {
  const lus = (x, y, w, h) => <rect x={x} y={y} width={w} height={h} rx="3" fill="none" stroke={AI_GROEN} strokeWidth="2" strokeDasharray="5 3" />
  const auto = (x, y, w, h, k) => <rect x={x} y={y} width={w} height={h} rx="5" fill={k} stroke="#111" strokeWidth="1.2" />
  const licht = (x, y, kleur) => (
    <g>
      <rect x={x - 6} y={y - 6} width="12" height="12" rx="3" fill="#111" />
      <circle cx={x} cy={y} r="3.5" fill={kleur} />
    </g>
  )
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#c9c3b6' }}>
      <svg width="360" height="480" style={{ position: 'absolute', inset: 0 }}>
        <rect x="130" y="0" width="100" height="480" fill="#4a4d55" />
        <rect x="0" y="190" width="360" height="100" fill="#4a4d55" />
        <path d="M180 0v190M180 290v190M0 240h130M230 240h130" stroke="#e8e2d2" strokeWidth="2" strokeDasharray="12 10" />
        {/* zebrapaden */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i} fill="#eee">
            <rect x={136 + i * 13} y="172" width="8" height="14" />
            <rect x={136 + i * 13} y="294" width="8" height="14" />
          </g>
        ))}
        {/* detectielussen */}
        {lus(186, 316, 36, 32)}
        {lus(186, 386, 36, 32)}
        {lus(138, 132, 36, 32)}
        {lus(84, 196, 32, 38)}
        {lus(244, 246, 32, 38)}
        {/* auto's */}
        {auto(190, 320, 28, 44, '#ffd23f')}
        {auto(190, 398, 28, 44, '#4a6cff')}
        {auto(142, 100, 28, 44, '#f4efe6')}
        {auto(40, 200, 44, 28, '#c8102e')}
        {/* lichten */}
        {licht(240, 306, '#3dff8a')}
        {licht(120, 174, '#3dff8a')}
        {licht(120, 306, '#ff3d3d')}
        {licht(240, 174, '#ff3d3d')}
        {/* regelkast en kabels */}
        <path d="M222 332h40v16M222 402h40v-34M276 270v60" stroke={AI_GROEN} strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <rect x="252" y="330" width="52" height="40" rx="4" fill="#9aa0a8" stroke="#111" strokeWidth="1.5" />
        <rect x="260" y="338" width="20" height="10" rx="2" fill={AI_GROEN} />
      </svg>
      <Abs x={308} y={340} w={50} h={20} s={{ fontFamily: MONO, fontSize: 8, color: '#111', lineHeight: 1.1 }}>
        regel-
        <br />
        kast
      </Abs>
      <Abs x={12} y={12} w={190} h={26} s={{ background: '#111', color: '#fff', borderRadius: 99, fontSize: 11, display: 'flex', alignItems: 'center', padding: '0 12px', fontWeight: 700 }}>
        Kruispunt Stationsweg
      </Abs>
      <Abs x={36} y={430} w={288} h={36} s={{ background: '#fffdf6', borderRadius: 8, border: '1.5px solid #111', fontSize: 10.5, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6 }}>
        <span style={{ fontFamily: MONO, fontWeight: 700 }}>v3</span> Regelprogramma, ingesteld door verkeerskundige
      </Abs>
    </div>
  )
}

// ---------- Muziek-jaaroverzicht ----------
export function MuziekJaar() {
  const artiesten = [
    ['Lofi Bever', '#ffd23f'],
    ['Noor & de Golven', '#22d17b'],
    ['DJ Polder', '#4a6cff'],
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#16132a', color: '#fff', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -60, top: -80, width: 300, height: 300, borderRadius: '50%', background: '#ff3d6e' }} />
      <div style={{ position: 'absolute', right: -90, top: 120, width: 220, height: 220, borderRadius: 30, background: '#ffb21a', transform: 'rotate(18deg)' }} />
      <Abs x={22} y={26} w={320} h={20} s={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2 }}>
        JOUW 2026 IN MUZIEK
      </Abs>
      <Abs x={20} y={58} w={330} h={110} s={{ fontFamily: DISPLAY, fontWeight: 900, fontStretch: '80%', fontSize: 78, lineHeight: '80px', letterSpacing: -2 }}>
        41.230
        <div style={{ fontFamily: 'inherit', fontWeight: 700, fontStretch: '100%', fontSize: 18, letterSpacing: 0, lineHeight: '20px' }}>minuten geluisterd</div>
      </Abs>
      <Abs x={20} y={186} w={250} h={116} s={{ background: '#16132a', borderRadius: 14, padding: '10px 12px' }}>
        <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 6 }}>Top-artiesten</div>
        {artiesten.map(([n, k], i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, marginTop: 6 }}>
            <span style={{ width: 14, fontFamily: MONO, opacity: 0.6 }}>{i + 1}</span>
            <span style={{ width: 20, height: 20, borderRadius: 4, background: k }} />
            {n}
          </div>
        ))}
      </Abs>
      <Abs x={20} y={314} w={320} h={52} s={{ fontSize: 13, lineHeight: 1.3 }}>
        Je hoort bij de <b style={{ color: '#ffb21a' }}>top 3%</b> luisteraars van Lofi Bever.
      </Abs>
      <Abs x={20} y={380} w={320} h={84} s={{ background: '#f4efe6', color: '#16132a', borderRadius: 16, padding: '10px 14px' }}>
        <div style={{ fontSize: 10, opacity: 0.6 }}>Jouw luistertype</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 26, lineHeight: '30px' }}>De Nachtbraker</div>
        <div style={{ fontSize: 11 }}>Jij drukt pas echt op play na 22:00.</div>
      </Abs>
    </div>
  )
}

// ---------- Melkrobot ----------
export function Melkrobot() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#efe6d2' }}>
      <svg width="360" height="210" style={{ position: 'absolute', left: 0, top: 0 }}>
        <rect width="360" height="210" fill="#d9c9a5" />
        <rect y="170" width="360" height="40" fill="#a89470" />
        <path d="M0 20h360M0 60h360" stroke="#b8a47c" strokeWidth="2" />
        {/* koe */}
        <rect x="110" y="70" width="170" height="80" rx="26" fill="#fff" stroke="#111" strokeWidth="2" />
        <path d="M140 74c16 6 18 30 2 40-12 6-24-4-26-16M220 72c-8 14 6 30 26 26 10-2 16-12 12-24" fill="#111" />
        <rect x="128" y="140" width="12" height="38" rx="4" fill="#fff" stroke="#111" strokeWidth="2" />
        <rect x="250" y="140" width="12" height="38" rx="4" fill="#fff" stroke="#111" strokeWidth="2" />
        <path d="M280 90c18-6 26 8 20 24" stroke="#111" strokeWidth="3" fill="none" />
        <ellipse cx="196" cy="152" rx="24" ry="10" fill="#f6b8c4" stroke="#111" strokeWidth="1.5" />
        {/* robotarm */}
        <path d="M30 190 L80 168 L150 172" stroke="#3a3f4a" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="80" cy="168" r="9" fill={AI_GROEN} stroke="#111" strokeWidth="2" />
        <rect x="150" y="160" width="70" height="16" rx="5" fill="#3a3f4a" />
        <path d="M200 162 L196 154" stroke="#ff2d2d" strokeWidth="2" />
        <path d="M160 168 L196 154" stroke="#ff2d2d" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="292" y="100" width="20" height="12" rx="3" fill={AI_GROEN} stroke="#111" strokeWidth="1.5" />
      </svg>
      <Abs x={292} y={86} w={60} h={12} s={{ fontFamily: MONO, fontSize: 8, color: '#111' }}>
        halsband
      </Abs>
      <Abs x={14} y={222} w={332} h={92} s={{ background: '#1d2620', color: '#e8f5ec', borderRadius: 12, padding: '10px 12px' }}>
        <Label s={{ color: AI_GROEN }}>Melkrobot · stal 2 · bezig</Label>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>Koe 112 · Bella</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {[1, 1, 1, 0.4].map((v, i) => (
            <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: '#33443a', overflow: 'hidden' }}>
              <div style={{ width: `${v * 100}%`, height: '100%', background: AI_GROEN }} />
            </div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, marginTop: 6, opacity: 0.7 }}>spenen gevonden met camera · 4/4</div>
      </Abs>
      <Abs x={14} y={322} w={160} h={50} s={{ background: '#fff', borderRadius: 10, padding: '6px 10px', fontSize: 10 }}>
        Vandaag gemolken
        <div style={{ fontSize: 18, fontWeight: 700 }}>31 koeien</div>
      </Abs>
      <Abs x={186} y={322} w={160} h={50} s={{ background: '#fff', borderRadius: 10, padding: '6px 10px', fontSize: 10 }}>
        Laatste schoonmaak
        <div style={{ fontSize: 18, fontWeight: 700 }}>05:40</div>
      </Abs>
      <Abs x={14} y={382} w={332} h={74} s={{ background: '#fff4dc', border: '2px solid #ff8a00', borderRadius: 10, padding: '8px 10px', fontSize: 11.5, lineHeight: 1.3 }}>
        <b>⚠ Koe 87 al 13 uur niet geweest</b>
        <div style={{ marginTop: 3 }}>Melding naar de boer gestuurd. Status: boer gaat kijken.</div>
      </Abs>
    </div>
  )
}

// ---------- Sluis op afstand ----------
function SluisCamera({ x, y, nr, label, boot, open }) {
  return (
    <Abs x={x} y={y} w={166} h={136} s={{ background: '#21402f', borderRadius: 4, overflow: 'hidden', border: '1px solid #2b3445' }}>
      <svg width="166" height="136" style={{ position: 'absolute', inset: 0 }}>
        <rect x="40" y="0" width="86" height="136" fill="#2d6a9a" />
        <rect x="34" y="0" width="6" height="136" fill="#8b8f96" />
        <rect x="126" y="0" width="6" height="136" fill="#8b8f96" />
        {open ? (
          <>
            <rect x="40" y="62" width="14" height="6" fill="#111" />
            <rect x="112" y="62" width="14" height="6" fill="#111" />
          </>
        ) : (
          <rect x="40" y="62" width="86" height="6" fill="#111" />
        )}
        {boot && <path d="M68 86 L98 86 L98 124 L83 132 L68 124z" fill="#f4efe6" stroke="#111" />}
      </svg>
      <span style={{ position: 'absolute', left: 5, top: 4, fontFamily: MONO, fontSize: 8, color: '#fff', background: 'rgba(0,0,0,.5)', padding: '1px 4px' }}>
        <span style={{ color: '#ff4d4d' }}>●</span> CAM {nr} · {label}
      </span>
    </Abs>
  )
}

export function Sluis() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0f131b', color: '#dfe5ef' }}>
      <Abs x={0} y={0} w={360} h={30} s={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: '1px solid #232a38' }}>
        <Label s={{ color: '#fff' }}>Centrale post zuid</Label>
        <Label s={{ color: '#7d8799' }}>Sluis Kraaienburg</Label>
      </Abs>
      <SluisCamera x={10} y={38} nr={1} label="buitenhoofd" boot open />
      <SluisCamera x={184} y={38} nr={2} label="binnenhoofd" />
      <SluisCamera x={10} y={182} nr={3} label="kolk" boot />
      <SluisCamera x={184} y={182} nr={4} label="wachtplaats" />
      <Abs x={10} y={328} w={340} h={142} s={{ background: '#171d29', borderRadius: 8, padding: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            ['Deuren openen', true],
            ['Licht → groen', false],
            ['Intercom schipper', false],
          ].map(([t, aan]) => (
            <div
              key={t}
              style={{
                height: 52,
                borderRadius: 8,
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 700,
                padding: 4,
                background: aan ? '#4a6cff' : '#252d3d',
                boxShadow: aan ? '0 0 0 3px rgba(74,108,255,.35), inset 0 2px 0 rgba(255,255,255,.2)' : 'inset 0 -2px 0 rgba(0,0,0,.4)',
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="26" height="26" viewBox="0 0 26 26">
            <circle cx="13" cy="13" r="13" fill="#4a6cff" />
            <circle cx="13" cy="10" r="4" fill="#fff" />
            <path d="M5.5 21a7.5 7.5 0 0 1 15 0" fill="#fff" />
          </svg>
          Bediend door sluiswachter · 28 km verderop
        </div>
      </Abs>
    </div>
  )
}

// ---------- Operatierobot ----------
export function Operatierobot() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#120a0c', overflow: 'hidden' }}>
      <Abs
        x={-20}
        y={-20}
        w={400}
        h={400}
        s={{
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 45% 55%, #f3a6a0 0%, #d76b6b 30%, #a8383f 55%, #5a1419 75%, #120a0c 100%), radial-gradient(circle at 70% 30%, #ffd0c2, transparent 30%)',
        }}
      />
      <svg width="360" height="370" style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M100 220c30-20 80-10 120 10" stroke="#ffd7cf" strokeWidth="6" fill="none" opacity=".5" />
        <path d="M150 140c20 10 40 6 60-6" stroke="#7c1c22" strokeWidth="4" fill="none" opacity=".6" />
        {/* instrument links */}
        <path d="M-10 360 L130 230" stroke="#c9ccd2" strokeWidth="22" strokeLinecap="round" />
        <path d="M-10 360 L130 230" stroke="#8d929c" strokeWidth="6" />
        <path d="M130 230 l22 -26 M130 230 l30 -10" stroke="#e9ebef" strokeWidth="6" strokeLinecap="round" />
        {/* instrument rechts */}
        <path d="M370 350 L236 236" stroke="#c9ccd2" strokeWidth="22" strokeLinecap="round" />
        <path d="M370 350 L236 236" stroke="#8d929c" strokeWidth="6" />
        <path d="M236 236 l-24 -20 M236 236 l-30 -6" stroke="#e9ebef" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <Abs x={30} y={300} w={60} h={16} s={{ fontFamily: MONO, fontSize: 9, color: '#fff', background: 'rgba(0,0,0,.45)', padding: '1px 5px', borderRadius: 3 }}>
        ARM 1
      </Abs>
      <Abs x={286} y={296} w={60} h={16} s={{ fontFamily: MONO, fontSize: 9, color: '#fff', background: 'rgba(0,0,0,.45)', padding: '1px 5px', borderRadius: 3 }}>
        ARM 2
      </Abs>
      <Abs x={12} y={12} w={336} h={18} s={{ display: 'flex', justifyContent: 'space-between' }}>
        <Label s={{ color: '#fff', background: 'rgba(0,0,0,.45)', padding: '2px 6px' }}>Camera 30°</Label>
        <Label s={{ color: AI_GROEN, background: 'rgba(0,0,0,.45)', padding: '2px 6px' }}>Beweging 3:1 · trilfilter aan</Label>
      </Abs>
      <Abs x={0} y={360} w={360} h={120} s={{ background: '#0d1220', color: '#e5e9f2', padding: '12px 14px', borderTop: '2px solid #4a6cff' }}>
        <Label s={{ color: '#8fa6ff' }}>Console · chirurg</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
          <svg width="90" height="54" viewBox="0 0 90 54">
            <circle cx="22" cy="30" r="16" fill="#4a6cff" opacity=".25" />
            <circle cx="68" cy="30" r="16" fill="#4a6cff" opacity=".25" />
            <path d="M22 44V24l-6-8M22 24l6-8M68 44V24l-6-8M68 24l6-8" stroke="#8fa6ff" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
          <div style={{ fontSize: 12, lineHeight: 1.35 }}>
            Handen op de bediening <span style={{ color: '#4a6cff' }}>●</span>
            <br />
            <span style={{ opacity: 0.7, fontSize: 10.5 }}>Robot volgt elke beweging</span>
          </div>
        </div>
      </Abs>
    </div>
  )
}

// ---------- Level in een platformgame ----------
export function GameLevel() {
  const T = 20
  const blok = (x, y, n, kleur = '#c46b2e') =>
    Array.from({ length: n }, (_, i) => (
      <g key={`${x}-${y}-${i}`}>
        <rect x={x + i * T} y={y} width={T} height={T} fill={kleur} stroke="#5a2a0c" strokeWidth="2" />
        <rect x={x + i * T + 3} y={y + 3} width="6" height="4" fill="rgba(255,255,255,.35)" />
      </g>
    ))
  const munt = (x, y) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="5" ry="7" fill="#ffd23f" stroke="#8a5a00" strokeWidth="2" />
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #4fb6f0 0%, #b9ecff 100%)' }}>
      <svg width="360" height="480" style={{ position: 'absolute', inset: 0 }} shapeRendering="crispEdges">
        {[
          [40, 70],
          [230, 110],
        ].map(([x, y]) => (
          <g key={x} fill="#fff">
            <rect x={x} y={y} width="70" height="20" />
            <rect x={x + 14} y={y - 14} width="40" height="14" />
          </g>
        ))}
        <rect x="0" y="330" width="360" height="70" fill="#7ccf6a" opacity=".5" />
        {blok(0, 400, 8, '#7a4a20')}
        {blok(0, 420, 8, '#7a4a20')}
        {blok(0, 440, 8, '#7a4a20')}
        {blok(0, 460, 8, '#7a4a20')}
        {blok(220, 400, 7, '#7a4a20')}
        {blok(220, 420, 7, '#7a4a20')}
        {blok(220, 440, 7, '#7a4a20')}
        {blok(220, 460, 7, '#7a4a20')}
        <rect x="0" y="396" width="160" height="6" fill="#47b04a" />
        <rect x="220" y="396" width="140" height="6" fill="#47b04a" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${166 + i * 18} 480 l9 -22 l9 22z`} fill="#d9dde3" stroke="#555" />
        ))}
        {blok(40, 300, 4)}
        {blok(130, 240, 3)}
        {blok(220, 300, 3)}
        {blok(270, 196, 4)}
        <rect x="150" y="240" width="20" height="20" fill="#ffd23f" stroke="#5a2a0c" strokeWidth="2" />
        <text x="160" y="255" textAnchor="middle" fontSize="13" fontWeight="900" fill="#5a2a0c" fontFamily="monospace">?</text>
        {munt(60, 280)}
        {munt(80, 280)}
        {munt(100, 280)}
        {munt(150, 220)}
        {munt(180, 175)}
        {munt(290, 176)}
        {munt(310, 176)}
        {/* speler */}
        <rect x="62" y="364" width="22" height="26" fill="#ff7a1a" stroke="#111" strokeWidth="2" />
        <rect x="68" y="370" width="4" height="6" fill="#111" />
        <rect x="76" y="370" width="4" height="6" fill="#111" />
        <rect x="62" y="390" width="8" height="6" fill="#111" />
        <rect x="76" y="390" width="8" height="6" fill="#111" />
        {/* vlag */}
        <rect x="326" y="300" width="4" height="96" fill="#333" />
        <path d="M330 302 l26 10 l-26 10z" fill="#22d17b" stroke="#111" />
      </svg>
      <Abs x={12} y={10} w={336} h={22} s={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontWeight: 700, fontSize: 12, color: '#fff', textShadow: '2px 2px 0 #1b3a5c' }}>
        <span>WERELD 1-3</span>
        <span>★ 12 &nbsp; ♥♥♥</span>
      </Abs>
    </div>
  )
}

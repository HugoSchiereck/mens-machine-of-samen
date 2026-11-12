// Verhaalkaarten: echte gebeurtenissen en systemen. De tekst staat in kaarten.json bij media:
// { "type": "mockup", "id": "verhaal", "beeld": "marsrover", "label": "Echt gebeurd · 2024", "tekst": "...", "icoon": "slot" }
// Met een beeld (zie ./beelden) toont de kaart die illustratie met een kort bijschrift.
// Zonder beeld valt hij terug op tekst met een icoon, bewust neutraal van kleur: geen HU-blauw (mens),
// navy (machine) of oranje (samen), zodat de kaart het antwoord niet verraadt.
import { BEELDEN } from './beelden/index.js'

const DISPLAY = "'Avenir Next', Avenir, 'Nunito Sans Variable', sans-serif"
const MONO = "'Geist Mono Variable', ui-monospace, monospace"
const SERIF = "Georgia, 'Times New Roman', serif"
const INKT = '#1a1a1a'
const GRIJS = '#6b6b6b'
const PAPIER = '#f3f3f1'

const lijn = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

const WORDLE = [
  [0.2, 1, 0.2, 0.55],
  [1, 0.55, 1, 0.2],
  [1, 1, 1, 1],
]

const ICONEN = {
  slot: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" {...lijn} />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" {...lijn} />
      <circle cx="12" cy="15.5" r="1.3" fill="currentColor" />
    </>
  ),
  code: <path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5.5l-3 13" {...lijn} />,
  blok: (
    <>
      <path d="M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7z" {...lijn} />
      <path d="M4.5 7.7L12 12l7.5-4.3M12 12v8.5" {...lijn} />
    </>
  ),
  tekst: (
    <>
      <path d="M6.5 3.5h7.5l4 4v13h-11.5z" {...lijn} />
      <path d="M14 3.5v4h4M9.5 12h5M9.5 15h5M9.5 18h3" {...lijn} />
    </>
  ),
  scan: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" {...lijn} />
      <circle cx="12" cy="12" r="3.5" {...lijn} />
      <path d="M12 5.5v2.5M12 16v2.5M5.5 12H8M16 12h2.5" {...lijn} />
    </>
  ),
  lijst: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" {...lijn} />
      <rect x="6" y="8" width="12" height="8" {...lijn} />
      <path d="M7 15.5l3-3 2.5 2.5 1.5-1.5 3 3" {...lijn} />
    </>
  ),
  schaak: (
    <>
      <circle cx="12" cy="7.5" r="2.8" {...lijn} />
      <path d="M9.5 12h5M10.3 12l-.8 5.5h5l-.8-5.5M8 20.5l1-3h6l1 3z" {...lijn} />
    </>
  ),
  telefoon: <path d="M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 6a2 2 0 0 1 2-2z" {...lijn} />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" {...lijn} />
      <path d="M4 7l8 6 8-6" {...lijn} />
    </>
  ),
  raster: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" {...lijn} />
      <path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17" {...lijn} />
    </>
  ),
  blokjes: (
    <>
      {WORDLE.map((rij, r) =>
        rij.map((o, k) => <rect key={`${r}-${k}`} x={3.2 + k * 4.6} y={5.6 + r * 4.6} width="3.8" height="3.8" rx="0.6" fill="currentColor" opacity={o} />),
      )}
    </>
  ),
  play: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="3" {...lijn} />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
    </>
  ),
  muziek: (
    <>
      <path d="M9 17.5V6l10-2v11.5" {...lijn} />
      <circle cx="6.8" cy="17.5" r="2.3" {...lijn} />
      <circle cx="16.8" cy="15.5" r="2.3" {...lijn} />
    </>
  ),
  chat: (
    <>
      <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H11l-4 3.5v-3.5H6.5a2 2 0 0 1-2-2z" {...lijn} />
      <path d="M8.5 10.3h7" {...lijn} />
    </>
  ),
  post: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" {...lijn} />
      <path d="M6.5 10.5h6M6.5 13.5h4" {...lijn} />
      <rect x="15" y="8" width="3" height="3.5" {...lijn} />
    </>
  ),
  wolk: (
    <>
      <path d="M7 16.5a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6 1.3A3.4 3.4 0 0 1 17 16.5z" {...lijn} />
      <path d="M3 20.5h9M14.5 20.5h3" {...lijn} />
    </>
  ),
  scherm: (
    <>
      <rect x="3" y="4.5" width="18" height="12" rx="1.5" {...lijn} />
      <path d="M9 20.5h6M12 16.5v4M10 8.5l4 4M14 8.5l-4 4" {...lijn} />
    </>
  ),
  bal: (
    <>
      <circle cx="12" cy="12" r="8.5" {...lijn} />
      <path d="M12 8.3l3.1 2.2-1.2 3.6h-3.8l-1.2-3.6z" {...lijn} />
      <path d="M12 3.5v4.8M15.1 10.5l4.2-1.3M13.9 14.1l2.6 3.6M10.1 14.1l-2.6 3.6M8.9 10.5L4.7 9.2" {...lijn} />
    </>
  ),
  camera: (
    <>
      <path d="M4 8.5a2 2 0 0 1 2-2h2l1.5-2h5l1.5 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" {...lijn} />
      <circle cx="12" cy="13" r="3.5" {...lijn} />
    </>
  ),
  rover: (
    <>
      <rect x="4.5" y="9" width="13" height="5" rx="1" {...lijn} />
      <path d="M17.5 10.5h2.5M11 9V5.5M8.5 5.5h5" {...lijn} />
      <circle cx="6.5" cy="17.5" r="2" {...lijn} />
      <circle cx="11" cy="17.5" r="2" {...lijn} />
      <circle cx="15.5" cy="17.5" r="2" {...lijn} />
    </>
  ),
}

export function Verhaal({ data = {} }) {
  const Beeld = BEELDEN[data.beeld]
  return Beeld ? <MetBeeld Beeld={Beeld} data={data} /> : <AlleenTekst data={data} />
}

// Illustratie over het hele podium, met onderaan een wit kaartje: label en het korte verhaal.
function MetBeeld({ Beeld, data }) {
  const { label = '', tekst = '' } = data
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: DISPLAY }}>
      <Beeld data={data} />
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 14,
          padding: '13px 16px 15px',
          borderRadius: 14,
          background: '#fff',
          color: INKT,
          boxShadow: '0 1px 2px rgba(0,0,0,.08), 0 12px 28px -12px rgba(0,0,0,.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.3, textTransform: 'uppercase', color: GRIJS }}>{label}</span>
        <p style={{ margin: 0, fontSize: 19, lineHeight: 1.3, fontWeight: 600, letterSpacing: -0.2, textWrap: 'pretty' }}>{tekst}</p>
      </div>
    </div>
  )
}

// Opbouw: icoon en label bovenaan, het verhaal groot onderaan, zoals een krantenaffiche.
// Hoe korter de tekst, hoe groter de letters, zodat elke kaart even vol oogt.
function AlleenTekst({ data = {} }) {
  const { label = '', tekst = '', citaat, icoon } = data
  const lengte = tekst.length + (citaat?.length ?? 0) * 0.8
  const grootte = lengte > 150 ? 24 : lengte > 125 ? 26 : lengte > 100 ? 28 : 31
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 28px 32px',
        background: PAPIER,
        color: INKT,
        fontFamily: DISPLAY,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            width: 56,
            height: 56,
            flex: 'none',
            borderRadius: 14,
            background: '#fff',
            boxShadow: '0 1px 2px rgba(26,26,26,.06), inset 0 0 0 1px rgba(26,26,26,.1)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            {ICONEN[icoon] ?? ICONEN.tekst}
          </svg>
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, lineHeight: 1.4, letterSpacing: 1.3, textTransform: 'uppercase', color: GRIJS }}>{label}</span>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <span style={{ width: 32, height: 3, borderRadius: 2, background: INKT }} />
        <p style={{ margin: 0, fontSize: grootte, lineHeight: 1.27, fontWeight: 700, letterSpacing: -0.3, textWrap: 'pretty' }}>{tekst}</p>
        {citaat && (
          <blockquote
            style={{
              margin: 0,
              paddingLeft: 14,
              borderLeft: `3px solid ${INKT}`,
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 17,
              lineHeight: 1.4,
              color: '#3a3a3a',
            }}
          >
            “{citaat}”
          </blockquote>
        )}
      </div>
    </div>
  )
}

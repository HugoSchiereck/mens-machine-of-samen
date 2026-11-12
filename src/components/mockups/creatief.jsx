// Creatieve kaarten: schoolfeest-flyer (making-of), sollicitatiebrief (making-of) en herfstgedicht.
import { Abs } from './website.jsx'

const DISPLAY = "'Avenir Next', Avenir, 'Nunito Sans Variable', sans-serif"
const SERIF = "Georgia, 'Times New Roman', serif"

function Discobal({ kleur = '#fff', schaduw = 'rgba(255,255,255,.35)' }) {
  const tegels = []
  for (let r = 0; r < 7; r++) {
    for (let k = 0; k < 7; k++) {
      const x = 8 + k * 12
      const y = 8 + r * 12
      const d = Math.hypot(x + 5 - 46, y + 5 - 46)
      if (d < 40) tegels.push(<rect key={`${r}-${k}`} x={x} y={y} width="10" height="10" rx="1.5" fill={kleur} opacity={0.35 + ((r * 7 + k) % 5) * 0.13} />)
    }
  }
  return (
    <svg width="92" height="92" viewBox="0 0 92 92">
      <circle cx="46" cy="46" r="42" fill={schaduw} />
      {tegels}
    </svg>
  )
}

export function SchoolfeestFlyer({ versie }) {
  const ai = versie === 'ai'
  if (ai) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#24212b' }}>
        <Abs x={18} y={14} w={324} h={452} s={{ background: 'linear-gradient(160deg, #ff3cac 0%, #784ba0 50%, #2b86c5 100%)', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,.5)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,.45), transparent 40%)' }} />
        </Abs>
        <Abs x={18} y={34} w={324} h={16} s={{ textAlign: 'center', color: '#ffe6ff', fontSize: 10, letterSpacing: 4 }}>
          JOUW SCHOOL PRESENTEERT
        </Abs>
        <Abs x={18} y={56} w={324} h={130} s={{ textAlign: 'center', fontFamily: DISPLAY, fontWeight: 900, fontStretch: '125%', fontSize: 58, lineHeight: '62px', color: '#fff', textShadow: '0 0 18px #ff9cf2, 0 3px 0 #a03ad6' }}>
          SCHOOL
          <br />
          FEEST
        </Abs>
        <Abs x={18} y={192} w={324} h={30} s={{ textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 22, color: '#fff7a8' }}>
          Unleash the vibes!
        </Abs>
        <Abs x={134} y={230} w={92} h={92}>
          <Discobal />
        </Abs>
        {[60, 290, 90, 270].map((x, i) => (
          <Abs key={i} x={x} y={240 + (i % 2) * 50} w={12} h={12} s={{ color: '#fff', fontSize: 14 }}>
            ✦
          </Abs>
        ))}
        <Abs x={18} y={334} w={324} h={38} s={{ textAlign: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 25, color: '#fff' }}>
          VRIJDAG 31 FEBRUARI
        </Abs>
        <Abs x={18} y={378} w={324} h={16} s={{ textAlign: 'center', fontSize: 9, color: 'rgba(255,214,250,.55)' }}>
          Aula · 20:00 – 23:30 · dresscode: sparkle
        </Abs>
        <Abs x={60} y={418} w={240} h={30} s={{ textAlign: 'center', fontSize: 13, color: '#fff', fontWeight: 700, background: 'rgba(255,255,255,.18)', borderRadius: 99, display: 'grid', placeItems: 'center' }}>
          Kaartjes €5 bij de receptoe
        </Abs>
      </div>
    )
  }
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#24212b' }}>
      <Abs x={18} y={14} w={324} h={452} s={{ background: '#ffd23f', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,.5)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: 150, width: 200, height: 200, borderRadius: '50%', background: '#ff4d1a' }} />
      </Abs>
      <Abs x={36} y={32} w={288} h={16} s={{ color: '#151515', fontSize: 10, letterSpacing: 3, fontWeight: 700 }}>
        JOUW SCHOOL PRESENTEERT
      </Abs>
      <Abs x={36} y={56} w={290} h={130} s={{ fontFamily: DISPLAY, fontWeight: 900, fontStretch: '70%', fontSize: 70, lineHeight: '62px', color: '#151515', letterSpacing: -1 }}>
        SCHOOL
        <br />
        FEEST
      </Abs>
      <Abs x={36} y={196} w={180} h={40} s={{ fontSize: 15, fontWeight: 700, color: '#151515', lineHeight: 1.15 }}>
        Dansen tot het licht aangaat.
      </Abs>
      <Abs x={218} y={214} w={92} h={92}>
        <Discobal kleur="#151515" schaduw="rgba(21,21,21,.12)" />
      </Abs>
      <Abs x={36} y={334} w={290} h={38} s={{ fontFamily: DISPLAY, fontWeight: 800, fontStretch: '80%', fontSize: 30, color: '#151515' }}>
        VRIJDAG 12 DECEMBER
      </Abs>
      <Abs x={36} y={374} w={290} h={22} s={{ fontSize: 15, color: '#151515', fontWeight: 700 }}>
        Aula · 20:00 – 23:30
      </Abs>
      <Abs x={36} y={418} w={230} h={30} s={{ fontSize: 13, color: '#ffd23f', fontWeight: 700, background: '#151515', borderRadius: 6, display: 'grid', placeItems: 'center' }}>
        Kaartjes €5 bij de balie
      </Abs>
    </div>
  )
}

function Papier({ children, x = 22, y = 12, w = 316, h = 456 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#d9d2c4' }}>
      <Abs x={x} y={y} w={w} h={h} s={{ background: '#fffdf8', boxShadow: '0 1px 0 #cfc7b6, 0 12px 30px rgba(60,40,10,.18)' }} />
      {children}
    </div>
  )
}

const brief = { fontFamily: SERIF, fontSize: 11, lineHeight: '15px', color: '#2b2620' }
const Gemarkeerd = ({ children }) => <span style={{ background: '#ffe9a8', padding: '0 2px' }}>{children}</span>

export function Sollicitatiebrief({ versie }) {
  if (versie === 'ai') {
    return (
      <Papier>
        <Abs x={44} y={30} w={272} h={16} s={{ ...brief, textAlign: 'right', fontSize: 10 }}>Kraaienburg, 3 oktober 2026</Abs>
        <Abs x={44} y={54} w={272} h={16} s={{ ...brief, fontWeight: 700, fontSize: 10.5 }}>
          Betreft: sollicitatie naar de functie van [functie]
        </Abs>
        <Abs x={44} y={78} w={272} h={16} s={brief}>Geachte heer/mevrouw,</Abs>
        <Abs x={44} y={100} w={272} h={30} s={brief}>
          Met groot enthousiasme solliciteer ik naar de functie van vakkenvuller bij [Naam winkel].
        </Abs>
        <Abs x={44} y={134} w={272} h={60} s={brief}>
          Als gedreven en resultaatgerichte professional met ruim vijf jaar ervaring in de retail ben ik ervan overtuigd dat ik een waardevolle aanwinst zal zijn voor uw dynamische team.
        </Abs>
        <Abs x={44} y={200} w={272} h={76} s={brief}>
          Mijn kernkwaliteiten zijn leiderschap, flexibiliteit, communicatieve vaardigheden, stressbestendigheid en klantgerichtheid. Ik gedij goed in een snel veranderende omgeving.
        </Abs>
        <Abs x={44} y={282} w={272} h={60} s={brief}>
          Graag licht ik in een persoonlijk gesprek toe hoe mijn passie en expertise kunnen bijdragen aan het succes van uw organisatie.
        </Abs>
        <Abs x={44} y={356} w={272} h={34} s={brief}>
          Met vriendelijke groet,
          <br />
          [Jouw naam]
        </Abs>
      </Papier>
    )
  }
  return (
    <Papier>
      <Abs x={44} y={30} w={272} h={16} s={{ ...brief, textAlign: 'right', fontSize: 10 }}>Kraaienburg, 3 oktober 2026</Abs>
      <Abs x={44} y={62} w={272} h={16} s={brief}>Beste mevrouw Bakker,</Abs>
      <Abs x={44} y={86} w={272} h={46} s={brief}>
        Ik ben Noor (15) en ik zag jullie vacature voor <Gemarkeerd>vakkenvuller op zaterdag</Gemarkeerd> bij Buurtsuper De Hoek.
      </Abs>
      <Abs x={44} y={140} w={272} h={30} s={brief}>
        Ik woon om de hoek en kan <Gemarkeerd>elke zaterdag van 8 tot 17 uur</Gemarkeerd>.
      </Abs>
      <Abs x={44} y={178} w={272} h={62} s={brief}>
        Ik heb nog geen bijbaan gehad, maar ik help al twee jaar in de kantine van mijn voetbalclub: bijvullen, afrekenen en opruimen.
      </Abs>
      <Abs x={44} y={248} w={272} h={30} s={brief}>
        Ik ben altijd op tijd en vind het leuk om mensen te helpen.
      </Abs>
      <Abs x={44} y={286} w={272} h={30} s={brief}>
        Mag ik een keer langskomen om kennis te maken?
      </Abs>
      <Abs x={44} y={336} w={272} h={34} s={brief}>
        Met vriendelijke groet,
        <br />
        Noor van Dijk
      </Abs>
      <Abs x={44} y={380} w={140} h={34}>
        <svg viewBox="0 0 140 34" width="140" height="34">
          <path d="M4 24c10-18 14-18 12 0s8-14 14-6 6 6 12-2 10-4 14 2 12-8 20-6 18 4 30-4" fill="none" stroke="#2a3f9e" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Abs>
    </Papier>
  )
}

const vers = { fontFamily: SERIF, fontSize: 14, lineHeight: '22px', color: '#2b2620', fontStyle: 'italic' }

export function Herfstgedicht() {
  return (
    <Papier x={30} y={30} w={300} h={420}>
      <Abs x={30} y={30} w={300} h={140} s={{ background: 'linear-gradient(180deg, #f6dcc0, transparent)', opacity: 0.6 }} />
      <Abs x={58} y={62} w={244} h={40} s={{ fontFamily: DISPLAY, fontWeight: 800, fontStretch: '115%', fontSize: 30, color: '#b4431a' }}>
        Herfst
      </Abs>
      <Abs x={58} y={118} w={260} h={92} s={vers}>
        De bladeren dwarrelen zacht naar beneden,
        <br />
        in rood en in goud en oranje gekleed.
        <br />
        De wind fluistert verhalen van vroeger,
        <br />
        van een zomer die niemand vergeet.
      </Abs>
      <Abs x={58} y={226} w={260} h={92} s={vers}>
        De dagen worden korter en stiller,
        <br />
        de regen tikt zacht op het raam.
        <br />
        De herfst is een tijd om te dromen
        <br />
        en dicht bij elkaar te zijn, tezaam.
      </Abs>
      {[
        [270, 360, 18, '#c2561f'],
        [236, 392, 13, '#d98a2b'],
        [292, 404, 10, '#9c3a17'],
      ].map(([x, y, s, kleur], i) => (
        <Abs key={i} x={x} y={y} w={s * 2} h={s * 2}>
          <svg viewBox="0 0 20 20" width={s * 2} height={s * 2} style={{ transform: `rotate(${i * 50 - 20}deg)` }}>
            <path d="M10 1c3 4 8 5 8 9s-4 8-8 9c-4-1-8-5-8-9s5-5 8-9z" fill={kleur} />
            <path d="M10 3v16" stroke="#fffdf8" strokeWidth="0.8" opacity="0.6" />
          </svg>
        </Abs>
      ))}
      <Abs x={58} y={410} w={200} h={16} s={{ fontFamily: SERIF, fontSize: 11, color: '#8c8273' }}>
        — ?
      </Abs>
    </Papier>
  )
}

// Ondernemen: pitch-slide voor een app-idee.
export function AppPitch() {
  const wensen = [
    ['Goedkoop', 18],
    ['Dichtbij', 12],
    ['Snel klaar', 9],
    ['Gezond', 4],
  ]
  const kaart = { background: '#fff', border: '1px solid #e6e2d8', borderRadius: 10, padding: '10px 12px' }
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f7f5ef', color: '#1a1a18' }}>
      <Abs x={16} y={8} w={328} h={16} s={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#8a867b' }}>
        <span>SnackRadar · pitch</span>
        <span>2 / 6</span>
      </Abs>
      <Abs x={16} y={34} w={328} h={44} s={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle cx="17" cy="17" r="15" fill="#ff6b2c" />
          <circle cx="17" cy="17" r="9" fill="none" stroke="#fff" strokeWidth="2" opacity=".7" />
          <circle cx="17" cy="17" r="3" fill="#fff" />
          <path d="M17 17L28 9" stroke="#fff" strokeWidth="2" />
        </svg>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: -1 }}>SnackRadar</span>
      </Abs>
      <Abs x={16} y={82} w={328} h={20} s={{ fontSize: 13, color: '#4a473f' }}>
        Vind de goedkoopste snack rond school.
      </Abs>
      <Abs x={16} y={112} w={328} h={52} s={{ fontSize: 11, lineHeight: 1.4, color: '#4a473f' }}>
        <b style={{ display: 'block', color: '#1a1a18', fontSize: 11.5 }}>Het probleem</b>
        Leerlingen geven te veel uit in de pauze en weten niet waar het goedkoopst is.
      </Abs>
      <Abs x={16} y={180} w={328} h={150} s={kaart}>
        <b style={{ fontSize: 11.5 }}>Wat leerlingen willen</b>
        <div style={{ display: 'grid', gap: 7, marginTop: 10 }}>
          {wensen.map(([w, n]) => (
            <div key={w} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 20px', alignItems: 'center', gap: 8, fontSize: 10.5 }}>
              <span>{w}</span>
              <span style={{ height: 10, borderRadius: 5, background: '#efece4', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${(n / 18) * 100}%`, background: '#ff6b2c', borderRadius: 5 }} />
              </span>
              <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9.5, color: '#8a867b', marginTop: 10 }}>Interviews met 22 leerlingen bij de schoolpoort</div>
      </Abs>
      <Abs x={16} y={341} w={328} h={57} s={kaart}>
        <b style={{ fontSize: 11.5 }}>Verdienmodel</b>
        <div style={{ fontSize: 10.5, color: '#4a473f', marginTop: 3 }}>Snackbars betalen € 0,50 per bestelling via de app.</div>
      </Abs>
      <Abs x={16} y={408} w={328} h={55} s={{ ...kaart, background: '#1a1a18', borderColor: '#1a1a18', color: '#fff' }}>
        <b style={{ fontSize: 11.5 }}>Volgende stap</b>
        <div style={{ fontSize: 10.5, opacity: 0.8, marginTop: 3 }}>Testen met drie snackbars bij school.</div>
      </Abs>
    </div>
  )
}

// Beeldtaal: mens = cirkel, machine = vierkant, samen = allebei.
// Alle iconen gebruiken currentColor, zodat de kleur uit het ontwerpsysteem komt.

const svg = (grootte, viewBox, children, extra = {}) => (
  <svg className="icoon" width={grootte} height={grootte} viewBox={viewBox} aria-hidden="true" {...extra}>
    {children}
  </svg>
)

export const IcoonMens = ({ grootte = 24 }) => svg(grootte, '0 0 24 24', <circle cx="12" cy="12" r="9" fill="currentColor" />)

export const IcoonMachine = ({ grootte = 24 }) => svg(grootte, '0 0 24 24', <rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="currentColor" />)

export const IcoonSamen = ({ grootte = 24 }) =>
  svg(
    grootte,
    '0 0 24 24',
    <>
      <circle cx="9" cy="12" r="7" fill="currentColor" />
      <rect x="9" y="5" width="12.5" height="14" rx="2.5" fill="currentColor" opacity="0.45" />
    </>,
  )

export const KEUZE_ICOON = { mens: IcoonMens, machine: IcoonMachine, samen: IcoonSamen }

const lijn = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IcoonCheck = ({ grootte = 16 }) => svg(grootte, '0 0 24 24', <path d="M5 12.5l4.5 4.5L19 7.5" {...lijn} strokeWidth={2.4} />)
export const IcoonKruis = ({ grootte = 16 }) => svg(grootte, '0 0 24 24', <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" {...lijn} strokeWidth={2.4} />)
export const IcoonPijl = ({ grootte = 18 }) => svg(grootte, '0 0 24 24', <path d="M5 12h14M13 6l6 6-6 6" {...lijn} />)
export const IcoonTerug = ({ grootte = 20 }) => svg(grootte, '0 0 24 24', <path d="M19 12H5M11 6l-6 6 6 6" {...lijn} />)
export const IcoonChevron = ({ grootte = 18 }) => svg(grootte, '0 0 24 24', <path d="M9 6l6 6-6 6" {...lijn} />)

export const IcoonDobbel = ({ grootte = 20 }) =>
  svg(
    grootte,
    '0 0 24 24',
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" {...lijn} />
      <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" />
    </>,
  )

export const IcoonVlam = ({ grootte = 16 }) =>
  svg(grootte, '0 0 24 24', <path d="M12 2.5c.8 3.6 5.5 5.6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.6 1.4-4.4 2.6-5.4.1 1.8.9 3 2 3.3-.4-3.3-.2-6.2.9-8.9z" fill="currentColor" />)

export const IcoonKoffer = ({ grootte = 18 }) =>
  svg(
    grootte,
    '0 0 24 24',
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" {...lijn} />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" {...lijn} />
    </>,
  )

export const IcoonKlok = ({ grootte = 16 }) =>
  svg(
    grootte,
    '0 0 24 24',
    <>
      <circle cx="12" cy="12" r="8.5" {...lijn} />
      <path d="M12 7.5V12l3 2" {...lijn} />
    </>,
  )

// Logo van Hogeschool Utrecht (officiële bestanden van hu.nl, in /public).
export function HuLogo({ klein = false, hoogte }) {
  return <img className="hu-logo" src={klein ? '/hu-logo-klein.svg' : '/hu-logo.svg'} alt="Hogeschool Utrecht" style={{ height: hoogte }} />
}

// Woordmerk: HU-logo + naam van het spel. `groot` voor de lobby, `vol` voor het grote scherm.
export function Merk({ groot = false, vol = false }) {
  if (groot) {
    return (
      <div className="merk-blok">
        <HuLogo hoogte={34} />
        <h1 className="merk-groot" aria-label="Mens, machine of samen?">
          <span className="t-mens">Mens,</span> <span className="t-machine">machine</span>
          <br />
          of <span className="t-samen">samen?</span>
        </h1>
      </div>
    )
  }
  return (
    <span className="merk">
      <HuLogo klein={!vol} hoogte={vol ? undefined : 22} />
      <span className="merk-scheiding" aria-hidden="true" />
      Mens, machine of samen?
    </span>
  )
}

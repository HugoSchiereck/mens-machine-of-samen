// Spelregels: kaarten kiezen voor een ronde, punten tellen en de AI-radar berekenen.
import data from '../data/kaarten.json'
import banenData from '../data/banen.json'

export const KAARTEN = data.kaarten
export const BONUS = data.bonus
export const KAART_PER_ID = Object.fromEntries([...KAARTEN, BONUS].map((k) => [k.id, k]))
export const BANEN = banenData.banen
export const BAAN_PER_ID = Object.fromEntries(BANEN.map((b) => [b.id, b]))
export const ONDERWERPEN = banenData.onderwerpen

// "Werken met AI" -> "werken met AI", voor midden in een zin.
export const onderwerpInZin = (id) => {
  const label = ONDERWERPEN[id] ?? id
  return label.charAt(0).toLowerCase() + label.slice(1)
}

export const KAARTEN_PER_RONDE = 8
export const SECONDEN_PER_KAART = 30

export const KEUZES = {
  mens: { label: 'Mens', richting: 'links' },
  machine: { label: 'Machine', richting: 'rechts' },
  samen: { label: 'Samen', richting: 'omhoog' },
}

export const CATEGORIEEN = {
  sport: { label: 'Sport', zin: 'bij sport' },
  creatief: { label: 'Creatief', zin: 'bij creatief werk' },
  'school-werk': { label: 'School & werk', zin: 'op school en in je bijbaan' },
  zorg: { label: 'Zorg', zin: 'in de zorg' },
  natuur: { label: 'Natuur', zin: 'in de natuur en op de boerderij' },
  verkeer: { label: 'Verkeer', zin: 'in het verkeer en op het water' },
  'muziek-games': { label: 'Muziek & games', zin: 'in muziek en games' },
}

export const HOBBYWERELDEN = [
  { id: 'sport', label: 'Sport' },
  { id: 'muziek-games', label: 'Muziek & games' },
  { id: 'creatief', label: 'Creatief' },
  { id: 'zorg', label: 'Zorg & mensen' },
  { id: 'natuur', label: 'Natuur & dieren' },
  { id: 'verkeer', label: 'Techniek & verkeer' },
  { id: 'school-werk', label: 'School & werk' },
]

export const SOORT_LABEL = {
  ontwerp: 'Ontwerp',
  tekst: 'Tekst',
  code: 'Code',
  'echte-wereld': 'Echte wereld',
  'echt-gebeurd': 'Echt gebeurd',
  verrassing: 'Verrassing',
  game: 'Game',
  geluid: 'Geluid',
  presentatie: 'Presentatie',
}

const schud = (lijst) => {
  const a = [...lijst]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Telt hoe vaak de volgorde de regels breekt: twee dezelfde soorten na elkaar (zwaar),
// of drie dezelfde antwoorden na elkaar (licht).
function overtredingen(volgorde) {
  let n = 0
  for (let i = 1; i < volgorde.length; i++) {
    if (volgorde[i].soort === volgorde[i - 1].soort) n += 10
    if (i > 1 && volgorde[i].antwoord === volgorde[i - 1].antwoord && volgorde[i].antwoord === volgorde[i - 2].antwoord) n += 1
  }
  return n
}

// Kies 8 kaarten: ±30% mens, ±30% machine, ±40% samen, met voorrang voor de hobbywereld,
// minstens twee kaarten met een making-of, en nooit twee dezelfde soorten na elkaar.
export function maakRonde({ hobby, aantal = KAARTEN_PER_RONDE, gezien = [] } = {}) {
  const pool = KAARTEN.filter((k) => k.actief !== false)
  const samen = Math.round(aantal * 0.4)
  const rest = aantal - samen
  const [veel, weinig] = Math.random() < 0.5 ? ['mens', 'machine'] : ['machine', 'mens']
  const quota = { samen, [veel]: Math.ceil(rest / 2), [weinig]: Math.floor(rest / 2) }

  const waarde = (k) => (k.hobbyWereld === hobby ? 3 : 0) + (k.makingOf ? 1 : 0) - (gezien.includes(k.id) ? 4 : 0) + Math.random() * 2

  let gekozen = []
  for (const [antwoord, n] of Object.entries(quota)) {
    const kandidaten = pool.filter((k) => k.antwoord === antwoord).sort((a, b) => waarde(b) - waarde(a))
    gekozen.push(...kandidaten.slice(0, n))
  }
  // Te weinig kaarten van een soort antwoord? Vul aan met wat er over is.
  if (gekozen.length < aantal) {
    const over = schud(pool.filter((k) => !gekozen.includes(k)))
    gekozen.push(...over.slice(0, aantal - gekozen.length))
  }

  // Zorg voor minstens twee making-ofs (wissel binnen hetzelfde antwoord).
  const metMakingOf = () => gekozen.filter((k) => k.makingOf).length
  for (const extra of schud(pool.filter((k) => k.makingOf && !gekozen.includes(k)))) {
    if (metMakingOf() >= 2) break
    const i = gekozen.findIndex((k) => !k.makingOf && k.antwoord === extra.antwoord && k.hobbyWereld !== hobby)
    if (i >= 0) gekozen[i] = extra
  }

  let beste = gekozen
  let besteScore = Infinity
  for (let poging = 0; poging < 300 && besteScore > 0; poging++) {
    const volgorde = schud(gekozen)
    const score = overtredingen(volgorde)
    if (score < besteScore) {
      beste = volgorde
      besteScore = score
    }
  }
  return beste
}

// Punten voor één kaart. `reeks` is het aantal goede antwoorden op rij, inclusief deze kaart.
export function puntenVoorKaart({ goed, resterend, reeks }) {
  if (!goed) return { basis: 0, snelheid: 0, factor: 1, totaal: 0 }
  const basis = 100
  const snelheid = Math.round(50 * Math.max(0, Math.min(1, resterend / SECONDEN_PER_KAART)))
  const factor = reeks >= 5 ? 2 : reeks >= 3 ? 1.5 : 1
  return { basis, snelheid, factor, totaal: Math.round((basis + snelheid) * factor) }
}

export const PUNTEN_PER_FOUT = 100
export const PUNTEN_PER_OVERLAP = 50

// Treft een tik (relatieve x/y op het 3:4-podium) een fout? Afstand gemeten in podium-pixels.
export function raakt(tik, plek, marge = 1) {
  const dx = (tik.x - plek.x) * 360
  const dy = (tik.y - plek.y) * 480
  return Math.hypot(dx, dy) <= plek.straal * 360 * marge
}

export function welkeFout(tik, fouten, marge = 1) {
  let beste = -1
  let besteAfstand = Infinity
  fouten.forEach((f, i) => {
    for (const plek of [f, ...(f.extra ?? [])]) {
      if (!raakt(tik, plek, marge)) continue
      const d = Math.hypot((tik.x - plek.x) * 360, (tik.y - plek.y) * 480)
      if (d < besteAfstand) {
        beste = i
        besteAfstand = d
      }
    }
  })
  return beste
}

// AI-radar: per categorie hoeveel AI de bezoeker dacht te zien t.o.v. de werkelijkheid.
// mens = 0, samen = 1, machine = 2. Positief = overschat AI, negatief = onderschat AI.
const AI_AANDEEL = { mens: 0, samen: 1, machine: 2 }

export function berekenRadar(antwoorden) {
  const radar = {}
  for (const a of antwoorden) {
    const kaart = KAART_PER_ID[a.kaartId]
    if (!kaart) continue
    const r = (radar[kaart.categorie] ??= { som: 0, n: 0, overschat: 0, onderschat: 0 })
    r.n++
    if (!a.keuze) continue
    const verschil = AI_AANDEEL[a.keuze] - AI_AANDEEL[kaart.antwoord]
    r.som += verschil
    if (verschil > 0) r.overschat++
    if (verschil < 0) r.onderschat++
  }
  return radar
}

export function radarZin(radar) {
  const lijst = Object.entries(radar).filter(([, r]) => r.n > 0)
  const onder = lijst.filter(([, r]) => r.som < 0).sort((a, b) => a[1].som - b[1].som)[0]
  const over = lijst.filter(([, r]) => r.som > 0).sort((a, b) => b[1].som - a[1].som)[0]
  const zin = (cat) => CATEGORIEEN[cat]?.zin ?? cat
  if (onder && over) return `Je onderschat AI ${zin(onder[0])} en overschat het ${zin(over[0])}.`
  if (onder) return `Je onderschat AI ${zin(onder[0])}. Er zit vaker ICT achter dan je denkt.`
  if (over) return `Je overschat AI ${zin(over[0])}. Daar doen mensen meer dan je denkt.`
  return 'Je schat AI overal precies goed in. Knap!'
}

// Banen die in een ronde voorbijkwamen, inclusief de bonuskaart.
export function banenVanRonde(antwoorden) {
  const ids = new Set(BONUS.banen ?? [])
  for (const a of antwoorden) for (const b of KAART_PER_ID[a.kaartId]?.onthulling.banen ?? []) ids.add(b)
  return [...ids].filter((id) => BAAN_PER_ID[id])
}

// Interesse per onderwerp uit de 1–5-beoordelingen ("hoe leuk vind je dit onderwerp?").
export function interessePerOnderwerp(beoordelingen) {
  const som = {}
  const n = {}
  for (const [kaartId, waarde] of Object.entries(beoordelingen ?? {})) {
    const onderwerp = KAART_PER_ID[kaartId]?.onderwerp
    if (!onderwerp || !waarde) continue
    som[onderwerp] = (som[onderwerp] ?? 0) + waarde
    n[onderwerp] = (n[onderwerp] ?? 0) + 1
  }
  return Object.fromEntries(
    Object.keys(som).map((o) => {
      const gem = som[o] / n[o]
      return [o, { gem, score: (gem - 1) / 4, n: n[o] }] // score 0..1
    }),
  )
}

// Jouw ICT-match. Per baan: gewogen gemiddelde van je interesse in de onderwerpen van die baan.
// Heb je maar een klein deel van die onderwerpen gezien, of elk onderwerp maar één keer
// beoordeeld, dan schuift de score naar 50%. Zo levert één toevallig hoge beoordeling
// geen 100% match op; hoe meer rondes je speelt, hoe zekerder de match.
export function berekenMatch(beoordelingen) {
  const interesse = interessePerOnderwerp(beoordelingen)
  const uitkomst = []
  for (const baan of BANEN) {
    let totaal = 0
    let gezien = 0
    let som = 0
    const redenen = []
    for (const [onderwerp, gewicht] of Object.entries(baan.onderwerpen ?? {})) {
      totaal += gewicht
      const i = interesse[onderwerp]
      if (!i) continue
      const bewijs = Math.min(1, (i.n + 1) / 3) // 1 beoordeling = 2/3 zeker, 2+ = zeker
      gezien += gewicht * bewijs
      som += gewicht * bewijs * i.score
      redenen.push({ onderwerp, label: ONDERWERPEN[onderwerp], gem: i.gem, gewicht })
    }
    const zekerheid = totaal ? gezien / totaal : 0
    if (zekerheid < 0.3) continue
    const ruw = som / gezien
    const pct = Math.round(100 * (ruw * zekerheid + 0.5 * (1 - zekerheid)))
    redenen.sort((a, b) => b.gewicht * b.gem - a.gewicht * a.gem)
    uitkomst.push({ baan, pct, zekerheid, redenen })
  }
  return uitkomst.sort((a, b) => b.pct - a.pct || b.zekerheid - a.zekerheid)
}

export function salarisTekst(baan) {
  const s = baan?.startsalaris
  if (!s?.van) return null
  const euro = (n) => `€ ${n.toLocaleString('nl-NL')}`
  return `${s.tot ? `${euro(s.van)} – ${euro(s.tot)}` : `vanaf ${euro(s.van)}`} bruto per maand`
}

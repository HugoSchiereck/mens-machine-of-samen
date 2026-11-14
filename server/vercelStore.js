import { neon } from '@neondatabase/serverless'
import { schoonBijnaam } from '../src/lib/bijnaam.js'

const KEUZES = ['mens', 'machine', 'samen']
const ROLLEN = ['scholier', 'ouder']

function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ontbreekt')
  return neon(process.env.DATABASE_URL)
}

export async function initDatabase() {
  const sql = database()
  await sql`
    CREATE TABLE IF NOT EXISTS spel_events (
      event_id text PRIMARY KEY,
      dag date NOT NULL,
      payload jsonb NOT NULL,
      ontvangen_at timestamptz NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS spel_events_dag_idx ON spel_events (dag)`
  return sql
}

const TIJDZONE = 'Europe/Amsterdam'
const vandaag = () => new Intl.DateTimeFormat('sv-SE', { timeZone: TIJDZONE }).format(new Date())
const tekst = (v, max = 40) => (typeof v === 'string' ? v.slice(0, max) : '')
const getal = (v, min, max) => (Number.isFinite(v) && v >= min && v <= max ? Math.round(v) : null)

function leegDag(datum) {
  return { datum, spelers: {}, stemmen: {}, leuk: {}, matches: {}, makingOfs: {}, gesprekken: [] }
}

function verwerk(d, e) {
  if (!e || typeof e !== 'object' || typeof e.type !== 'string') return
  const id = tekst(e.spelerId, 64)
  const nu = Number.isFinite(e.t) ? e.t : Date.now()
  switch (e.type) {
    case 'join': {
      if (!id) return
      const bestaand = d.spelers[id]
      d.spelers[id] = {
        id, bijnaam: schoonBijnaam(e.bijnaam),
        rol: ROLLEN.includes(e.rol) ? e.rol : 'scholier',
        hobby: tekst(e.hobby, 20) || null,
        angstVoor: bestaand?.angstVoor ?? getal(e.angstVoor, 1, 5),
        angstNa: bestaand?.angstNa ?? null, score: bestaand?.score ?? 0,
        rondes: bestaand?.rondes ?? 0, laatsteRonde: bestaand?.laatsteRonde ?? null,
        klaar: bestaand?.klaar ?? false, sinds: bestaand?.sinds ?? nu,
      }
      return
    }
    case 'stem': {
      const kaartId = tekst(e.kaartId, 60)
      if (!kaartId) return
      const s = (d.stemmen[kaartId] ??= { mens: 0, machine: 0, samen: 0, geen: 0, goed: 0, fout: 0 })
      if (KEUZES.includes(e.keuze)) s[e.keuze]++
      else s.geen++
      e.goed ? s.goed++ : s.fout++
      d.laatsteKaart = kaartId
      return
    }
    case 'klaar': {
      const speler = d.spelers[id]
      if (!speler) return
      const score = getal(e.score, 0, 100000) ?? 0
      speler.score = Math.max(speler.score, score)
      const rondeId = tekst(e.rondeId, 64)
      const nieuweRonde = !rondeId || rondeId !== speler.laatsteRonde
      if (nieuweRonde) speler.rondes++
      speler.laatsteRonde = rondeId
      const match = tekst(e.match, 40)
      if (nieuweRonde && match) d.matches[match] = (d.matches[match] ?? 0) + 1
      speler.klaar = true
      speler.angstNa ??= getal(e.angstNa, 1, 5)
      return
    }
    case 'leuk': {
      const kaartId = tekst(e.kaartId, 60)
      const waarde = getal(e.waarde, 1, 5)
      if (!kaartId || !waarde) return
      const l = (d.leuk[kaartId] ??= { som: 0, n: 0, onderwerp: tekst(e.onderwerp, 40) || null })
      l.som += waarde
      l.n++
      return
    }
    case 'makingof': {
      const kaartId = tekst(e.kaartId, 60)
      if (kaartId) d.makingOfs[kaartId] = (d.makingOfs[kaartId] ?? 0) + 1
      return
    }
    case 'gesprek':
      d.gesprekken.push(nu)
  }
}

const gem = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)

export function maakStats(rows, spelerId) {
  const d = leegDag(vandaag())
  for (const row of rows) verwerk(d, typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload)
  const spelers = Object.values(d.spelers)
  const klaar = spelers.filter((s) => s.klaar)
  const ranglijst = [...klaar].sort((a, b) => b.score - a.score || a.sinds - b.sinds)
  const paren = spelers.filter((s) => s.angstVoor && s.angstNa)
  const perRol = (rol) => {
    const groep = klaar.filter((s) => s.rol === rol)
    return { gem: gem(groep.map((s) => s.score)), n: groep.length }
  }
  let inGetrapt = null
  for (const [kaartId, s] of Object.entries(d.stemmen)) {
    const totaal = s.goed + s.fout
    if (totaal < 3) continue
    const pctFout = s.fout / totaal
    if (!inGetrapt || pctFout > inGetrapt.pctFout) inGetrapt = { kaartId, pctFout, totaal }
  }
  const perUur = {}
  for (const t of d.gesprekken) {
    const uur = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: TIJDZONE }).format(new Date(t)))
    perUur[uur] = (perUur[uur] ?? 0) + 1
  }
  const onderwerpen = {}
  for (const l of Object.values(d.leuk)) {
    if (!l.onderwerp) continue
    const o = (onderwerpen[l.onderwerp] ??= { som: 0, n: 0 })
    o.som += l.som; o.n += l.n
  }
  const topMatch = Object.entries(d.matches).sort((a, b) => b[1] - a[1])[0]
  const positie = spelerId ? ranglijst.findIndex((s) => s.id === spelerId) + 1 || null : null
  return {
    datum: d.datum, aantalSpelers: spelers.length, aantalKlaar: klaar.length, kaarten: d.stemmen,
    laatsteKaart: d.laatsteKaart ?? null,
    ranglijst: ranglijst.slice(0, 10).map(({ id, bijnaam, rol, score }) => ({ id, bijnaam, rol, score })),
    positie, ouderVsKind: { scholier: perRol('scholier'), ouder: perRol('ouder') },
    angst: {
      voor: gem(spelers.map((s) => s.angstVoor).filter(Boolean)),
      na: gem(klaar.map((s) => s.angstNa).filter(Boolean)),
      paarVoor: gem(paren.map((s) => s.angstVoor)), paarNa: gem(paren.map((s) => s.angstNa)), nPaar: paren.length,
    },
    inGetrapt, makingOfs: d.makingOfs,
    leuk: Object.fromEntries(Object.entries(d.leuk).map(([k, l]) => [k, { gem: l.som / l.n, n: l.n }])),
    onderwerpen: Object.fromEntries(Object.entries(onderwerpen).map(([k, o]) => [k, { gem: o.som / o.n, n: o.n }])),
    matches: d.matches, topMatch: topMatch ? { baanId: topMatch[0], n: topMatch[1] } : null,
    gesprekken: { totaal: d.gesprekken.length, perUur },
    recent: [...spelers].sort((a, b) => b.sinds - a.sinds).slice(0, 8).map(({ bijnaam, rol, sinds }) => ({ bijnaam, rol, sinds })),
  }
}

export async function addEvents(events) {
  const sql = await initDatabase()
  const dag = vandaag()
  for (const event of events) {
    if (!event || typeof event !== 'object') continue
    const eventId = tekst(event.eventId, 120) || crypto.randomUUID()
    const payload = { ...event }
    if (payload.type === 'join') payload.bijnaam = schoonBijnaam(payload.bijnaam)
    await sql`INSERT INTO spel_events (event_id, dag, payload) VALUES (${eventId}, ${dag}, ${JSON.stringify(payload)}::jsonb) ON CONFLICT (event_id) DO NOTHING`
  }
}

export async function getStats(spelerId) {
  const sql = await initDatabase()
  const rows = await sql`SELECT payload FROM spel_events WHERE dag = ${vandaag()} ORDER BY ontvangen_at, event_id`
  return maakStats(rows, spelerId)
}

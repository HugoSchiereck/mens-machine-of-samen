// Kleine server voor de open dag: serveert de app, ontvangt spelgebeurtenissen
// en stuurt live statistieken naar het grote scherm (Server-Sent Events).
// Geen database nodig: alles staat per dag in data/JJJJ-MM-DD.json.

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { schoonBijnaam } from '../src/lib/bijnaam.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const DATA = path.join(ROOT, 'data')
const PORT = Number(process.env.PORT) || 4747
const KEUZES = ['mens', 'machine', 'samen']
const ROLLEN = ['scholier', 'ouder']

fs.mkdirSync(DATA, { recursive: true })

// ---------- opslag ----------

const vandaag = () => new Date().toLocaleDateString('sv-SE') // JJJJ-MM-DD in lokale tijd

function leegDag(datum) {
  return { datum, spelers: {}, stemmen: {}, leuk: {}, matches: {}, makingOfs: {}, gesprekken: [], gezien: [] }
}

function laadDag(datum) {
  const bestand = path.join(DATA, `${datum}.json`)
  try {
    return { ...leegDag(datum), ...JSON.parse(fs.readFileSync(bestand, 'utf8')) }
  } catch {
    return leegDag(datum)
  }
}

let dag = laadDag(vandaag())
let gezien = new Set(dag.gezien)
let opslaanTimer = null

function huidigeDag() {
  if (dag.datum !== vandaag()) {
    dag = laadDag(vandaag())
    gezien = new Set(dag.gezien)
  }
  return dag
}

function opslaan() {
  clearTimeout(opslaanTimer)
  opslaanTimer = setTimeout(() => {
    dag.gezien = [...gezien]
    const bestand = path.join(DATA, `${dag.datum}.json`)
    fs.writeFile(bestand + '.tmp', JSON.stringify(dag), (err) => {
      if (!err) fs.rename(bestand + '.tmp', bestand, () => {})
    })
  }, 400)
}

// ---------- gebeurtenissen ----------

const tekst = (v, max = 40) => (typeof v === 'string' ? v.slice(0, max) : '')
const getal = (v, min, max) => (Number.isFinite(v) && v >= min && v <= max ? Math.round(v) : null)

function verwerk(e) {
  const d = huidigeDag()
  if (!e || typeof e !== 'object' || typeof e.type !== 'string') return null
  if (e.eventId) {
    if (gezien.has(e.eventId)) return null // al ontvangen (outbox stuurt soms dubbel)
    gezien.add(e.eventId)
  }
  const id = tekst(e.spelerId, 64)
  const nu = Date.now()

  switch (e.type) {
    case 'join': {
      if (!id) return null
      const bijnaam = schoonBijnaam(e.bijnaam)
      const bestaand = d.spelers[id]
      d.spelers[id] = {
        id,
        bijnaam,
        rol: ROLLEN.includes(e.rol) ? e.rol : 'scholier',
        hobby: tekst(e.hobby, 20) || null,
        angstVoor: bestaand?.angstVoor ?? getal(e.angstVoor, 1, 5),
        angstNa: bestaand?.angstNa ?? null,
        score: bestaand?.score ?? 0,
        rondes: bestaand?.rondes ?? 0,
        laatsteRonde: bestaand?.laatsteRonde ?? null,
        klaar: bestaand?.klaar ?? false,
        sinds: bestaand?.sinds ?? nu,
      }
      return { type: 'join', bijnaam, rol: d.spelers[id].rol, t: nu }
    }
    case 'stem': {
      const kaartId = tekst(e.kaartId, 60)
      if (!kaartId) return null
      const s = (d.stemmen[kaartId] ??= { mens: 0, machine: 0, samen: 0, geen: 0, goed: 0, fout: 0 })
      if (KEUZES.includes(e.keuze)) s[e.keuze]++
      else s.geen++
      e.goed ? s.goed++ : s.fout++
      d.laatsteKaart = kaartId
      const speler = d.spelers[id]
      return { type: 'stem', kaartId, keuze: e.keuze ?? null, bijnaam: speler?.bijnaam ?? null, t: nu }
    }
    case 'klaar': {
      const speler = d.spelers[id]
      if (!speler) return null
      const score = getal(e.score, 0, 100000) ?? 0
      speler.score = Math.max(speler.score, score)
      // Dezelfde ronde kan vaker binnenkomen (bijv. na making-of-punten): dan alleen de score bijwerken.
      const rondeId = tekst(e.rondeId, 64)
      const nieuweRonde = !rondeId || rondeId !== speler.laatsteRonde
      if (nieuweRonde) speler.rondes++
      speler.laatsteRonde = rondeId
      const match = tekst(e.match, 40)
      if (nieuweRonde && match) d.matches[match] = (d.matches[match] ?? 0) + 1
      speler.klaar = true
      speler.angstNa ??= getal(e.angstNa, 1, 5)
      return { type: 'klaar', bijnaam: speler.bijnaam, rol: speler.rol, score, t: nu }
    }
    case 'leuk': {
      // "Hoe leuk vind je dit onderwerp?" (1–5), per kaart en per onderwerp
      const kaartId = tekst(e.kaartId, 60)
      const waarde = getal(e.waarde, 1, 5)
      if (!kaartId || !waarde) return null
      const l = (d.leuk[kaartId] ??= { som: 0, n: 0, onderwerp: tekst(e.onderwerp, 40) || null })
      l.som += waarde
      l.n++
      return null
    }
    case 'makingof': {
      const kaartId = tekst(e.kaartId, 60)
      if (!kaartId) return null
      d.makingOfs[kaartId] = (d.makingOfs[kaartId] ?? 0) + 1
      return { type: 'makingof', kaartId, t: nu }
    }
    case 'gesprek': {
      d.gesprekken.push(nu)
      return { type: 'gesprek', t: nu }
    }
    default:
      return null
  }
}

// ---------- statistieken ----------

const gem = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)

function statistieken(spelerId) {
  const d = huidigeDag()
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
    const uur = new Date(t).getHours()
    perUur[uur] = (perUur[uur] ?? 0) + 1
  }

  const onderwerpen = {}
  for (const l of Object.values(d.leuk)) {
    if (!l.onderwerp) continue
    const o = (onderwerpen[l.onderwerp] ??= { som: 0, n: 0 })
    o.som += l.som
    o.n += l.n
  }
  const topMatch = Object.entries(d.matches).sort((a, b) => b[1] - a[1])[0]

  const positie = spelerId ? ranglijst.findIndex((s) => s.id === spelerId) + 1 || null : null

  return {
    datum: d.datum,
    aantalSpelers: spelers.length,
    aantalKlaar: klaar.length,
    kaarten: d.stemmen,
    laatsteKaart: d.laatsteKaart ?? null,
    ranglijst: ranglijst.slice(0, 10).map(({ id, bijnaam, rol, score }) => ({ id, bijnaam, rol, score })),
    positie,
    ouderVsKind: { scholier: perRol('scholier'), ouder: perRol('ouder') },
    angst: {
      voor: gem(spelers.map((s) => s.angstVoor).filter(Boolean)),
      na: gem(klaar.map((s) => s.angstNa).filter(Boolean)),
      paarVoor: gem(paren.map((s) => s.angstVoor)),
      paarNa: gem(paren.map((s) => s.angstNa)),
      nPaar: paren.length,
    },
    inGetrapt,
    makingOfs: d.makingOfs,
    leuk: Object.fromEntries(Object.entries(d.leuk).map(([k, l]) => [k, { gem: l.som / l.n, n: l.n }])),
    onderwerpen: Object.fromEntries(Object.entries(onderwerpen).map(([k, o]) => [k, { gem: o.som / o.n, n: o.n }])),
    matches: d.matches,
    topMatch: topMatch ? { baanId: topMatch[0], n: topMatch[1] } : null,
    gesprekken: { totaal: d.gesprekken.length, perUur },
    recent: [...spelers]
      .sort((a, b) => b.sinds - a.sinds)
      .slice(0, 8)
      .map(({ bijnaam, rol, sinds }) => ({ bijnaam, rol, sinds })),
  }
}

// ---------- live (SSE) ----------

const luisteraars = new Set()
let pushTimer = null

function zend(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
}

function pushStats() {
  if (pushTimer) return
  pushTimer = setTimeout(() => {
    pushTimer = null
    const stats = statistieken()
    for (const res of luisteraars) zend(res, 'stats', stats)
  }, 250)
}

setInterval(() => {
  for (const res of luisteraars) res.write(': ping\n\n')
}, 20000)

// ---------- http ----------

function lanAdressen() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => i.address)
}

function json(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(data))
}

function leesBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 20000) reject(new Error('te groot'))
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch (err) {
        reject(err)
      }
    })
  })
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.ico': 'image/x-icon',
}

function statisch(req, res, pad) {
  if (!fs.existsSync(DIST)) {
    res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' })
    return res.end('Nog geen build gevonden. Draai eerst: npm run build')
  }
  let bestand = path.normalize(path.join(DIST, decodeURIComponent(pad)))
  if (!bestand.startsWith(DIST)) {
    res.writeHead(403)
    return res.end()
  }
  if (!fs.existsSync(bestand) || fs.statSync(bestand).isDirectory()) bestand = path.join(DIST, 'index.html')
  const ext = path.extname(bestand)
  const cache = bestand.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache'
  res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream', 'cache-control': cache })
  fs.createReadStream(bestand).pipe(res)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  const pad = url.pathname

  if (pad === '/api/event' && req.method === 'POST') {
    try {
      const body = await leesBody(req)
      const events = Array.isArray(body) ? body : [body]
      for (const e of events) {
        const feed = verwerk(e)
        if (feed) for (const l of luisteraars) zend(l, 'feed', feed)
      }
      opslaan()
      pushStats()
      return json(res, 200, { ok: true })
    } catch {
      return json(res, 400, { ok: false })
    }
  }

  if (pad === '/api/stats') return json(res, 200, statistieken(url.searchParams.get('speler')))

  if (pad === '/api/info') return json(res, 200, { adressen: lanAdressen(), poort: PORT })

  if (pad === '/api/stream') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    })
    zend(res, 'stats', statistieken())
    luisteraars.add(res)
    req.on('close', () => luisteraars.delete(res))
    return
  }

  if (pad.startsWith('/api/')) return json(res, 404, { ok: false })

  statisch(req, res, pad)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Poort ${PORT} is al bezet. Start met een andere poort, bijv.: PORT=4848 npm start\n`)
    process.exit(1)
  }
  throw err
})

server.listen(PORT, '0.0.0.0', () => {
  const adressen = lanAdressen()
  console.log(`\n  Mens, Machine of Samen? draait op poort ${PORT}`)
  console.log(`  Telefoon:     ${adressen.map((a) => `http://${a}:${PORT}`).join('  ') || `http://localhost:${PORT}`}`)
  console.log(`  Groot scherm: http://localhost:${PORT}/scherm`)
  console.log(`  Team-stats:   http://localhost:${PORT}/stats\n`)
})

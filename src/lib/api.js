// Praten met de server. Gebeurtenissen gaan via een outbox in localStorage:
// valt de wifi weg, dan speel je gewoon door en synchroniseert de ranglijst later.
import { useEffect, useState } from 'react'

const OUTBOX = 'mms-outbox'
const PROFIEL = 'mms-profiel'

export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

function lees(sleutel, standaard) {
  try {
    return JSON.parse(localStorage.getItem(sleutel)) ?? standaard
  } catch {
    return standaard
  }
}

function schrijf(sleutel, waarde) {
  try {
    localStorage.setItem(sleutel, JSON.stringify(waarde))
  } catch {
    /* privémodus of vol: niet erg */
  }
}

export const laadProfiel = () => lees(PROFIEL, null)
export const bewaarProfiel = (profiel) => schrijf(PROFIEL, profiel)

let bezig = false

async function leegOutbox() {
  if (bezig) return
  const wachtrij = lees(OUTBOX, [])
  if (!wachtrij.length) return
  bezig = true
  try {
    const res = await fetch('/api/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(wachtrij),
    })
    if (res.ok) {
      const verstuurd = new Set(wachtrij.map((e) => e.eventId))
      schrijf(OUTBOX, lees(OUTBOX, []).filter((e) => !verstuurd.has(e.eventId)))
    }
  } catch {
    /* offline: volgende keer opnieuw */
  } finally {
    bezig = false
  }
}

export function stuur(event) {
  const wachtrij = lees(OUTBOX, [])
  wachtrij.push({ ...event, eventId: uid(), t: Date.now() })
  schrijf(OUTBOX, wachtrij.slice(-500))
  return leegOutbox()
}

if (typeof window !== 'undefined') {
  setInterval(leegOutbox, 5000)
  window.addEventListener('online', leegOutbox)
}

export async function haalStats(spelerId) {
  try {
    await leegOutbox()
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 3000)
    const res = await fetch(`/api/stats${spelerId ? `?speler=${encodeURIComponent(spelerId)}` : ''}`, { signal: ctrl.signal })
    clearTimeout(timer)
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

// Live statistieken voor het grote scherm. `opFeed` krijgt losse gebeurtenissen (join, stem, klaar).
export function useLiveStats(opFeed) {
  const [stats, setStats] = useState(null)
  const [verbonden, setVerbonden] = useState(false)

  useEffect(() => {
    let bron
    let herstart
    const verbind = () => {
      bron = new EventSource('/api/stream')
      bron.addEventListener('open', () => setVerbonden(true))
      bron.addEventListener('stats', (e) => setStats(JSON.parse(e.data)))
      bron.addEventListener('feed', (e) => opFeed?.(JSON.parse(e.data)))
      bron.addEventListener('error', () => {
        setVerbonden(false)
        bron.close()
        herstart = setTimeout(verbind, 3000)
      })
    }
    verbind()
    return () => {
      clearTimeout(herstart)
      bron?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { stats, verbonden }
}

// Groepspercentages voor één kaart, of null als er nog te weinig stemmen zijn.
export function groepsStem(stats, kaartId) {
  const s = stats?.kaarten?.[kaartId]
  if (!s) return null
  const totaal = s.mens + s.machine + s.samen
  if (totaal < 1) return null
  return {
    totaal,
    mens: s.mens / totaal,
    machine: s.machine / totaal,
    samen: s.samen / totaal,
    goed: s.goed / Math.max(1, s.goed + s.fout),
  }
}

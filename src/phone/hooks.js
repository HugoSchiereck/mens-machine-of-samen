import { useEffect, useRef, useState } from 'react'

// Telt soepel op naar een nieuw getal (voor scores).
export function useOptellen(doel, duur = 900) {
  const [waarde, setWaarde] = useState(doel)
  const vanaf = useRef(doel)

  useEffect(() => {
    const begin = performance.now()
    const start = vanaf.current
    let frame
    const stap = (nu) => {
      const t = Math.min(1, (nu - begin) / duur)
      const zacht = 1 - Math.pow(1 - t, 3)
      const w = Math.round(start + (doel - start) * zacht)
      setWaarde(w)
      vanaf.current = w
      if (t < 1) frame = requestAnimationFrame(stap)
    }
    frame = requestAnimationFrame(stap)
    return () => cancelAnimationFrame(frame)
  }, [doel, duur])

  return waarde
}

// Telt vanaf 0 op, één keer, bij het verschijnen.
export function useOptellenVanafNul(doel, duur = 1400, vertraging = 0) {
  const [waarde, setWaarde] = useState(0)
  useEffect(() => {
    let frame
    let begin
    const stap = (nu) => {
      begin ??= nu + vertraging
      const t = Math.max(0, Math.min(1, (nu - begin) / duur))
      setWaarde(Math.round(doel * (1 - Math.pow(1 - t, 4))))
      if (t < 1) frame = requestAnimationFrame(stap)
    }
    frame = requestAnimationFrame(stap)
    return () => cancelAnimationFrame(frame)
  }, [doel, duur, vertraging])
  return waarde
}

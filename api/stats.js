import { getStats } from '../server/vercelStore.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false })
  try {
    const stats = await getStats(req.query?.speler || new URL(req.url, 'http://localhost').searchParams.get('speler'))
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json(stats)
  } catch (error) {
    console.error(error)
    return res.status(503).json({ ok: false, error: 'Database niet beschikbaar' })
  }
}

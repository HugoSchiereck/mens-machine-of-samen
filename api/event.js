import { addEvents } from '../server/vercelStore.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
    await addEvents(Array.isArray(body) ? body : [body])
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ ok: false })
  }
}

// Illustraties bij de verhaalkaarten. In kaarten.json: media.beeld = een sleutel hieronder.
// Elk beeld vult het hele 360x480-podium; Verhaal legt onderaan het bijschrift eroverheen.
// Regels: laat zien waar het verhaal over gaat, maar verraad het antwoord niet
// (geen mensen of robots die het werk doen, geen 'AI'-labels die niet in het verhaal staan).
import { DIGITAAL } from './digitaal.jsx'
import { ONLINE } from './online.jsx'
import { BUITEN } from './buiten.jsx'
import { GESCHIEDENIS } from './geschiedenis.jsx'

export const BEELDEN = { ...DIGITAAL, ...ONLINE, ...BUITEN, ...GESCHIEDENIS }

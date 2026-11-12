// Register van alle mockups. In kaarten.json verwijs je ernaar met
// { "type": "mockup", "id": "voetbal-site", "versie": "ai" | "eind" }.
// Liever een echte screenshot? Gebruik { "type": "image", "src": "/kaarten/naam.png" }.
import { VoetbalSite, Inlogpagina } from './website.jsx'
import { SchoolfeestFlyer, Sollicitatiebrief, Herfstgedicht, AppPitch } from './creatief.jsx'
import { CijferCode } from './code.jsx'
import { KankerScan, Weer, VarCheck, Verkeerslichten, MuziekJaar, Melkrobot, Sluis, Operatierobot, GameLevel } from './wereld.jsx'
import { Verhaal } from './verhaal.jsx'
import './mockups.css'

export const MOCKUPS = {
  'voetbal-site': VoetbalSite,
  inlogpagina: Inlogpagina,
  'schoolfeest-flyer': SchoolfeestFlyer,
  sollicitatiebrief: Sollicitatiebrief,
  herfstgedicht: Herfstgedicht,
  'app-pitch': AppPitch,
  'cijfer-code': CijferCode,
  'kanker-scan': KankerScan,
  weer: Weer,
  var: VarCheck,
  verkeerslichten: Verkeerslichten,
  'muziek-jaar': MuziekJaar,
  melkrobot: Melkrobot,
  sluis: Sluis,
  operatierobot: Operatierobot,
  'game-level': GameLevel,
  verhaal: Verhaal,
}

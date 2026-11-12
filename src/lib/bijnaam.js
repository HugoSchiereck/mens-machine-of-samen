// Bijnamen: een simpel filter tegen ongepaste namen, en een generator.
// Wordt zowel in de browser als op de server gebruikt.

const VERBODEN = [
  'kut', 'lul', 'hoer', 'kanker', 'kenker', 'tering', 'tyfus', 'pleur', 'neuk', 'piemel', 'kont',
  'slet', 'flikker', 'mongool', 'mongol', 'debiel', 'neger', 'nigg', 'nazi', 'hitler', 'jood',
  'fuck', 'fck', 'shit', 'bitch', 'dick', 'cock', 'cunt', 'porn', 'porno', 'sex', 'seks', 'penis',
  'vagina', 'tiet', 'klote', 'godver', 'gvd', 'kkr', 'wtf', 'rape', 'verkracht',
]

const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', '@': 'a', $: 's', '!': 'i' }

function normaliseer(naam) {
  return naam
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[01345789@$!]/g, (c) => LEET[c])
    .replace(/[^a-z]/g, '')
    .replace(/(.)\1+/g, '$1') // "kuuut" -> "kut"
}

export function bijnaamOk(naam) {
  if (typeof naam !== 'string') return false
  const n = naam.trim()
  if (n.length < 2 || n.length > 16) return false
  if (!/^[\p{L}\p{N} ._-]+$/u.test(n)) return false
  const plat = normaliseer(n)
  return !VERBODEN.some((w) => plat.includes(normaliseer(w)))
}

const BIJVOEGLIJK = ['Snelle', 'Turbo', 'Slimme', 'Stille', 'Gouden', 'Digitale', 'Rappe', 'Wakkere', 'Dappere', 'Vrolijke', 'Kosmische', 'Neon']
const ZELFSTANDIG = ['Kip', 'Robot', 'Panda', 'Byte', 'Raket', 'Uil', 'Vos', 'Haai', 'Wolk', 'Pixel', 'Draak', 'Bever']

export function verzinBijnaam() {
  const a = BIJVOEGLIJK[Math.floor(Math.random() * BIJVOEGLIJK.length)]
  const b = ZELFSTANDIG[Math.floor(Math.random() * ZELFSTANDIG.length)]
  return `${a} ${b}`
}

// Server-kant: alles wat niet door het filter komt, wordt een verzonnen naam.
export function schoonBijnaam(naam) {
  return bijnaamOk(naam) ? naam.trim() : verzinBijnaam()
}

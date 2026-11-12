// Codekaart: een programmaatje dat je gemiddelde cijfer berekent (making-of).
import { Abs } from './website.jsx'

const MONO = "'Geist Mono Variable', ui-monospace, monospace"
const K = { kw: '#ff7ab2', fn: '#7cc4ff', str: '#ffd479', num: '#c9a7ff', com: '#6f7a8a', tx: '#e6e6ea' }

// Elke regel is een lijst van [tekst, kleur]-stukjes.
const AI_CODE = [
  [['def ', K.kw], ['gemiddelde', K.fn], ['(cijfers):', K.tx]],
  [['    totaal = ', K.tx], ['0', K.num]],
  [['    for ', K.kw], ['c ', K.tx], ['in ', K.kw], ['cijfers:', K.tx]],
  [['        totaal += c', K.tx]],
  [['    return ', K.kw], ['totaal / ', K.tx], ['len', K.fn], ['(cijfers)', K.tx]],
  [],
  [['cijfers = ', K.tx], ['input', K.fn], ['(', K.tx], ['"Cijfers: "', K.str], [').split(', K.tx], ['","', K.str], [')', K.tx]],
  [['print', K.fn], ['(', K.tx], ['"Gemiddelde:"', K.str], [', gemiddelde(cijfers))', K.tx]],
]

const EIND_CODE = [
  [['def ', K.kw], ['lees_cijfers', K.fn], ['(tekst):', K.tx]],
  [['    cijfers = []', K.tx]],
  [['    for ', K.kw], ['deel ', K.tx], ['in ', K.kw], ['tekst.split():', K.tx]],
  [['        cijfer = ', K.tx], ['float', K.fn], ['(deel.replace(', K.tx], ['","', K.str], [', ', K.tx], ['"."', K.str], ['))', K.tx]],
  [['        if ', K.kw], ['1 ', K.num], ['<= cijfer <= ', K.tx], ['10', K.num], [':', K.tx]],
  [['            cijfers.append(cijfer)', K.tx]],
  [['    return ', K.kw], ['cijfers', K.tx]],
  [],
  [['def ', K.kw], ['gemiddelde', K.fn], ['(cijfers):', K.tx]],
  [['    if not ', K.kw], ['cijfers:', K.tx]],
  [['        return ', K.kw], ['None', K.num]],
  [['    return ', K.kw], ['round', K.fn], ['(', K.tx], ['sum', K.fn], ['(cijfers) / ', K.tx], ['len', K.fn], ['(cijfers), ', K.tx], ['1', K.num], [')', K.tx]],
  [],
  [['tekst = ', K.tx], ['input', K.fn], ['(', K.tx], ['"Cijfers (bijv. 6,5 7 8): "', K.str], [')', K.tx]],
  [['print', K.fn], ['(', K.tx], ['"Gemiddelde:"', K.str], [', gemiddelde(lees_cijfers(tekst)))', K.tx]],
]

// Regel n (vanaf 1) staat op y = 40 + (n - 1) * 19.
export const CODE_REGEL_Y = (n) => 40 + (n - 1) * 19

export function CijferCode({ versie }) {
  const ai = versie === 'ai'
  const code = ai ? AI_CODE : EIND_CODE
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#1b1d23', fontFamily: MONO }}>
      <Abs x={0} y={0} w={360} h={30} s={{ background: '#141519', display: 'flex', alignItems: 'flex-end', paddingLeft: 10 }}>
        <span style={{ background: '#1b1d23', color: '#e6e6ea', fontSize: 11, padding: '6px 12px', borderRadius: '6px 6px 0 0', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: '#ffd479' }} /> gemiddelde.py
        </span>
      </Abs>
      {code.map((stukken, i) => (
        <Abs key={i} x={0} y={CODE_REGEL_Y(i + 1)} w={360} h={19} s={{ display: 'flex', alignItems: 'center', fontSize: 10.4, whiteSpace: 'pre' }}>
          <span style={{ width: 28, textAlign: 'right', color: '#4b505c', paddingRight: 10, flex: 'none' }}>{i + 1}</span>
          {stukken.map(([t, kleur], j) => (
            <span key={j} style={{ color: kleur }}>
              {t}
            </span>
          ))}
        </Abs>
      ))}
      <Abs x={0} y={350} w={360} h={130} s={{ background: '#0f1013', borderTop: '1px solid #2c2f37', padding: '8px 12px', fontSize: 10.4, lineHeight: '17px', color: '#c8ccd4' }}>
        <div style={{ color: '#6f7a8a', fontSize: 9, letterSpacing: 1.5, marginBottom: 4 }}>TERMINAL</div>
        <div>
          <span style={{ color: '#7ee2a8' }}>$</span> python gemiddelde.py
        </div>
        {ai ? (
          <>
            <div>Cijfers: 6,5, 7, 8</div>
            <div style={{ color: '#ff6b81' }}>Traceback (most recent call last):</div>
            <div style={{ color: '#ff6b81' }}>TypeError: unsupported operand</div>
            <div style={{ color: '#ff6b81' }}>type(s) for +=: 'int' and 'str'</div>
          </>
        ) : (
          <>
            <div>Cijfers (bijv. 6,5 7 8): 6,5 7 8</div>
            <div>
              Gemiddelde: <span style={{ color: '#7ee2a8' }}>7.2</span>
            </div>
          </>
        )}
      </Abs>
    </div>
  )
}

import { AiJij, BaanFeiten, BaanRij } from '../components/Onderdelen.jsx'
import { Merk } from '../components/Iconen.jsx'
import { useOptellenVanafNul } from './hooks.js'

// "It's a match": de ICT-baan die het best past bij hoe leuk je de onderwerpen vond.
export default function Match({ matches, onVerder, onToekomst }) {
  const [top, ...rest] = matches
  const pct = useOptellenVanafNul(top.pct, 1000, 150)
  const { baan, redenen } = top

  return (
    <div className="pagina">
      <div className="kopbalk">
        <Merk />
      </div>
      <div className="match-held">
        <span className="t-eyebrow">Jouw ICT-match</span>
        <div className="match-pct t-num">
          <b>{pct}%</b>
          <span>match</span>
        </div>
        <h1 className="t-h1">{baan.titel}</h1>
        <p className="t-lead">{baan.wat}</p>
      </div>

      {redenen.length > 0 && (
        <section className="sectie">
          <h3 className="t-h3">Omdat je dit leuk vond</h3>
          <div className="redenen">
            {redenen.slice(0, 3).map((r) => (
              <span key={r.onderwerp} className="tag tag-lg">
                {r.label}
                <span className="t-num" style={{ color: 'var(--text-3)' }}>
                  {Math.round(r.gem * 10) / 10}/5
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="baan-blok">
        <AiJij baan={baan} />
        <BaanFeiten baan={baan} />
      </section>

      {rest.length > 0 && (
        <section className="sectie">
          <h3 className="t-h3">Past ook bij jou</h3>
          <div className="rijen">
            {rest.slice(0, 4).map((m) => (
              <BaanRij key={m.baan.id} id={m.baan.id} />
            ))}
          </div>
        </section>
      )}

      <p className="t-small">
        Je match is gebaseerd op hoe leuk je de onderwerpen vond, niet op je score. Speel nog een ronde voor andere onderwerpen.
      </p>

      <div className="onderbalk">
        <button className="btn btn-primary btn-block" onClick={onVerder}>
          Bekijk je score
        </button>
        <button className="btn btn-ghost btn-block" onClick={onToekomst}>
          Alle banen met toekomst
        </button>
      </div>
    </div>
  )
}

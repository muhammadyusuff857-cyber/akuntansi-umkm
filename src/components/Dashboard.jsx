import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { COA, fmt, fmtShort, getLedger } from '../data/coa'

export default function Dashboard({ uid }) {
  const [jurnal, setJurnal]         = useState([])
  const [piutangUtang, setPU]       = useState([])

  useEffect(() => {
    const q1 = query(collection(db, `users/${uid}/jurnal`), orderBy('tgl', 'asc'))
    const unsub1 = onSnapshot(q1, snap => setJurnal(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    const q2 = query(collection(db, `users/${uid}/piutangUtang`), orderBy('tgl', 'desc'))
    const unsub2 = onSnapshot(q2, snap => setPU(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => { unsub1(); unsub2() }
  }, [uid])

  const ledger = getLedger(jurnal)
  const get    = kode => Math.abs(ledger[kode]?.saldo || 0)
  const kas    = get('1-100') + get('1-110')
  const totalPendapatan = COA.filter(a => a.tipe === 'pendapatan').reduce((s, a) => s + get(a.kode), 0)
  const totalBeban      = COA.filter(a => a.tipe === 'beban').reduce((s, a) => s + get(a.kode), 0)
  const laba            = totalPendapatan - totalBeban
  const piutangBeredar  = piutangUtang.filter(p => p.jenis === 'piutang' && p.status !== 'lunas').reduce((s, p) => s + p.jumlah, 0)
  const utangBeredar    = piutangUtang.filter(p => p.jenis === 'utang' && p.status !== 'lunas').reduce((s, p) => s + p.jumlah, 0)

  const recent = [...jurnal].reverse().slice(0, 5)

  return (
    <div>
      <div className="section-title">📊 Dashboard</div>

      <div className="metrics">
        {[
          { label: 'Kas & Bank',       value: fmtShort(kas),                  cls: '' },
          { label: 'Total Pendapatan', value: fmtShort(totalPendapatan),       cls: 'pos' },
          { label: 'Total Beban',      value: fmtShort(totalBeban),            cls: 'neg' },
          { label: laba >= 0 ? 'Laba Bersih' : 'Rugi Bersih',
                                        value: fmtShort(Math.abs(laba)),        cls: laba >= 0 ? 'pos' : 'neg' },
          { label: 'Piutang Beredar',  value: fmtShort(piutangBeredar),        cls: '' },
          { label: 'Utang Beredar',    value: fmtShort(utangBeredar),          cls: 'neg' },
        ].map(m => (
          <div key={m.label} className="metric">
            <div className="metric-label">{m.label}</div>
            <div className={`metric-value ${m.cls}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">5 Transaksi Terakhir</div>
        <table>
          <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Debit</th><th>Kredit</th></tr></thead>
          <tbody>
            {recent.length === 0
              ? <tr><td colSpan={4} className="empty">Belum ada transaksi</td></tr>
              : recent.map(e => {
                  const totalD = e.lines.reduce((s, l) => s + l.debit, 0)
                  const totalK = e.lines.reduce((s, l) => s + l.kredit, 0)
                  return (
                    <tr key={e.id}>
                      <td style={{ fontSize:12 }}>{e.tgl}</td>
                      <td style={{ fontSize:12 }}>{e.ket}</td>
                      <td className="debit" style={{ fontSize:12 }}>{fmt(totalD)}</td>
                      <td className="kredit" style={{ fontSize:12 }}>{fmt(totalK)}</td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

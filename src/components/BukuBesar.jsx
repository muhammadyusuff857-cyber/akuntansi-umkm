import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { COA, fmt, getLedger } from '../data/coa'

export default function BukuBesar({ uid }) {
  const [jurnal,   setJurnal]  = useState([])
  const [filter,   setFilter]  = useState('')

  useEffect(() => {
    const q = query(collection(db, `users/${uid}/jurnal`), orderBy('tgl', 'asc'))
    return onSnapshot(q, snap => setJurnal(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [uid])

  const ledger = getLedger(jurnal)
  const aktif  = filter
    ? COA.filter(a => a.kode === filter)
    : COA.filter(a => ledger[a.kode]?.entries.length > 0)

  return (
    <div>
      <div className="section-title">📚 Buku Besar</div>

      <div style={{ marginBottom:14 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth:260, fontSize:13 }}>
          <option value="">Semua akun (berisi transaksi)</option>
          {COA.map(a => <option key={a.kode} value={a.kode}>{a.kode} — {a.nama}</option>)}
        </select>
      </div>

      {aktif.length === 0
        ? <div className="empty">Belum ada transaksi</div>
        : aktif.map(akun => {
            const data = ledger[akun.kode]
            let running = 0
            const sorted = [...data.entries].sort((a, b) => a.tgl > b.tgl ? 1 : -1)
            return (
              <div key={akun.kode} style={{ marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'8px 12px', background:'#f5f5f4', borderRadius:8, marginBottom:6,
                  fontWeight:600, fontSize:13 }}>
                  <span>{akun.kode} — {akun.nama}</span>
                  <span style={{ color: data.saldo >= 0 ? '#15803d' : '#b91c1c' }}>
                    {fmt(Math.abs(data.saldo))}
                  </span>
                </div>
                <div className="card" style={{ padding:0, overflow:'hidden' }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width:90 }}>Tanggal</th>
                        <th>Keterangan</th>
                        <th style={{ width:100 }}>Debit</th>
                        <th style={{ width:100 }}>Kredit</th>
                        <th style={{ width:110 }}>Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((e, i) => {
                        if (['aset', 'beban'].includes(akun.tipe)) running += e.debit - e.kredit
                        else running += e.kredit - e.debit
                        return (
                          <tr key={i}>
                            <td style={{ fontSize:12 }}>{e.tgl}</td>
                            <td style={{ fontSize:12 }}>{e.ket}</td>
                            <td className="debit">{e.debit  > 0 ? fmt(e.debit)  : '-'}</td>
                            <td className="kredit">{e.kredit > 0 ? fmt(e.kredit) : '-'}</td>
                            <td style={{ fontSize:12, fontWeight:600, color: running >= 0 ? '#15803d' : '#b91c1c' }}>
                              {fmt(Math.abs(running))}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

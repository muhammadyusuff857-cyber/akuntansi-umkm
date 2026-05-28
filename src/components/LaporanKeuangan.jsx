import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { COA, fmt, getLedger } from '../data/coa'

export default function LaporanKeuangan({ uid }) {
  const [jurnal, setJurnal] = useState([])
  const [view,   setView]   = useState('laba-rugi')

  useEffect(() => {
    const q = query(collection(db, `users/${uid}/jurnal`), orderBy('tgl', 'asc'))
    return onSnapshot(q, snap => setJurnal(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [uid])

  const ledger = getLedger(jurnal)
  const get    = kode => Math.abs(ledger[kode]?.saldo || 0)

  const totalPendapatan = COA.filter(a => a.tipe === 'pendapatan').reduce((s, a) => s + get(a.kode), 0)
  const totalBeban      = COA.filter(a => a.tipe === 'beban').reduce((s, a) => s + get(a.kode), 0)
  const laba            = totalPendapatan - totalBeban
  const totalAset       = COA.filter(a => a.tipe === 'aset').reduce((s, a) => s + get(a.kode), 0)
                        - COA.filter(a => a.tipe === 'kontra-aset').reduce((s, a) => s + get(a.kode), 0)
  const totalLiab       = COA.filter(a => a.tipe === 'liabilitas').reduce((s, a) => s + get(a.kode), 0)
  const totalEkuitas    = get('3-100') - get('3-110') + laba

  const Row = ({ label, value, cls='', indent=false, subtotal=false, total=false }) => (
    <div className={`laporan-row${indent ? ' indent' : ''}${subtotal ? ' subtotal' : ''}${total ? ' total' : ''}`}>
      <span>{label}</span>
      <span style={{ color: cls === 'pos' ? '#15803d' : cls === 'neg' ? '#b91c1c' : undefined }}>{value}</span>
    </div>
  )

  return (
    <div>
      <div className="section-title">📈 Laporan Keuangan</div>

      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {[['laba-rugi','Laba Rugi'],['neraca','Neraca']].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)}
            style={{ padding:'7px 16px', fontWeight: view===id ? 600 : 400,
              background: view===id ? '#1c1917' : '#fff', color: view===id ? '#fff' : '#78716c',
              border:'1px solid #e7e5e4', borderRadius:8 }}>
            {label}
          </button>
        ))}
      </div>

      {view === 'laba-rugi' && (
        <div className="card">
          <div className="card-title">Laporan Laba Rugi</div>
          <div style={{ fontWeight:600, fontSize:12, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:8 }}>Pendapatan</div>
          {COA.filter(a => a.tipe === 'pendapatan').map(a => <Row key={a.kode} label={a.nama} value={fmt(get(a.kode))} indent />)}
          <Row label="Total Pendapatan" value={fmt(totalPendapatan)} subtotal cls="pos" />
          <hr className="divider" />
          <div style={{ fontWeight:600, fontSize:12, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:8 }}>Beban</div>
          {COA.filter(a => a.tipe === 'beban').map(a => <Row key={a.kode} label={a.nama} value={fmt(get(a.kode))} indent />)}
          <Row label="Total Beban" value={fmt(totalBeban)} subtotal cls="neg" />
          <hr className="divider" />
          <Row label={laba >= 0 ? 'Laba Bersih' : 'Rugi Bersih'} value={fmt(Math.abs(laba))} total cls={laba >= 0 ? 'pos' : 'neg'} />
        </div>
      )}

      {view === 'neraca' && (
        <div className="card">
          <div className="card-title">Neraca</div>
          <div style={{ fontWeight:600, fontSize:12, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:8 }}>Aset</div>
          {COA.filter(a => a.tipe === 'aset').map(a => <Row key={a.kode} label={a.nama} value={fmt(get(a.kode))} indent />)}
          {COA.filter(a => a.tipe === 'kontra-aset').map(a => (
            <div key={a.kode} className="laporan-row indent">
              <span>{a.nama}</span>
              <span style={{ color:'#b91c1c' }}>({fmt(get(a.kode))})</span>
            </div>
          ))}
          <Row label="Total Aset" value={fmt(totalAset)} subtotal />
          <hr className="divider" />
          <div style={{ fontWeight:600, fontSize:12, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:8 }}>Liabilitas</div>
          {COA.filter(a => a.tipe === 'liabilitas').map(a => <Row key={a.kode} label={a.nama} value={fmt(get(a.kode))} indent />)}
          <Row label="Total Liabilitas" value={fmt(totalLiab)} subtotal />
          <hr className="divider" />
          <div style={{ fontWeight:600, fontSize:12, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:8 }}>Ekuitas</div>
          <Row label="Modal Pemilik" value={fmt(get('3-100'))} indent />
          <div className="laporan-row indent"><span>Prive</span><span style={{ color:'#b91c1c' }}>({fmt(get('3-110'))})</span></div>
          <Row label={laba >= 0 ? 'Laba Periode Berjalan' : 'Rugi Periode Berjalan'} value={fmt(Math.abs(laba))} indent cls={laba >= 0 ? 'pos' : 'neg'} />
          <Row label="Total Ekuitas" value={fmt(totalEkuitas)} subtotal />
          <hr className="divider" />
          <Row label="Total Liabilitas + Ekuitas" value={fmt(totalLiab + totalEkuitas)} total />
          {Math.abs(totalAset - totalLiab - totalEkuitas) > 0.01 && (
            <div style={{ fontSize:12, color:'#b91c1c', marginTop:8 }}>
              ⚠ Neraca tidak seimbang (selisih {fmt(Math.abs(totalAset - totalLiab - totalEkuitas))})
            </div>
          )}
        </div>
      )}
    </div>
  )
}

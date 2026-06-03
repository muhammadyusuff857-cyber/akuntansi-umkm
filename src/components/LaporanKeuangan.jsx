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

  // Laba Rugi — struktur perusahaan dagang
  const penjualan         = get('4-100')
  const returPenjualan    = get('4-110')
  const potonganPenjualan = get('4-120')
  const penjualanBersih   = penjualan - returPenjualan - potonganPenjualan

  const pembelian         = get('5-100')
  const bebanAngkut       = get('5-110')
  const returPembelian    = get('5-120')
  const potonganPembelian = get('5-130')
  const hargaPokokPenjualan = get('5-140')
  const pembelianBersih   = pembelian + bebanAngkut - returPembelian - potonganPembelian - hargaPokokPenjualan
  const hpp               = pembelianBersih // simplified: tanpa persediaan awal/akhir
  const labaKotor         = penjualanBersih - hpp

  const bebanPenjualan    = ['6-100','6-110','6-120','6-130','6-140'].reduce((s,k) => s + get(k), 0)
  const bebanUmum         = ['7-100','7-110','7-120','7-130','7-140','7-150','7-160','7-170','7-180','7-190','7-200','7-210'].reduce((s,k) => s + get(k), 0)
  const totalBebanOp      = bebanPenjualan + bebanUmum
  const labaOperasi       = labaKotor - totalBebanOp

  const pendLain          = get('8-200') + get('8-210') + get('4-130')
  const bebanLain         = get('8-100') + get('8-110')
  const labaBersih        = labaOperasi + pendLain - bebanLain

  // Neraca
  const totalAset         = COA.filter(a => a.tipe === 'aset').reduce((s,a) => s + get(a.kode), 0)
                          - COA.filter(a => a.tipe === 'kontra-aset').reduce((s,a) => s + get(a.kode), 0)
  const totalLiab         = COA.filter(a => a.tipe === 'liabilitas').reduce((s,a) => s + get(a.kode), 0)
  const totalEkuitas      = get('3-100') - get('3-110') + get('3-120') + labaBersih

  const Row = ({ label, value, cls='', indent=false, subtotal=false, total=false, neg=false }) => (
    <div className={`laporan-row${indent?' indent':''}${subtotal?' subtotal':''}${total?' total':''}`}>
      <span>{label}</span>
      <span style={{ color: cls==='pos'?'#15803d': cls==='neg'||neg?'#b91c1c': undefined }}>
        {neg ? `(${value})` : value}
      </span>
    </div>
  )

  const SectionTitle = ({ label }) => (
    <div style={{ fontWeight:600, fontSize:11, color:'#78716c', textTransform:'uppercase',
      letterSpacing:'0.05em', marginBottom:6, marginTop:4 }}>{label}</div>
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

          <SectionTitle label="Pendapatan" />
          <Row label="Penjualan"                  value={fmt(penjualan)} indent />
          <Row label="Retur Penjualan"             value={fmt(returPenjualan)}    indent neg />
          <Row label="Potongan Penjualan"          value={fmt(potonganPenjualan)} indent neg />
          <Row label="Penjualan Bersih"            value={fmt(penjualanBersih)}   subtotal cls="pos" />

          <hr className="divider" />
          <SectionTitle label="Harga Pokok Penjualan" />
          <Row label="Pembelian"                  value={fmt(pembelian)}          indent />
          <Row label="Beban Angkut Pembelian"     value={fmt(bebanAngkut)}        indent />
          <Row label="Retur Pembelian"            value={fmt(returPembelian)}     indent neg />
          <Row label="Potongan Pembelian"         value={fmt(potonganPembelian)}  indent neg />
          <Row label="Pembelian Bersih / HPP"     value={fmt(hpp)}               subtotal cls="neg" />
          <Row label="Laba Kotor"                 value={fmt(labaKotor)}         total cls={labaKotor>=0?'pos':'neg'} />

          <hr className="divider" />
          <SectionTitle label="Beban Operasional — Penjualan" />
          {[
            ['6-100','Beban Gaji Bag. Penjualan'],
            ['6-110','Beban Iklan & Promosi'],
            ['6-120','Beban Angkut Penjualan'],
            ['6-130','Beban Perlengkapan Toko'],
            ['6-140','Beban Penyusutan Peralatan Toko'],
          ].map(([k,n]) => <Row key={k} label={n} value={fmt(get(k))} indent />)}
          <Row label="Total Beban Penjualan" value={fmt(bebanPenjualan)} subtotal />

          <hr className="divider" />
          <SectionTitle label="Beban Operasional — Umum & Administrasi" />
          {[
            ['7-100','Beban Gaji Bag. Kantor'],
            ['7-110','Beban Sewa'],
            ['7-120','Beban Listrik & Air'],
            ['7-130','Beban Telepon & Internet'],
            ['7-140','Beban Perlengkapan Kantor'],
            ['7-150','Beban Penyusutan Gedung'],
            ['7-160','Beban Penyusutan Peralatan Kantor'],
            ['7-170','Beban Penyusutan Kendaraan'],
            ['7-180','Beban Asuransi'],
            ['7-190','Beban Kerugian Piutang'],
            ['7-200','Beban Pajak'],
            ['7-210','Beban Lain-lain'],
          ].map(([k,n]) => <Row key={k} label={n} value={fmt(get(k))} indent />)}
          <Row label="Total Beban Umum & Adm." value={fmt(bebanUmum)} subtotal />

          <Row label="Laba Operasi" value={fmt(labaOperasi)} total cls={labaOperasi>=0?'pos':'neg'} />

          <hr className="divider" />
          <SectionTitle label="Pendapatan & Beban Lain-lain" />
          <Row label="Pendapatan Bunga"        value={fmt(get('8-200'))} indent />
          <Row label="Laba Penjualan Aset"     value={fmt(get('8-210'))} indent />
          <Row label="Pendapatan Lain-lain"    value={fmt(get('4-130'))} indent />
          <Row label="Beban Bunga"             value={fmt(get('8-100'))} indent neg />
          <Row label="Beban Administrasi Bank" value={fmt(get('8-110'))} indent neg />

          <hr className="divider" />
          <Row label={labaBersih>=0?'Laba Bersih':'Rugi Bersih'}
               value={fmt(Math.abs(labaBersih))} total cls={labaBersih>=0?'pos':'neg'} />
        </div>
      )}

      {view === 'neraca' && (
        <div className="card">
          <div className="card-title">Neraca</div>

          <SectionTitle label="Aset Lancar" />
          {['1-100','1-110','1-120','1-140','1-150','1-160','1-170','1-180','1-190','1-195'].map(k => {
            const a = COA.find(x => x.kode === k); return a ? <Row key={k} label={a.nama} value={fmt(get(k))} indent /> : null
          })}
          <div className="laporan-row indent"><span>Cadangan Kerugian Piutang</span><span style={{color:'#b91c1c'}}>({fmt(get('1-130'))})</span></div>

          <SectionTitle label="Aset Tetap" />
          {[
            ['1-200','Tanah'],
            ['1-210','Gedung / Bangunan'],['1-215','Akum. Penyusutan Gedung'],
            ['1-220','Peralatan Toko'],['1-225','Akum. Penyusutan Peralatan Toko'],
            ['1-230','Peralatan Kantor'],['1-235','Akum. Penyusutan Peralatan Kantor'],
            ['1-240','Kendaraan'],['1-245','Akum. Penyusutan Kendaraan'],
          ].map(([k,n]) => {
            const isKontra = k.endsWith('5')
            return <div key={k} className="laporan-row indent">
              <span>{n}</span>
              <span style={isKontra?{color:'#b91c1c'}:undefined}>{isKontra?`(${fmt(get(k))})`:fmt(get(k))}</span>
            </div>
          })}
          <Row label="Total Aset" value={fmt(totalAset)} subtotal />

          <hr className="divider" />
          <SectionTitle label="Liabilitas Jangka Pendek" />
          {['2-100','2-110','2-120','2-130','2-140','2-150'].map(k => {
            const a = COA.find(x => x.kode === k); return a ? <Row key={k} label={a.nama} value={fmt(get(k))} indent /> : null
          })}
          <SectionTitle label="Liabilitas Jangka Panjang" />
          {['2-200','2-210'].map(k => {
            const a = COA.find(x => x.kode === k); return a ? <Row key={k} label={a.nama} value={fmt(get(k))} indent /> : null
          })}
          <Row label="Total Liabilitas" value={fmt(totalLiab)} subtotal />

          <hr className="divider" />
          <SectionTitle label="Ekuitas" />
          <Row label="Modal Pemilik"   value={fmt(get('3-100'))} indent />
          <Row label="Laba Ditahan"    value={fmt(get('3-120'))} indent />
          <div className="laporan-row indent"><span>Prive</span><span style={{color:'#b91c1c'}}>({fmt(get('3-110'))})</span></div>
          <Row label={labaBersih>=0?'Laba Periode Berjalan':'Rugi Periode Berjalan'}
               value={fmt(Math.abs(labaBersih))} indent cls={labaBersih>=0?'pos':'neg'} />
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

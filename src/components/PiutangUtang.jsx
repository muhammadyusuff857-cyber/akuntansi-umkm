import { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { fmt, fmtShort } from '../data/coa'

const today = () => new Date().toISOString().split('T')[0]

export default function PiutangUtang({ uid }) {
  const [items,   setItems]   = useState([])
  const [jenis,   setJenis]   = useState('piutang')
  const [tgl,     setTgl]     = useState(today())
  const [nama,    setNama]    = useState('')
  const [jumlah,  setJumlah]  = useState('')
  const [jatuh,   setJatuh]   = useState('')
  const [ket,     setKet]     = useState('')
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    const q = query(collection(db, `users/${uid}/piutangUtang`), orderBy('tgl', 'desc'))
    return onSnapshot(q, snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [uid])

  const simpan = async () => {
    if (!tgl || !nama.trim() || !parseFloat(jumlah)) return alert('Tanggal, nama, dan jumlah wajib diisi.')
    setSaving(true)
    try {
      await addDoc(collection(db, `users/${uid}/piutangUtang`), {
        jenis, tgl, nama: nama.trim(),
        jumlah: parseFloat(jumlah), jatuh, ket: ket.trim(),
        status: 'belum-lunas', createdAt: serverTimestamp()
      })
      setNama(''); setJumlah(''); setJatuh(''); setKet(''); setTgl(today())
    } catch (err) { alert('Gagal menyimpan: ' + err.message) }
    setSaving(false)
  }

  const lunas = async (id) => {
    await updateDoc(doc(db, `users/${uid}/piutangUtang`, id), { status: 'lunas' })
  }

  const hapus = async (id) => {
    if (!confirm('Hapus entri ini?')) return
    await deleteDoc(doc(db, `users/${uid}/piutangUtang`, id))
  }

  const todayStr         = today()
  const totalPiutang     = items.filter(p => p.jenis === 'piutang' && p.status !== 'lunas').reduce((s, p) => s + p.jumlah, 0)
  const totalUtang       = items.filter(p => p.jenis === 'utang'   && p.status !== 'lunas').reduce((s, p) => s + p.jumlah, 0)
  const jatuhTempoBesok  = items.filter(p => p.status !== 'lunas' && p.jatuh && p.jatuh < todayStr).length

  return (
    <div>
      <div className="section-title">🧾 Piutang & Utang</div>

      {/* Form */}
      <div className="card">
        <div className="card-title">Tambah Piutang / Utang</div>
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label">Jenis</label>
            <select value={jenis} onChange={e => setJenis(e.target.value)}>
              <option value="piutang">Piutang (A/R)</option>
              <option value="utang">Utang (A/P)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tanggal</label>
            <input type="date" value={tgl} onChange={e => setTgl(e.target.value)} />
          </div>
        </div>
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label">Nama Pihak</label>
            <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Pelanggan / Pemasok" />
          </div>
          <div className="form-group">
            <label className="form-label">Jatuh Tempo</label>
            <input type="date" value={jatuh} onChange={e => setJatuh(e.target.value)} />
          </div>
        </div>
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label">Jumlah (Rp)</label>
            <input type="number" value={jumlah} onChange={e => setJumlah(e.target.value)} placeholder="0" min="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Keterangan (opsional)</label>
            <input type="text" value={ket} onChange={e => setKet(e.target.value)} placeholder="cth: Invoice #001" />
          </div>
        </div>
        <div style={{ textAlign:'right', marginTop:4 }}>
          <button className="primary" onClick={simpan} disabled={saving}>
            {saving ? 'Menyimpan...' : '+ Tambah'}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Piutang Beredar</div>
          <div className="metric-value">{fmtShort(totalPiutang)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Utang Beredar</div>
          <div className="metric-value neg">{fmtShort(totalUtang)}</div>
        </div>
        {jatuhTempoBesok > 0 && (
          <div className="metric" style={{ background:'#fef2f2', border:'1px solid #fca5a5' }}>
            <div className="metric-label" style={{ color:'#b91c1c' }}>Jatuh Tempo Terlewat</div>
            <div className="metric-value neg">{jatuhTempoBesok} item</div>
          </div>
        )}
      </div>

      {/* Tabel */}
      <div className="card">
        <div className="card-title">Daftar Piutang & Utang</div>
        <table>
          <thead>
            <tr>
              <th style={{ width:75 }}>Tgl</th>
              <th style={{ width:65 }}>Jenis</th>
              <th>Nama</th>
              <th style={{ width:100 }}>Jumlah</th>
              <th style={{ width:85 }}>Jatuh Tempo</th>
              <th style={{ width:65 }}>Status</th>
              <th style={{ width:80 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0
              ? <tr><td colSpan={7} className="empty">Belum ada data</td></tr>
              : items.map(p => {
                  const lewat = p.jatuh && p.jatuh < todayStr && p.status !== 'lunas'
                  return (
                    <tr key={p.id} style={{ background: lewat ? '#fef2f2' : undefined }}>
                      <td style={{ fontSize:12 }}>{p.tgl}</td>
                      <td>
                        <span className="tag" style={{
                          background: p.jenis === 'piutang' ? '#eff6ff' : '#fffbeb',
                          color:      p.jenis === 'piutang' ? '#1d4ed8' : '#b45309'
                        }}>
                          {p.jenis === 'piutang' ? 'A/R' : 'A/P'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize:13 }}>{p.nama}</div>
                        {p.ket && <div style={{ fontSize:11, color:'#a8a29e' }}>{p.ket}</div>}
                      </td>
                      <td style={{ fontWeight:600 }}>{fmt(p.jumlah)}</td>
                      <td style={{ fontSize:12, color: lewat ? '#b91c1c' : undefined, fontWeight: lewat ? 600 : 400 }}>
                        {p.jatuh || '-'}{lewat ? ' ⚠' : ''}
                      </td>
                      <td><span className={`tag ${p.status === 'lunas' ? 'tag-lunas' : lewat ? 'tag-jatuh' : 'tag-belum'}`}>{p.status === 'lunas' ? 'Lunas' : 'Belum'}</span></td>
                      <td>
                        <div style={{ display:'flex', gap:4 }}>
                          {p.status !== 'lunas' && <button className="success" onClick={() => lunas(p.id)}>✓</button>}
                          <button className="danger" onClick={() => hapus(p.id)}>🗑</button>
                        </div>
                      </td>
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

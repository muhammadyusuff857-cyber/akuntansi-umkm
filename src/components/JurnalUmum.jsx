import { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { COA, fmt, getAkun } from '../data/coa'

const emptyLine = () => ({ akun: COA[0].kode, debit: '', kredit: '' })
const today = () => new Date().toISOString().split('T')[0]

export default function JurnalUmum({ uid }) {
  const [jurnal, setJurnal] = useState([])
  const [tgl, setTgl]       = useState(today())
  const [bukti, setBukti]   = useState('')
  const [ket, setKet]       = useState('')
  const [lines, setLines]   = useState([emptyLine(), emptyLine()])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const q = query(collection(db, `users/${uid}/jurnal`), orderBy('tgl', 'desc'))
    return onSnapshot(q, snap => setJurnal(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [uid])

  const updateLine = (i, field, val) => {
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l))
  }

  const addLine = () => setLines(prev => [...prev, emptyLine()])

  const removeLine = (i) => {
    if (lines.length <= 2) return
    setLines(prev => prev.filter((_, idx) => idx !== i))
  }

  const totalDebit  = lines.reduce((s, l) => s + (parseFloat(l.debit)  || 0), 0)
  const totalKredit = lines.reduce((s, l) => s + (parseFloat(l.kredit) || 0), 0)
  const selisih     = Math.abs(totalDebit - totalKredit)
  const seimbang    = selisih < 0.01

  const simpan = async () => {
    if (!tgl || !ket.trim()) return alert('Tanggal dan keterangan wajib diisi.')
    const validLines = lines.filter(l => (parseFloat(l.debit) || 0) > 0 || (parseFloat(l.kredit) || 0) > 0)
    if (validLines.length < 2) return alert('Minimal 2 baris akun.')
    if (!seimbang) return alert('Jurnal tidak seimbang. Debit harus sama dengan Kredit.')
    setSaving(true)
    try {
      await addDoc(collection(db, `users/${uid}/jurnal`), {
        tgl, bukti: bukti.trim(), ket: ket.trim(),
        lines: validLines.map(l => ({ akun: l.akun, debit: parseFloat(l.debit) || 0, kredit: parseFloat(l.kredit) || 0 })),
        createdAt: serverTimestamp()
      })
      setTgl(today()); setBukti(''); setKet('')
      setLines([emptyLine(), emptyLine()])
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message)
    }
    setSaving(false)
  }

  const hapus = async (id) => {
    if (!confirm('Hapus entri ini?')) return
    await deleteDoc(doc(db, `users/${uid}/jurnal`, id))
  }

  return (
    <div>
      <div className="section-title">📒 Jurnal Umum</div>

      {/* Form input */}
      <div className="card">
        <div className="card-title">Input Transaksi Baru</div>
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label">Tanggal</label>
            <input type="date" value={tgl} onChange={e => setTgl(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">No. Bukti</label>
            <input type="text" value={bukti} onChange={e => setBukti(e.target.value)} placeholder="cth: BKM-001" />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom:12 }}>
          <label className="form-label">Keterangan</label>
          <input type="text" value={ket} onChange={e => setKet(e.target.value)} placeholder="cth: Penjualan tunai ke pelanggan" />
        </div>

        {/* Line headers */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 28px', gap:8, marginBottom:4 }}>
          {['Akun', 'Debit (Rp)', 'Kredit (Rp)', ''].map(h => (
            <div key={h} style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</div>
          ))}
        </div>

        {lines.map((line, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 28px', gap:8, marginBottom:6 }}>
            <select value={line.akun} onChange={e => updateLine(i, 'akun', e.target.value)}>
              {COA.map(a => <option key={a.kode} value={a.kode}>{a.kode} — {a.nama}</option>)}
            </select>
            <input type="number" value={line.debit}  onChange={e => updateLine(i, 'debit',  e.target.value)} placeholder="0" min="0" />
            <input type="number" value={line.kredit} onChange={e => updateLine(i, 'kredit', e.target.value)} placeholder="0" min="0" />
            <button onClick={() => removeLine(i)} style={{ padding:'4px 6px', fontSize:12, color:'#b91c1c', border:'1px solid #fca5a5', background:'#fef2f2' }}
              disabled={lines.length <= 2}>✕</button>
          </div>
        ))}

        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10, flexWrap:'wrap' }}>
          <button onClick={addLine} style={{ fontSize:12 }}>+ Tambah baris</button>
          <div style={{ flex:1, fontSize:12, color: seimbang && totalDebit > 0 ? '#15803d' : '#b91c1c' }}>
            {totalDebit > 0 || totalKredit > 0
              ? seimbang ? `✓ Seimbang: ${fmt(totalDebit)}` : `⚠ Selisih: ${fmt(selisih)}`
              : ''}
          </div>
          <button className="primary" onClick={simpan} disabled={saving}>
            {saving ? 'Menyimpan...' : '✓ Simpan Jurnal'}
          </button>
        </div>
      </div>

      {/* Daftar jurnal */}
      <div className="card">
        <div className="card-title">Daftar Jurnal</div>
        <table>
          <thead>
            <tr>
              <th style={{ width:85 }}>Tanggal</th>
              <th style={{ width:80 }}>No. Bukti</th>
              <th>Keterangan / Akun</th>
              <th style={{ width:100 }}>Debit</th>
              <th style={{ width:100 }}>Kredit</th>
              <th style={{ width:40 }}></th>
            </tr>
          </thead>
          <tbody>
            {jurnal.length === 0
              ? <tr><td colSpan={6} className="empty">Belum ada jurnal</td></tr>
              : jurnal.map(entry => entry.lines.map((line, i) => {
                  const akun = getAkun(line.akun)
                  return (
                    <tr key={`${entry.id}-${i}`}>
                      <td style={{ fontSize:12 }}>{i === 0 ? entry.tgl : ''}</td>
                      <td style={{ fontSize:12, color:'#78716c' }}>{i === 0 ? (entry.bukti || '-') : ''}</td>
                      <td>
                        {i === 0 && <div style={{ fontSize:12, fontWeight:600 }}>{entry.ket}</div>}
                        <div style={{ fontSize:11, color:'#78716c', paddingLeft: i > 0 ? 14 : 0 }}>{akun?.nama || line.akun}</div>
                      </td>
                      <td className="debit">{line.debit  > 0 ? fmt(line.debit)  : ''}</td>
                      <td className="kredit">{line.kredit > 0 ? fmt(line.kredit) : ''}</td>
                      <td>{i === 0 && <button className="danger" onClick={() => hapus(entry.id)}>🗑</button>}</td>
                    </tr>
                  )
                }))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

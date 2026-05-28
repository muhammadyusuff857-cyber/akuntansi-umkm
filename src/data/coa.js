export const COA = [
  { kode: '1-100', nama: 'Kas',                          tipe: 'aset' },
  { kode: '1-110', nama: 'Bank',                         tipe: 'aset' },
  { kode: '1-120', nama: 'Piutang Usaha',                tipe: 'aset' },
  { kode: '1-130', nama: 'Persediaan Barang',            tipe: 'aset' },
  { kode: '1-140', nama: 'Perlengkapan',                 tipe: 'aset' },
  { kode: '1-200', nama: 'Peralatan',                    tipe: 'aset' },
  { kode: '1-210', nama: 'Akum. Penyusutan Peralatan',   tipe: 'kontra-aset' },
  { kode: '2-100', nama: 'Utang Usaha',                  tipe: 'liabilitas' },
  { kode: '2-110', nama: 'Utang Bank',                   tipe: 'liabilitas' },
  { kode: '2-120', nama: 'Pendapatan Diterima Dimuka',   tipe: 'liabilitas' },
  { kode: '3-100', nama: 'Modal Pemilik',                tipe: 'ekuitas' },
  { kode: '3-110', nama: 'Prive',                        tipe: 'ekuitas' },
  { kode: '4-100', nama: 'Pendapatan Penjualan',         tipe: 'pendapatan' },
  { kode: '4-110', nama: 'Pendapatan Jasa',              tipe: 'pendapatan' },
  { kode: '5-100', nama: 'HPP',                          tipe: 'beban' },
  { kode: '5-110', nama: 'Beban Gaji',                   tipe: 'beban' },
  { kode: '5-120', nama: 'Beban Sewa',                   tipe: 'beban' },
  { kode: '5-130', nama: 'Beban Listrik & Air',          tipe: 'beban' },
  { kode: '5-140', nama: 'Beban Perlengkapan',           tipe: 'beban' },
  { kode: '5-150', nama: 'Beban Penyusutan',             tipe: 'beban' },
  { kode: '5-160', nama: 'Beban Lain-lain',              tipe: 'beban' },
]

export const getAkun = (kode) => COA.find(a => a.kode === kode)

export const fmt = (n) => {
  if (!n && n !== 0) return '-'
  return 'Rp ' + Math.round(n).toLocaleString('id-ID')
}

export const fmtShort = (n) => {
  n = Math.round(n)
  if (n >= 1_000_000_000) return 'Rp ' + (n / 1_000_000_000).toFixed(1) + 'M'
  if (n >= 1_000_000)     return 'Rp ' + (n / 1_000_000).toFixed(1) + 'jt'
  if (n >= 1_000)         return 'Rp ' + (n / 1_000).toFixed(0) + 'rb'
  return 'Rp ' + n.toLocaleString('id-ID')
}

export const getLedger = (jurnal) => {
  const ledger = {}
  COA.forEach(a => {
    ledger[a.kode] = { nama: a.nama, tipe: a.tipe, entries: [], saldo: 0 }
  })
  jurnal.forEach(entry => {
    entry.lines.forEach(line => {
      if (!ledger[line.akun]) return
      const akun = getAkun(line.akun)
      const tipe = akun?.tipe || ''
      ledger[line.akun].entries.push({
        tgl: entry.tgl, ket: entry.ket,
        debit: line.debit, kredit: line.kredit
      })
      if (['aset', 'beban'].includes(tipe)) {
        ledger[line.akun].saldo += line.debit - line.kredit
      } else {
        ledger[line.akun].saldo += line.kredit - line.debit
      }
    })
  })
  return ledger
}

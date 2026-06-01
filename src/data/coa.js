export const COA = [
  // ASET LANCAR
  { kode: '1-100', nama: 'Kas',                              tipe: 'aset' },
  { kode: '1-110', nama: 'Bank',                             tipe: 'aset' },
  { kode: '1-120', nama: 'Piutang Usaha',                    tipe: 'aset' },
  { kode: '1-130', nama: 'Cadangan Kerugian Piutang',        tipe: 'kontra-aset' },
  { kode: '1-140', nama: 'Piutang Lain-lain',                tipe: 'aset' },
  { kode: '1-150', nama: 'Persediaan Barang Dagang',         tipe: 'aset' },
  { kode: '1-160', nama: 'Perlengkapan Toko',                tipe: 'aset' },
  { kode: '1-170', nama: 'Perlengkapan Kantor',              tipe: 'aset' },
  { kode: '1-180', nama: 'Asuransi Dibayar Dimuka',          tipe: 'aset' },
  { kode: '1-190', nama: 'Sewa Dibayar Dimuka',              tipe: 'aset' },
  { kode: '1-195', nama: 'PPN Masukan',                      tipe: 'aset' },

  // ASET TETAP
  { kode: '1-200', nama: 'Tanah',                            tipe: 'aset' },
  { kode: '1-210', nama: 'Gedung / Bangunan',                tipe: 'aset' },
  { kode: '1-215', nama: 'Akum. Penyusutan Gedung',          tipe: 'kontra-aset' },
  { kode: '1-220', nama: 'Peralatan Toko',                   tipe: 'aset' },
  { kode: '1-225', nama: 'Akum. Penyusutan Peralatan Toko',  tipe: 'kontra-aset' },
  { kode: '1-230', nama: 'Peralatan Kantor',                 tipe: 'aset' },
  { kode: '1-235', nama: 'Akum. Penyusutan Peralatan Kantor',tipe: 'kontra-aset' },
  { kode: '1-240', nama: 'Kendaraan',                        tipe: 'aset' },
  { kode: '1-245', nama: 'Akum. Penyusutan Kendaraan',       tipe: 'kontra-aset' },

  // LIABILITAS JANGKA PENDEK
  { kode: '2-100', nama: 'Utang Usaha',                      tipe: 'liabilitas' },
  { kode: '2-110', nama: 'Utang Gaji',                       tipe: 'liabilitas' },
  { kode: '2-120', nama: 'Utang Pajak',                      tipe: 'liabilitas' },
  { kode: '2-130', nama: 'PPN Keluaran',                     tipe: 'liabilitas' },
  { kode: '2-140', nama: 'Pendapatan Diterima Dimuka',        tipe: 'liabilitas' },
  { kode: '2-150', nama: 'Beban Akrual',                     tipe: 'liabilitas' },

  // LIABILITAS JANGKA PANJANG
  { kode: '2-200', nama: 'Utang Bank',                       tipe: 'liabilitas' },
  { kode: '2-210', nama: 'Utang Hipotek',                    tipe: 'liabilitas' },

  // EKUITAS
  { kode: '3-100', nama: 'Modal Pemilik',                    tipe: 'ekuitas' },
  { kode: '3-110', nama: 'Prive',                            tipe: 'ekuitas' },
  { kode: '3-120', nama: 'Laba Ditahan',                     tipe: 'ekuitas' },

  // PENDAPATAN
  { kode: '4-100', nama: 'Penjualan',                        tipe: 'pendapatan' },
  { kode: '4-110', nama: 'Retur Penjualan',                  tipe: 'pendapatan' },
  { kode: '4-120', nama: 'Potongan Penjualan',               tipe: 'pendapatan' },
  { kode: '4-130', nama: 'Pendapatan Lain-lain',             tipe: 'pendapatan' },

  // HPP
  { kode: '5-100', nama: 'Pembelian',                        tipe: 'beban' },
  { kode: '5-110', nama: 'Beban Angkut Pembelian',           tipe: 'beban' },
  { kode: '5-120', nama: 'Retur Pembelian',                  tipe: 'beban' },
  { kode: '5-130', nama: 'Potongan Pembelian',               tipe: 'beban' },

  // BEBAN OPERASIONAL — PENJUALAN
  { kode: '6-100', nama: 'Beban Gaji Bagian Penjualan',      tipe: 'beban' },
  { kode: '6-110', nama: 'Beban Iklan & Promosi',            tipe: 'beban' },
  { kode: '6-120', nama: 'Beban Angkut Penjualan',           tipe: 'beban' },
  { kode: '6-130', nama: 'Beban Perlengkapan Toko',          tipe: 'beban' },
  { kode: '6-140', nama: 'Beban Penyusutan Peralatan Toko',  tipe: 'beban' },

  // BEBAN OPERASIONAL — UMUM & ADMINISTRASI
  { kode: '7-100', nama: 'Beban Gaji Bagian Kantor',         tipe: 'beban' },
  { kode: '7-110', nama: 'Beban Sewa',                       tipe: 'beban' },
  { kode: '7-120', nama: 'Beban Listrik & Air',              tipe: 'beban' },
  { kode: '7-130', nama: 'Beban Telepon & Internet',         tipe: 'beban' },
  { kode: '7-140', nama: 'Beban Perlengkapan Kantor',        tipe: 'beban' },
  { kode: '7-150', nama: 'Beban Penyusutan Gedung',          tipe: 'beban' },
  { kode: '7-160', nama: 'Beban Penyusutan Peralatan Kantor',tipe: 'beban' },
  { kode: '7-170', nama: 'Beban Penyusutan Kendaraan',       tipe: 'beban' },
  { kode: '7-180', nama: 'Beban Asuransi',                   tipe: 'beban' },
  { kode: '7-190', nama: 'Beban Kerugian Piutang',           tipe: 'beban' },
  { kode: '7-200', nama: 'Beban Pajak',                      tipe: 'beban' },
  { kode: '7-210', nama: 'Beban Lain-lain',                  tipe: 'beban' },

  // BEBAN & PENDAPATAN DI LUAR USAHA
  { kode: '8-100', nama: 'Beban Bunga',                      tipe: 'beban' },
  { kode: '8-110', nama: 'Beban Administrasi Bank',          tipe: 'beban' },
  { kode: '8-200', nama: 'Pendapatan Bunga',                 tipe: 'pendapatan' },
  { kode: '8-210', nama: 'Laba Penjualan Aset',              tipe: 'pendapatan' },
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

// Akun kontra-pendapatan (mengurangi pendapatan)
const KONTRA_PENDAPATAN = ['4-110', '4-120']
// Akun kontra-beban (mengurangi beban/pembelian)
const KONTRA_BEBAN = ['5-120', '5-130']

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
      const isKontraPendapatan = KONTRA_PENDAPATAN.includes(line.akun)
      const isKontraBeban      = KONTRA_BEBAN.includes(line.akun)

      if (isKontraPendapatan) {
        // Retur & potongan penjualan: saldo normal debit (mengurangi pendapatan)
        ledger[line.akun].saldo += line.debit - line.kredit
      } else if (isKontraBeban) {
        // Retur & potongan pembelian: saldo normal kredit (mengurangi beban)
        ledger[line.akun].saldo += line.kredit - line.debit
      } else if (['aset', 'beban'].includes(tipe)) {
        ledger[line.akun].saldo += line.debit - line.kredit
      } else {
        ledger[line.akun].saldo += line.kredit - line.debit
      }
    })
  })
  return ledger
}

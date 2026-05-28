# 🧾 AkunUMKM

Aplikasi akuntansi berbasis web untuk usaha kecil dan menengah. Dibangun dengan React + Firebase.

## Fitur

- **Jurnal Umum** — Input transaksi double-entry dengan validasi otomatis
- **Buku Besar** — Ledger per akun dengan running balance
- **Laporan Keuangan** — Laba Rugi dan Neraca real-time
- **Piutang & Utang** — Manajemen A/R dan A/P dengan tracking jatuh tempo
- **Multi-user** — Setiap akun punya data terpisah via Firebase Auth

## Tech Stack

- React 18 + Vite
- Firebase Authentication + Firestore
- Deploy ke GitHub Pages

---

## Setup & Instalasi

### 1. Clone repo

```bash
git clone https://github.com/USERNAME/akuntansi-umkm.git
cd akuntansi-umkm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru
3. Aktifkan **Authentication** → Sign-in method → Email/Password
4. Aktifkan **Firestore Database** → Start in production mode
5. Masuk ke Project Settings → General → Your apps → Add app (Web)
6. Copy config, lalu edit file `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

### 4. Firestore Security Rules

Di Firebase Console → Firestore → Rules, paste rules berikut:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Rules ini memastikan setiap user hanya bisa akses data miliknya sendiri.

### 5. Jalankan lokal

```bash
npm run dev
```

---

## Deploy ke GitHub Pages

### 1. Sesuaikan `vite.config.js`

Ganti nama repo di `base`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/akuntansi-umkm/', // ganti dengan nama repo kamu
})
```

### 2. Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 3. Tambah script di `package.json`

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "npm run build && gh-pages -d dist"
}
```

### 4. Deploy

```bash
npm run deploy
```

### 5. Aktifkan GitHub Pages

Di GitHub → repo → Settings → Pages → Source: **gh-pages branch**

Aplikasi akan live di: `https://USERNAME.github.io/akuntansi-umkm/`

---

## Struktur Project

```
src/
├── firebase.js              # Firebase config
├── App.jsx                  # Root + Auth gate + navigasi
├── main.jsx                 # Entry point
├── index.css                # Global styles
├── data/
│   └── coa.js               # Chart of accounts + helper functions
└── components/
    ├── Dashboard.jsx         # Ringkasan keuangan
    ├── JurnalUmum.jsx        # Input & daftar transaksi
    ├── BukuBesar.jsx         # Ledger per akun
    ├── LaporanKeuangan.jsx   # Laba Rugi + Neraca
    └── PiutangUtang.jsx      # Manajemen A/R & A/P
```

## Cara Tambah Akun Baru

Edit `src/data/coa.js`, tambah baris di array `COA`:

```js
{ kode: '5-170', nama: 'Beban Transportasi', tipe: 'beban' },
```

Tipe yang tersedia: `aset`, `kontra-aset`, `liabilitas`, `ekuitas`, `pendapatan`, `beban`

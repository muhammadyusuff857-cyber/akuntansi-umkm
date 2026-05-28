import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from './firebase'
import Dashboard from './components/Dashboard'
import JurnalUmum from './components/JurnalUmum'
import BukuBesar from './components/BukuBesar'
import LaporanKeuangan from './components/LaporanKeuangan'
import PiutangUtang from './components/PiutangUtang'

const TABS = [
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'jurnal',     label: 'Jurnal Umum' },
  { id: 'buku',       label: 'Buku Besar' },
  { id: 'laporan',    label: 'Laporan Keuangan' },
  { id: 'piutang',    label: 'Piutang & Utang' },
]

export default function App() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('dashboard')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [authError, setAuthError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      const messages = {
        'auth/invalid-credential':  'Email atau password salah.',
        'auth/email-already-in-use':'Email sudah terdaftar.',
        'auth/weak-password':       'Password minimal 6 karakter.',
        'auth/invalid-email':       'Format email tidak valid.',
      }
      setAuthError(messages[err.code] || err.message)
    }
  }

  const handleGoogle = async () => {
    setAuthError('')
    setGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError('Login Google gagal. Coba lagi.')
      }
    }
    setGoogleLoading(false)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#78716c', fontSize:13 }}>
      Memuat...
    </div>
  )

  if (!user) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#f5f5f4' }}>
      <div style={{ background:'#fff', border:'1px solid #e7e5e4', borderRadius:16, padding:'32px 28px', width:'100%', maxWidth:360 }}>

        {/* Header */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>🧾 AkunUMKM</div>
          <div style={{ fontSize:13, color:'#78716c' }}>Aplikasi akuntansi untuk usaha kecil</div>
        </div>

        {/* Google Sign-In */}
        <button onClick={handleGoogle} disabled={googleLoading}
          style={{ width:'100%', padding:'10px 0', borderRadius:8, fontWeight:600, fontSize:13,
            background:'#fff', color:'#1c1917', border:'1px solid #d6d3d1',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            marginBottom:16, cursor:'pointer', opacity: googleLoading ? 0.7 : 1 }}>
          {/* Google logo SVG */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {googleLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
        </button>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:'1px', background:'#e7e5e4' }} />
          <span style={{ fontSize:12, color:'#a8a29e' }}>atau</span>
          <div style={{ flex:1, height:'1px', background:'#e7e5e4' }} />
        </div>

        {/* Tab Masuk / Daftar */}
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => { setAuthMode(m); setAuthError('') }}
              style={{ flex:1, padding:'7px 0', borderRadius:8,
                fontWeight: authMode===m ? 600 : 400,
                background: authMode===m ? '#1c1917' : '#fff',
                color:      authMode===m ? '#fff'    : '#78716c',
                border:'1px solid #e7e5e4' }}>
              {m === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        {/* Form email/password */}
        <form onSubmit={handleAuth}>
          <div className="form-group" style={{ marginBottom:10 }}>
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nama@email.com" />
          </div>
          <div className="form-group" style={{ marginBottom:16 }}>
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••" />
          </div>
          {authError && <div style={{ fontSize:12, color:'#b91c1c', marginBottom:12 }}>{authError}</div>}
          <button type="submit" className="primary" style={{ width:'100%', padding:'9px 0', fontWeight:600 }}>
            {authMode === 'login' ? 'Masuk' : 'Buat Akun'}
          </button>
        </form>

      </div>
    </div>
  )

  const TabComponent = { dashboard: Dashboard, jurnal: JurnalUmum, buku: BukuBesar, laporan: LaporanKeuangan, piutang: PiutangUtang }[tab]

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f4' }}>
      {/* Topbar */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e7e5e4', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', height:52, position:'sticky', top:0, zIndex:10 }}>
        <div style={{ fontWeight:700, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
          🧾 AkunUMKM
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:12, color:'#78716c' }}>{user.displayName || user.email}</span>
          <button onClick={() => signOut(auth)} style={{ fontSize:12, padding:'5px 10px' }}>Keluar</button>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e7e5e4', padding:'0 16px', display:'flex', gap:2, overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'10px 14px', borderRadius:0, border:'none', borderBottom: tab===t.id ? '2px solid #1c1917' : '2px solid transparent',
              background:'transparent', color: tab===t.id ? '#1c1917' : '#78716c',
              fontWeight: tab===t.id ? 600 : 400, fontSize:13, whiteSpace:'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'20px 16px' }}>
        <TabComponent uid={user.uid} />
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from './AuthContext'

const CITIES = ["Cochabamba", "La Paz", "Santa Cruz", "Sucre", "Oruro", "Tarija", "Potosi", "Trinidad", "Cobija"]
const ROLES = [
  { id: "rescatista", emoji: "\u{1F9B8}", title: "Rescatista", desc: "Publico casos de emergencia", color: "#D85A30", bg: "#FFF0E6" },
  { id: "donante", emoji: "\u{1F49B}", title: "Donante", desc: "Quiero ayudar con donaciones", color: "#BA7517", bg: "#FFFBEF" },
  { id: "adoptante", emoji: "\u{1F3E0}", title: "Adoptante", desc: "Busco mascota para adoptar", color: "#0F6E56", bg: "#EEFAF4" },
]

export default function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    setError("")
    setLoading(true)
    
    if (mode === "login") {
      const { error } = await signIn(email, password)
      if (error) setError(error.message === "Invalid login credentials" ? "Email o contrase\u00f1a incorrectos" : error.message)
    } else {
      if (!name.trim()) { setError("Ingresa tu nombre"); setLoading(false); return }
      if (!city) { setError("Selecciona tu ciudad"); setLoading(false); return }
      if (!role) { setError("Selecciona tu rol"); setLoading(false); return }
      if (password.length < 6) { setError("La contrase\u00f1a debe tener al menos 6 caracteres"); setLoading(false); return }
      
      const { error } = await signUp(email, password, name, city, role)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif", background: "#FFF9F2", maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", borderRadius: 20 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Nunito:wght@400;600;700;800&display=swap');`}</style>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u{1F4E7}"}</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#3A2A1A", textAlign: "center", margin: "0 0 8px" }}>Revisa tu email</h2>
        <p style={{ fontSize: 14, color: "#8A7A6A", textAlign: "center", lineHeight: 1.6 }}>Te enviamos un link de confirmaci\u00f3n a <b>{email}</b>. Haz clic en el link para activar tu cuenta.</p>
        <button onClick={() => { setSuccess(false); setMode("login") }} style={{ marginTop: 24, padding: "12px 32px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Ya confirm\u00e9, ir al login
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif", background: "#FFF9F2", maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", borderRadius: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Nunito:wght@400;600;700;800&display=swap'); input::placeholder{color:#BEB0A0}`}</style>
      
      <div style={{ padding: "40px 24px 20px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(145deg, #D85A30, #EF9F27)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(216,90,48,0.3)" }}>
          <span style={{ fontSize: 28 }}>{"\u{1F43E}"}</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#3A2A1A", margin: "0 0 4px" }}>Zoe</h1>
        <p style={{ fontSize: 12, color: "#A09080", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Rescate Animal</p>
      </div>

      <div style={{ padding: "0 24px", flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", background: "#F0E6D9", borderRadius: 12, padding: 3, marginBottom: 20 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError("") }} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontFamily: "inherit",
              background: mode === m ? "#fff" : "transparent", color: mode === m ? "#D85A30" : "#8A7A6A",
              fontSize: 14, fontWeight: mode === m ? 700 : 500, cursor: "pointer",
              boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}>{m === "login" ? "Iniciar sesi\u00f3n" : "Registrarse"}</button>
          ))}
        </div>

        {error && <div style={{ background: "#FFF0EB", color: "#DC2626", padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{error}</div>}

        {mode === "register" && (
          <>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#5A4A3A", marginBottom: 6, display: "block" }}>Tu nombre</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Diana"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "2px solid #F0E6D9", fontSize: 14, background: "#FFFBF5", color: "#3A2A1A", outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }}
              onFocus={e => e.target.style.borderColor = "#D85A30"} onBlur={e => e.target.style.borderColor = "#F0E6D9"} />
          </>
        )}

        <label style={{ fontSize: 12, fontWeight: 700, color: "#5A4A3A", marginBottom: 6, display: "block" }}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
          style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "2px solid #F0E6D9", fontSize: 14, background: "#FFFBF5", color: "#3A2A1A", outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }}
          onFocus={e => e.target.style.borderColor = "#D85A30"} onBlur={e => e.target.style.borderColor = "#F0E6D9"} />

        <label style={{ fontSize: 12, fontWeight: 700, color: "#5A4A3A", marginBottom: 6, display: "block" }}>Contrase\u00f1a</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "register" ? "M\u00ednimo 6 caracteres" : "Tu contrase\u00f1a"}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "2px solid #F0E6D9", fontSize: 14, background: "#FFFBF5", color: "#3A2A1A", outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }}
          onFocus={e => e.target.style.borderColor = "#D85A30"} onBlur={e => e.target.style.borderColor = "#F0E6D9"}
          onKeyDown={e => e.key === "Enter" && mode === "login" && handleSubmit()} />

        {mode === "register" && (
          <>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#5A4A3A", marginBottom: 8, display: "block" }}>Tu ciudad</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)} style={{
                  padding: "6px 14px", borderRadius: 10, border: city === c ? "2px solid #D85A30" : "1px solid #F0E6D9",
                  background: city === c ? "#FEF0E6" : "#FFFBF5", color: city === c ? "#D85A30" : "#7A6A5A",
                  fontSize: 12, fontWeight: city === c ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
                }}>{c}</button>
              ))}
            </div>

            <label style={{ fontSize: 12, fontWeight: 700, color: "#5A4A3A", marginBottom: 8, display: "block" }}>{"\u00bfQu\u00e9 te trae a Zoe?"}</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {ROLES.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
                  border: role === r.id ? `2px solid ${r.color}` : "1px solid #F0E6D9",
                  background: role === r.id ? r.bg : "#FFFBF5", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                }}>
                  <span style={{ fontSize: 20 }}>{r.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: role === r.id ? r.color : "#3A2A1A" }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: "#8A7A6A" }}>{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: "16px 24px 32px" }}>
        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none", fontFamily: "inherit",
          background: loading ? "#E0D8D0" : "linear-gradient(135deg, #D85A30, #EF9F27)",
          color: loading ? "#A09080" : "#fff", fontSize: 16, fontWeight: 700,
          cursor: loading ? "default" : "pointer", boxShadow: loading ? "none" : "0 4px 16px rgba(216,90,48,0.3)",
        }}>
          {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear mi cuenta"}
        </button>
      </div>
    </div>
  )
}

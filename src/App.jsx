import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './AuthContext'
import AuthScreen from './AuthScreen'
import ZoeApp from './ZoeApp.jsx'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FFF9F2", maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(145deg, #D85A30, #EF9F27)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(216,90,48,0.3)", animation: "pulse 1.5s ease-in-out infinite" }}>
          <span style={{ fontSize: 28 }}>{"\u{1F43E}"}</span>
        </div>
        <p style={{ marginTop: 16, color: "#8A7A6A", fontSize: 14 }}>Cargando Zoe...</p>
        <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }`}</style>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return <ZoeApp />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

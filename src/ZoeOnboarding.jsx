import { useState, useEffect } from "react";

const ZoeOnboarding = ({ onComplete }) => {
  const [phase, setPhase] = useState("splash");
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [city, setCity] = useState("");
  const [animClass, setAnimClass] = useState("enter");
  const [pawPrints, setPawPrints] = useState([]);

  useEffect(() => {
    if (phase === "splash") {
      const t = setTimeout(() => setPhase("onboarding"), 2800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPawPrints(prev => {
        const next = [...prev, {
          id: Date.now(),
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
          rotation: Math.random() * 360,
          size: Math.random() * 12 + 8,
          delay: Math.random() * 0.5,
        }];
        return next.slice(-12);
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  function nextStep() {
    setAnimClass("exit");
    setTimeout(() => {
      if (step < 2) setStep(s => s + 1);
      else setPhase("setup");
      setAnimClass("enter");
    }, 300);
  }

  function prevStep() {
    setAnimClass("exit");
    setTimeout(() => {
      setStep(s => Math.max(0, s - 1));
      setAnimClass("enter");
    }, 300);
  }

  const onboardingScreens = [
    {
      emoji: "🆘",
      title: "Salva vidas",
      subtitle: "Publica casos de emergencia y recauda donaciones para mascotas que necesitan ayuda urgente",
      color: "#D85A30",
      bgGradient: "radial-gradient(circle at 50% 30%, #FFF0E6 0%, #FFF9F2 70%)",
      illustration: (
        <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, #FFE8D6 0%, transparent 70%)", animation: "pulse 2s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 80, filter: "drop-shadow(0 8px 24px rgba(216,90,48,0.3))" }}>🐕</div>
          <div style={{ position: "absolute", top: 20, right: 15, background: "#D85A30", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, animation: "float 3s ease-in-out infinite" }}>SOS</div>
          <div style={{ position: "absolute", bottom: 25, left: 10, background: "#FEF0E6", borderRadius: 12, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#D85A30", animation: "float 3s ease-in-out infinite 0.5s", boxShadow: "0 4px 12px rgba(216,90,48,0.15)" }}>Bs 1,650 / 2,800</div>
        </div>
      ),
    },
    {
      emoji: "🔍",
      title: "Encuéntralos",
      subtitle: "Reporta mascotas perdidas o ayuda a reunir familias. Cada minuto cuenta para traerlos de vuelta a casa",
      color: "#BA7517",
      bgGradient: "radial-gradient(circle at 50% 30%, #FFFBEF 0%, #FFF9F2 70%)",
      illustration: (
        <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}>
          <div style={{ position: "absolute", inset: 20, borderRadius: "50%", border: "3px dashed #EFD89F", animation: "spin 12s linear infinite" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 80, filter: "drop-shadow(0 8px 24px rgba(186,117,23,0.25))" }}>🐈</div>
          <div style={{ position: "absolute", top: 15, left: 20, fontSize: 28, animation: "float 2.5s ease-in-out infinite" }}>📍</div>
          <div style={{ position: "absolute", bottom: 20, right: 10, background: "#FFFBEF", borderRadius: 12, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#BA7517", animation: "float 3s ease-in-out infinite 1s", boxShadow: "0 4px 12px rgba(186,117,23,0.12)" }}>Zona Norte, CBB</div>
        </div>
      ),
    },
    {
      emoji: "🏠",
      title: "Dales un hogar",
      subtitle: "Nuestra IA te conecta con la mascota ideal según tu estilo de vida. Adoptar nunca fue tan fácil",
      color: "#0F6E56",
      bgGradient: "radial-gradient(circle at 50% 30%, #EEFAF4 0%, #FFF9F2 70%)",
      illustration: (
        <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, #E0F5EC 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "50%", left: "35%", transform: "translate(-50%, -50%)", fontSize: 70, filter: "drop-shadow(0 8px 24px rgba(15,110,86,0.2))" }}>🐶</div>
          <div style={{ position: "absolute", top: "45%", left: "68%", transform: "translate(-50%, -50%)", fontSize: 50, filter: "drop-shadow(0 6px 16px rgba(15,110,86,0.15))" }}>🐱</div>
          <div style={{ position: "absolute", top: 10, right: 25, fontSize: 14, background: "#E0F5EC", borderRadius: 20, padding: "4px 10px", fontWeight: 700, color: "#0F6E56", animation: "float 2s ease-in-out infinite" }}>✧ AI Match</div>
          <div style={{ position: "absolute", bottom: 15, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
            {["Juguetón", "Cariñoso", "Depto"].map((t, i) => (
              <span key={t} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 8, background: "#E0F5EC", color: "#0F6E56", fontWeight: 600, animation: `float 2.5s ease-in-out infinite ${i * 0.3}s` }}>{t}</span>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const roles = [
    { id: "rescatista", emoji: "🦸", title: "Rescatista", desc: "Publico casos de emergencia y busco ayuda para mascotas", color: "#D85A30", bg: "#FFF0E6" },
    { id: "donante", emoji: "💛", title: "Donante", desc: "Quiero ayudar con donaciones y hacer seguimiento", color: "#BA7517", bg: "#FFFBEF" },
    { id: "adoptante", emoji: "🏠", title: "Adoptante", desc: "Busco una mascota para darle un hogar", color: "#0F6E56", bg: "#EEFAF4" },
  ];

  const cities = ["Cochabamba", "La Paz", "Santa Cruz", "Sucre", "Oruro", "Tarija", "Potosí", "Trinidad", "Cobija"];

  // ===== LOGO COMPONENT =====
  function ZoeLogo({ size = 120, animate = true }) {
    return (
      <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
        {/* Outer glow ring */}
        <div style={{
          position: "absolute", inset: -8, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(216,90,48,0.15) 0%, transparent 70%)",
          animation: animate ? "pulse 2.5s ease-in-out infinite" : "none",
        }} />
        {/* Main circle */}
        <div style={{
          width: size, height: size, borderRadius: "50%",
          background: "linear-gradient(145deg, #D85A30 0%, #EF9F27 50%, #F5C45A 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
          boxShadow: "0 8px 32px rgba(216,90,48,0.35), inset 0 -2px 6px rgba(0,0,0,0.1), inset 0 2px 6px rgba(255,255,255,0.2)",
          animation: animate ? "logoEntry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both" : "none",
        }}>
          {/* Paw print SVG mark */}
          <svg viewBox="0 0 100 100" width={size * 0.55} height={size * 0.55} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
            {/* Main pad */}
            <ellipse cx="50" cy="62" rx="18" ry="16" fill="white" opacity="0.95">
              {animate && <animate attributeName="ry" values="16;17;16" dur="2s" repeatCount="indefinite" />}
            </ellipse>
            {/* Top pads */}
            <ellipse cx="30" cy="38" rx="9" ry="10" fill="white" opacity="0.95" transform="rotate(-15 30 38)">
              {animate && <animate attributeName="ry" values="10;11;10" dur="2s" begin="0.1s" repeatCount="indefinite" />}
            </ellipse>
            <ellipse cx="70" cy="38" rx="9" ry="10" fill="white" opacity="0.95" transform="rotate(15 70 38)">
              {animate && <animate attributeName="ry" values="10;11;10" dur="2s" begin="0.2s" repeatCount="indefinite" />}
            </ellipse>
            {/* Small top pads */}
            <ellipse cx="42" cy="28" rx="7" ry="8" fill="white" opacity="0.95" transform="rotate(-5 42 28)">
              {animate && <animate attributeName="ry" values="8;9;8" dur="2s" begin="0.3s" repeatCount="indefinite" />}
            </ellipse>
            <ellipse cx="58" cy="28" rx="7" ry="8" fill="white" opacity="0.95" transform="rotate(5 58 28)">
              {animate && <animate attributeName="ry" values="8;9;8" dur="2s" begin="0.4s" repeatCount="indefinite" />}
            </ellipse>
            {/* Heart in center of main pad */}
            <path d="M44 60 C44 56, 50 54, 50 58 C50 54, 56 56, 56 60 C56 65, 50 69, 50 69 C50 69, 44 65, 44 60Z" fill="#D85A30" opacity="0.7">
              {animate && <animate attributeName="opacity" values="0.7;0.9;0.7" dur="1.5s" repeatCount="indefinite" />}
            </path>
          </svg>
        </div>
      </div>
    );
  }

  // ===== SPLASH SCREEN =====
  if (phase === "splash") {
    return (
      <div style={{
        fontFamily: "'DM Sans', 'Nunito', sans-serif",
        background: "linear-gradient(170deg, #FFF9F2 0%, #FFF0E6 40%, #FFEBD6 100%)",
        maxWidth: 480, margin: "0 auto", minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", borderRadius: 20,
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes logoEntry { 0% { transform: scale(0) rotate(-20deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
          @keyframes textEntry { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
          @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } }
          @keyframes pawFade { 0% { opacity: 0; transform: scale(0.5) rotate(var(--rot)); } 30% { opacity: 0.15; transform: scale(1) rotate(var(--rot)); } 100% { opacity: 0; transform: scale(1.2) rotate(var(--rot)); } }
          @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        `}</style>

        {/* Floating paw prints background */}
        {pawPrints.map(p => (
          <div key={p.id} style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size,
            "--rot": `${p.rotation}deg`,
            animation: `pawFade 3s ease-out ${p.delay}s both`, pointerEvents: "none", opacity: 0,
          }}>🐾</div>
        ))}

        <ZoeLogo size={130} animate={true} />

        <div style={{ animation: "textEntry 0.6s ease 0.5s both", marginTop: 24 }}>
          <h1 style={{
            fontSize: 48, fontWeight: 800, letterSpacing: -2, textAlign: "center", margin: 0, lineHeight: 1,
            background: "linear-gradient(135deg, #D85A30 0%, #EF9F27 50%, #D85A30 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
          }}>Zoe</h1>
        </div>
        <p style={{ animation: "textEntry 0.6s ease 0.8s both", opacity: 0, fontSize: 14, color: "#A08060", letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginTop: 8 }}>
          Rescate animal
        </p>
        <p style={{ animation: "textEntry 0.6s ease 1.2s both", opacity: 0, fontSize: 13, color: "#C0A080", marginTop: 24, fontStyle: "italic" }}>
          Cada vida importa
        </p>
      </div>
    );
  }

  // ===== ONBOARDING SCREENS =====
  if (phase === "onboarding") {
    const screen = onboardingScreens[step];
    return (
      <div style={{
        fontFamily: "'DM Sans', 'Nunito', sans-serif",
        background: screen.bgGradient,
        maxWidth: 480, margin: "0 auto", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden", borderRadius: 20,
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.08); opacity: 1; } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes enter { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes exit { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-30px); } }
          .screen-enter { animation: enter 0.3s ease both; }
          .screen-exit { animation: exit 0.3s ease both; }
        `}</style>

        {/* Skip button */}
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setPhase("setup")} style={{
            background: "none", border: "none", fontSize: 14, color: "#A09080",
            fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Omitir</button>
        </div>

        {/* Content */}
        <div className={`screen-${animClass}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", gap: 24 }}>
          {/* Logo small */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(145deg, #D85A30, #EF9F27)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(216,90,48,0.25)",
            }}>
              <svg viewBox="0 0 100 100" width="18" height="18">
                <ellipse cx="50" cy="62" rx="18" ry="16" fill="white" opacity="0.95"/>
                <ellipse cx="30" cy="38" rx="9" ry="10" fill="white" opacity="0.95" transform="rotate(-15 30 38)"/>
                <ellipse cx="70" cy="38" rx="9" ry="10" fill="white" opacity="0.95" transform="rotate(15 70 38)"/>
                <ellipse cx="42" cy="28" rx="7" ry="8" fill="white" opacity="0.95" transform="rotate(-5 42 28)"/>
                <ellipse cx="58" cy="28" rx="7" ry="8" fill="white" opacity="0.95" transform="rotate(5 58 28)"/>
              </svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#D85A30", letterSpacing: -0.5 }}>Zoe</span>
          </div>

          {/* Illustration */}
          {screen.illustration}

          {/* Text */}
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#3A2A1A", margin: "0 0 10px", lineHeight: 1.2 }}>{screen.title}</h2>
            <p style={{ fontSize: 15, color: "#7A6A5A", lineHeight: 1.6, margin: 0, maxWidth: 300 }}>{screen.subtitle}</p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: "24px 32px 40px" }}>
          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: i === step ? 24 : 8, height: 8, borderRadius: 4,
                background: i === step ? screen.color : "#E0D8D0",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {step > 0 && (
              <button onClick={prevStep} style={{
                padding: "14px 24px", borderRadius: 14, border: `2px solid ${screen.color}`,
                background: "transparent", color: screen.color, fontSize: 16, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>←</button>
            )}
            <button onClick={nextStep} style={{
              flex: 1, padding: "14px 24px", borderRadius: 14, border: "none", fontFamily: "inherit",
              background: `linear-gradient(135deg, ${screen.color}, #EF9F27)`,
              color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 16px ${screen.color}40`,
            }}>
              {step === 2 ? "¡Comenzar!" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== SETUP SCREEN (Role selection + Name + City) =====
  if (phase === "setup") {
    const allFilled = selectedRole && userName.trim() && city;
    return (
      <div style={{
        fontFamily: "'DM Sans', 'Nunito', sans-serif",
        background: "#FFF9F2", maxWidth: 480, margin: "0 auto", minHeight: "100vh",
        display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", borderRadius: 20,
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }
          input::placeholder { color: #BEB0A0; }
        `}</style>

        <div style={{ padding: "32px 24px", flex: 1, overflowY: "auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeUp 0.5s ease both" }}>
            <ZoeLogo size={72} animate={false} />
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#3A2A1A", margin: "16px 0 6px" }}>Personaliza tu experiencia</h2>
            <p style={{ fontSize: 14, color: "#8A7A6A", margin: 0 }}>Cuéntanos un poco de ti para comenzar</p>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 24, animation: "fadeUp 0.5s ease 0.1s both" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#5A4A3A", marginBottom: 8, display: "block" }}>¿Cómo te llamas?</label>
            <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Tu nombre"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid #F0E6D9",
                fontSize: 15, background: "#FFFBF5", color: "#3A2A1A", outline: "none",
                boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#D85A30"}
              onBlur={e => e.target.style.borderColor = "#F0E6D9"}
            />
          </div>

          {/* City */}
          <div style={{ marginBottom: 28, animation: "fadeUp 0.5s ease 0.2s both" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#5A4A3A", marginBottom: 8, display: "block" }}>¿En qué ciudad estás?</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cities.map(c => (
                <button key={c} onClick={() => setCity(c)} style={{
                  padding: "8px 16px", borderRadius: 12, border: city === c ? "2px solid #D85A30" : "1px solid #F0E6D9",
                  background: city === c ? "#FEF0E6" : "#FFFBF5",
                  color: city === c ? "#D85A30" : "#7A6A5A", fontSize: 13, fontWeight: city === c ? 700 : 500,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Role selection */}
          <div style={{ animation: "fadeUp 0.5s ease 0.3s both" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#5A4A3A", marginBottom: 12, display: "block" }}>¿Qué te trae a Zoe?</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {roles.map(r => (
                <button key={r.id} onClick={() => setSelectedRole(r.id)} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 16,
                  border: selectedRole === r.id ? `2px solid ${r.color}` : "1px solid #F0E6D9",
                  background: selectedRole === r.id ? r.bg : "#FFFBF5",
                  cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
                  animation: selectedRole === r.id ? "pulse 1.5s ease-in-out infinite" : "none",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, background: r.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
                    boxShadow: selectedRole === r.id ? `0 4px 12px ${r.color}20` : "none",
                  }}>{r.emoji}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: selectedRole === r.id ? r.color : "#3A2A1A" }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: "#8A7A6A", marginTop: 2, lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginLeft: "auto",
                    border: selectedRole === r.id ? `6px solid ${r.color}` : "2px solid #D8D0C8",
                    background: selectedRole === r.id ? "#fff" : "transparent",
                    transition: "all 0.2s",
                  }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "16px 24px 32px", animation: "fadeUp 0.5s ease 0.4s both" }}>
          <button onClick={() => allFilled && setPhase("ready")} style={{
            width: "100%", padding: "16px", borderRadius: 16, border: "none", fontFamily: "inherit",
            background: allFilled ? "linear-gradient(135deg, #D85A30, #EF9F27)" : "#E8E0D8",
            color: allFilled ? "#fff" : "#A09080", fontSize: 17, fontWeight: 800,
            cursor: allFilled ? "pointer" : "default", transition: "all 0.3s",
            boxShadow: allFilled ? "0 6px 24px rgba(216,90,48,0.3)" : "none",
          }}>
            Entrar a Zoe 🐾
          </button>
        </div>
      </div>
    );
  }

  // ===== READY / WELCOME SCREEN =====
  if (phase === "ready") {
    const role = roles.find(r => r.id === selectedRole);
    return (
      <div style={{
        fontFamily: "'DM Sans', 'Nunito', sans-serif",
        background: "linear-gradient(170deg, #FFF9F2 0%, #FFF0E6 50%, #FFEBD6 100%)",
        maxWidth: 480, margin: "0 auto", minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", borderRadius: 20, padding: "32px 24px",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Nunito:wght@400;600;700;800&display=swap');
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes confetti1 { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-60px) rotate(180deg); opacity: 0; } }
          @keyframes confetti2 { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-80px) rotate(-150deg); opacity: 0; } }
          @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        `}</style>

        {/* Confetti emojis */}
        {["🐾", "🧡", "✨", "🐕", "🐈", "💛", "🏠", "⭐"].map((e, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + i * 12}%`, top: `${40 + (i % 3) * 15}%`,
            fontSize: 20 + (i % 3) * 8,
            animation: `confetti${i % 2 + 1} ${2 + i * 0.3}s ease-out ${i * 0.15}s both`,
            pointerEvents: "none",
          }}>{e}</div>
        ))}

        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          <ZoeLogo size={100} animate={true} />
        </div>

        <h1 style={{
          fontSize: 32, fontWeight: 800, color: "#3A2A1A", textAlign: "center",
          margin: "24px 0 8px", animation: "fadeUp 0.6s ease 0.2s both",
        }}>
          ¡Bienvenido/a, {userName}! 🎉
        </h1>

        <p style={{
          fontSize: 15, color: "#7A6A5A", textAlign: "center", lineHeight: 1.6,
          maxWidth: 320, margin: "0 0 24px", animation: "fadeUp 0.6s ease 0.35s both",
        }}>
          Tu perfil como <strong style={{ color: role.color }}>{role.title}</strong> en <strong>{city}</strong> está listo. Las mascotas de tu zona te están esperando.
        </p>

        <div style={{
          background: "#FFFBF5", borderRadius: 20, padding: "20px 24px", width: "100%",
          border: "1px solid #F0E6D9", animation: "fadeUp 0.6s ease 0.5s both",
          boxShadow: "0 4px 20px rgba(216,90,48,0.08)",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#3A2A1A", marginBottom: 12 }}>Lo que puedes hacer ahora:</div>
          {[
            { icon: "♥", text: "Ver casos urgentes cerca de ti", color: "#D85A30" },
            { icon: "🔍", text: "Buscar mascotas perdidas en tu zona", color: "#BA7517" },
            { icon: "✧", text: "Hablar con Zoe AI para encontrar tu match", color: "#0F6E56" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
              animation: `fadeUp 0.4s ease ${0.6 + i * 0.1}s both`,
            }}>
              <span style={{ fontSize: 16, width: 32, height: 32, borderRadius: 10, background: "#FFF0E6", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: "#5A4A3A" }}>{item.text}</span>
            </div>
          ))}
        </div>

        <button onClick={() => onComplete && onComplete()} style={{
          width: "100%", padding: "16px", borderRadius: 16, border: "none", fontFamily: "inherit",
          background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff",
          fontSize: 17, fontWeight: 800, cursor: "pointer", marginTop: 28,
          boxShadow: "0 6px 24px rgba(216,90,48,0.3)",
          animation: "fadeUp 0.6s ease 0.8s both, pulse 2s ease-in-out 1.5s infinite",
        }}>
          Explorar Zoe 🐾
        </button>
      </div>
    );
  }

  return null;
};

export default ZoeOnboarding;

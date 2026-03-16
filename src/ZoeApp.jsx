import { useState, useEffect, useRef } from "react";

const PETS_DATA = [
  { id: 1, name: "Luna", type: "Perrita", breed: "Mestiza", age: "~2 años", section: "urgencia", urgency: "crítico", photo: "🐕", description: "Encontrada atropellada en la Av. Blanco Galindo. Necesita cirugía de cadera urgente.", location: "Cochabamba, Quillacollo", needed: 2800, raised: 1650, donors: 23, daysLeft: 3, color: "#D85A30" },
  { id: 2, name: "Simón", type: "Gatito", breed: "Siamés mix", age: "~4 meses", section: "urgencia", urgency: "alto", photo: "🐈", description: "Rescatado de un terreno baldío con infección severa en los ojos. Requiere tratamiento veterinario.", location: "La Paz, Sopocachi", needed: 1200, raised: 890, donors: 15, daysLeft: 5, color: "#BA7517" },
  { id: 3, name: "Rocky", type: "Perro", breed: "Pastor Alemán mix", age: "~5 años", section: "perdido", photo: "🐕‍🦺", description: "Se perdió durante los fuegos artificiales de Carnaval. Lleva collar azul con placa. Es muy dócil.", location: "Cochabamba, Zona Norte", lastSeen: "Hace 2 días", contact: "+591 712 345 67", reward: true },
  { id: 4, name: "Michi", type: "Gatita", breed: "Carey", age: "~1 año", section: "perdido", photo: "🐈‍⬛", description: "Escapó por la ventana durante una tormenta. Tiene un cascabel rosa y está esterilizada.", location: "Santa Cruz, Equipetrol", lastSeen: "Hace 5 días", contact: "+591 698 765 43", reward: false },
  { id: 5, name: "Canela", type: "Perrita", breed: "Cocker Spaniel mix", age: "~3 años", section: "adopcion", photo: "🐶", description: "Rescatada de situación de maltrato. Ya está vacunada, esterilizada y lista para un hogar lleno de amor. Es juguetona y excelente con niños.", location: "Cochabamba, Centro", personality: ["Juguetona", "Cariñosa", "Buena con niños"], vaccinated: true, sterilized: true },
  { id: 6, name: "Nube", type: "Gatito", breed: "Persa mix", age: "~6 meses", section: "adopcion", photo: "🐱", description: "Encontrado abandonado en una caja. Es tranquilo, independiente y le encanta dormir en lugares altos. Ideal para departamento.", location: "La Paz, Miraflores", personality: ["Tranquilo", "Independiente", "Apto depto"], vaccinated: true, sterilized: false },
  { id: 7, name: "Thor", type: "Perro", breed: "Pitbull mix", age: "~4 años", section: "adopcion", photo: "🦮", description: "Fue abandonado cuando su familia se mudó. Es leal, protector y muy entrenado. Necesita un dueño con experiencia.", location: "Cochabamba, Tiquipaya", personality: ["Leal", "Protector", "Entrenado"], vaccinated: true, sterilized: true },
  { id: 8, name: "Pelusa", type: "Conejita", breed: "Holland Lop", age: "~1 año", section: "adopcion", photo: "🐰", description: "Rescatada de un criadero ilegal. Es dócil y sociable. Viene con su jaula y accesorios.", location: "Santa Cruz, Plan 3000", personality: ["Dócil", "Sociable", "Con accesorios"], vaccinated: true, sterilized: false },
];

const NOTIFICATIONS = [
  { id: 1, text: "Luna necesita tu ayuda urgente — le faltan Bs 1,150 para su cirugía", time: "Hace 5 min", type: "urgencia", petId: 1 },
  { id: 2, text: "¡Nuevo perrito perdido cerca de ti! Rocky se perdió en Zona Norte", time: "Hace 20 min", type: "perdido", petId: 3 },
  { id: 3, text: "Canela está buscando hogar — coincide con tu perfil de adoptante", time: "Hace 1 hora", type: "adopcion", petId: 5 },
  { id: 4, text: "Simón alcanzó el 74% de su meta gracias a 15 donantes", time: "Hace 2 horas", type: "urgencia", petId: 2 },
];

function ZoeApp() {
  const [section, setSection] = useState("feed");
  const [selectedPet, setSelectedPet] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [donateModal, setDonateModal] = useState(null);
  const [donateAmount, setDonateAmount] = useState("");
  const [donated, setDonated] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [aiChat, setAiChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fadeIn, setFadeIn] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [section, selectedPet]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const urgencias = PETS_DATA.filter(p => p.section === "urgencia");
  const perdidos = PETS_DATA.filter(p => p.section === "perdido");
  const adopciones = PETS_DATA.filter(p => p.section === "adopcion");

  const filteredAdopciones = adopciones.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleAiSend() {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");
    setAiLoading(true);
    try {
      const context = `Eres Zoe AI, el asistente inteligente de la app Zoe — una plataforma boliviana de rescate y adopción animal. 
Datos de mascotas disponibles: ${JSON.stringify(PETS_DATA.map(p => ({ name: p.name, type: p.type, breed: p.breed, section: p.section, location: p.location, personality: p.personality })))}
Responde en español, sé cálido y útil. Si preguntan por adopción, recomienda mascotas del catálogo. Si preguntan por urgencias, muestra empatía y guía para donar. Máximo 3-4 oraciones.`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: context,
          messages: [
            ...aiMessages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userMsg }
          ],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text || "").join("") || "No pude procesar tu mensaje. Intenta de nuevo.";
      setAiMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setAiMessages(prev => [...prev, { role: "assistant", text: "Hubo un error conectando con la IA. Intenta de nuevo en un momento." }]);
    }
    setAiLoading(false);
  }

  function ProgressBar({ raised, needed, color }) {
    const pct = Math.min((raised / needed) * 100, 100);
    return (
      <div style={{ width: "100%", height: 8, borderRadius: 4, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: color || "#D85A30", transition: "width 0.6s ease" }} />
      </div>
    );
  }

  function Badge({ text, color }) {
    return (
      <span style={{
        display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: color || "#FEF0E6", color: color ? "#fff" : "#D85A30", letterSpacing: 0.3
      }}>{text}</span>
    );
  }

  function NavBar() {
    const tabs = [
      { id: "feed", label: "Inicio", icon: "◉" },
      { id: "urgencias", label: "Urgencias", icon: "♥" },
      { id: "perdidos", label: "Perdidos", icon: "◎" },
      { id: "adopciones", label: "Adoptar", icon: "✦" },
    ];
    return (
      <nav style={{
        position: "sticky", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-around",
        background: "#FFFBF5", borderTop: "1px solid #F0E6D9", padding: "6px 0 10px", zIndex: 100,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setSection(t.id); setSelectedPet(null); }}
            style={{
              background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 2, color: section === t.id ? "#D85A30" : "#A09080", transition: "all 0.2s",
              fontSize: 11, fontWeight: section === t.id ? 700 : 500, fontFamily: "inherit",
            }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    );
  }

  function Header() {
    return (
      <header style={{
        position: "sticky", top: 0, zIndex: 100, background: "linear-gradient(135deg, #D85A30 0%, #EF9F27 100%)",
        padding: "14px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>🐾</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>Zoe</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase" }}>Rescate animal</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => setAiChat(true)} style={{
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20,
            padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            backdropFilter: "blur(10px)", display: "flex", alignItems: "center", gap: 5,
          }}>
            ✧ Zoe AI
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifs(!showNotifs)} style={{
              background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
              width: 36, height: 36, color: "#fff", fontSize: 16, cursor: "pointer", position: "relative",
            }}>
              🔔
              <span style={{
                position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%",
                background: "#FF4444", border: "2px solid #D85A30",
              }} />
            </button>
            {showNotifs && (
              <div style={{
                position: "absolute", top: 44, right: 0, width: 300, background: "#FFFBF5",
                borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", padding: 8, zIndex: 200,
                border: "1px solid #F0E6D9",
              }}>
                <div style={{ padding: "8px 12px", fontWeight: 700, fontSize: 14, color: "#3A2A1A" }}>Notificaciones</div>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} onClick={() => {
                    const pet = PETS_DATA.find(p => p.id === n.petId);
                    if (pet) { setSelectedPet(pet); setSection(pet.section === "urgencia" ? "urgencias" : pet.section === "perdido" ? "perdidos" : "adopciones"); }
                    setShowNotifs(false);
                  }} style={{
                    padding: "10px 12px", borderRadius: 12, cursor: "pointer", marginBottom: 4,
                    background: n.type === "urgencia" ? "#FFF0EB" : n.type === "perdido" ? "#FFF8E6" : "#F0FAF4",
                    transition: "transform 0.15s", fontSize: 13, color: "#3A2A1A",
                  }}>
                    <div style={{ fontWeight: 500, lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: "#A09080", marginTop: 4 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  function PetDetailUrgencia({ pet }) {
    return (
      <div style={{ animation: "fadeSlide 0.3s ease" }}>
        <button onClick={() => setSelectedPet(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D85A30", fontWeight: 600, fontSize: 14, padding: "16px 16px 8px", fontFamily: "inherit" }}>← Volver</button>
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 64, textAlign: "center", padding: "20px 0", background: "linear-gradient(180deg, #FFF8F0 0%, transparent 100%)", borderRadius: 20, marginBottom: 16 }}>{pet.photo}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#3A2A1A", margin: 0 }}>{pet.name}</h2>
              <div style={{ fontSize: 13, color: "#8A7A6A" }}>{pet.type} · {pet.breed} · {pet.age}</div>
            </div>
            <Badge text={pet.urgency === "crítico" ? "CRÍTICO" : "URGENTE"} color={pet.urgency === "crítico" ? "#DC2626" : "#D85A30"} />
          </div>
          <p style={{ fontSize: 14, color: "#5A4A3A", lineHeight: 1.6, margin: "0 0 16px" }}>{pet.description}</p>
          <div style={{ fontSize: 13, color: "#8A7A6A", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>📍 {pet.location}</div>
          <div style={{ background: "#FFF8F0", borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#D85A30" }}>Bs {pet.raised.toLocaleString()}</span>
              <span style={{ fontSize: 14, color: "#8A7A6A" }}>de Bs {pet.needed.toLocaleString()}</span>
            </div>
            <ProgressBar raised={pet.raised} needed={pet.needed} color={pet.color} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: "#8A7A6A" }}>
              <span>{pet.donors} donantes</span>
              <span>{pet.daysLeft} días restantes</span>
            </div>
          </div>
          <button onClick={() => setDonateModal(pet)} style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none", fontFamily: "inherit",
            background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff", fontSize: 16, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 16px rgba(216,90,48,0.3)",
          }}>
            ♥ Donar ahora
          </button>
        </div>
      </div>
    );
  }

  function PetDetailPerdido({ pet }) {
    return (
      <div style={{ animation: "fadeSlide 0.3s ease" }}>
        <button onClick={() => setSelectedPet(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D85A30", fontWeight: 600, fontSize: 14, padding: "16px 16px 8px", fontFamily: "inherit" }}>← Volver</button>
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 64, textAlign: "center", padding: "20px 0", background: "linear-gradient(180deg, #FFFBEF 0%, transparent 100%)", borderRadius: 20, marginBottom: 16 }}>{pet.photo}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#3A2A1A", margin: "0 0 4px" }}>{pet.name}</h2>
          <div style={{ fontSize: 13, color: "#8A7A6A", marginBottom: 12 }}>{pet.type} · {pet.breed} · {pet.age}</div>
          <p style={{ fontSize: 14, color: "#5A4A3A", lineHeight: 1.6, margin: "0 0 16px" }}>{pet.description}</p>
          <div style={{ background: "#FFFBEF", borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#5A4A3A", marginBottom: 8 }}>📍 <strong>Última ubicación:</strong> {pet.location}</div>
            <div style={{ fontSize: 13, color: "#5A4A3A", marginBottom: 8 }}>🕐 <strong>Visto:</strong> {pet.lastSeen}</div>
            <div style={{ fontSize: 13, color: "#5A4A3A" }}>📞 <strong>Contacto:</strong> {pet.contact}</div>
            {pet.reward && <Badge text="Ofrece recompensa" color="#BA7517" />}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ flex: 1, padding: 14, borderRadius: 14, border: "none", background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📞 Contactar</button>
            <button style={{ flex: 1, padding: 14, borderRadius: 14, border: "2px solid #D85A30", background: "transparent", color: "#D85A30", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📤 Compartir</button>
          </div>
        </div>
      </div>
    );
  }

  function PetDetailAdopcion({ pet }) {
    return (
      <div style={{ animation: "fadeSlide 0.3s ease" }}>
        <button onClick={() => setSelectedPet(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D85A30", fontWeight: 600, fontSize: 14, padding: "16px 16px 8px", fontFamily: "inherit" }}>← Volver</button>
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ fontSize: 64, textAlign: "center", padding: "20px 0", background: "linear-gradient(180deg, #F0FAF4 0%, transparent 100%)", borderRadius: 20, marginBottom: 16 }}>{pet.photo}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#3A2A1A", margin: "0 0 4px" }}>{pet.name}</h2>
          <div style={{ fontSize: 13, color: "#8A7A6A", marginBottom: 12 }}>{pet.type} · {pet.breed} · {pet.age}</div>
          <p style={{ fontSize: 14, color: "#5A4A3A", lineHeight: 1.6, margin: "0 0 16px" }}>{pet.description}</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {pet.personality?.map(p => <Badge key={p} text={p} />)}
            {pet.vaccinated && <Badge text="Vacunado/a" />}
            {pet.sterilized && <Badge text="Esterilizado/a" />}
          </div>
          <div style={{ fontSize: 13, color: "#8A7A6A", marginBottom: 20 }}>📍 {pet.location}</div>
          <button onClick={() => setAiChat(true)} style={{
            width: "100%", padding: 14, borderRadius: 14, border: "none", fontFamily: "inherit",
            background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff", fontSize: 16, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 16px rgba(216,90,48,0.3)",
          }}>
            ✧ Consultar adopción con Zoe AI
          </button>
        </div>
      </div>
    );
  }

  function PetCard({ pet, onClick }) {
    return (
      <div onClick={onClick} style={{
        background: "#FFFBF5", borderRadius: 16, padding: 14, cursor: "pointer", border: "1px solid #F0E6D9",
        transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(216,90,48,0.12)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ fontSize: 40, flexShrink: 0, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF8F0", borderRadius: 14 }}>{pet.photo}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#3A2A1A" }}>{pet.name}</span>
              {pet.section === "urgencia" && <Badge text={pet.urgency === "crítico" ? "CRÍTICO" : "URGENTE"} color={pet.urgency === "crítico" ? "#DC2626" : "#D85A30"} />}
              {pet.section === "perdido" && <Badge text="Perdido" color="#BA7517" />}
              {pet.section === "adopcion" && <Badge text="En adopción" />}
            </div>
            <div style={{ fontSize: 12, color: "#8A7A6A", marginBottom: 6 }}>{pet.type} · {pet.breed} · {pet.age}</div>
            <div style={{ fontSize: 13, color: "#5A4A3A", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{pet.description}</div>
            {pet.section === "urgencia" && (
              <div style={{ marginTop: 10 }}>
                <ProgressBar raised={pet.raised} needed={pet.needed} color={pet.color} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#A09080" }}>
                  <span>Bs {pet.raised.toLocaleString()} / {pet.needed.toLocaleString()}</span>
                  <span>{pet.daysLeft} días</span>
                </div>
              </div>
            )}
            {pet.section === "perdido" && (
              <div style={{ marginTop: 6, fontSize: 12, color: "#A09080" }}>📍 {pet.location} · {pet.lastSeen}</div>
            )}
            {pet.section === "adopcion" && (
              <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                {pet.personality?.slice(0, 3).map(p => (
                  <span key={p} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#FEF0E6", color: "#D85A30", fontWeight: 500 }}>{p}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function FeedSection() {
    return (
      <div style={{ padding: "16px", animation: fadeIn ? "fadeSlide 0.3s ease" : "none" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3A2A1A", margin: "0 0 4px" }}>¡Hola! 👋</h2>
        <p style={{ fontSize: 14, color: "#8A7A6A", margin: "0 0 20px" }}>Estas mascotas necesitan tu ayuda hoy</p>
        
        <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {[{ n: urgencias.length, label: "Urgencias", color: "#DC2626", bg: "#FFF0EB" }, { n: perdidos.length, label: "Perdidos", color: "#BA7517", bg: "#FFFBEF" }, { n: adopciones.length, label: "En adopción", color: "#0F6E56", bg: "#F0FAF4" }].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "12px 18px", minWidth: 100, textAlign: "center", flex: "0 0 auto" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.n}</div>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#D85A30", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>♥ Casos urgentes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {urgencias.map(p => <PetCard key={p.id} pet={p} onClick={() => setSelectedPet(p)} />)}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#BA7517", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>◎ Perdidos recientemente</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {perdidos.map(p => <PetCard key={p.id} pet={p} onClick={() => setSelectedPet(p)} />)}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F6E56", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>✦ Listos para adoptar</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {adopciones.slice(0, 2).map(p => <PetCard key={p.id} pet={p} onClick={() => setSelectedPet(p)} />)}
        </div>
      </div>
    );
  }

  function UrgenciasSection() {
    return (
      <div style={{ padding: "16px", animation: fadeIn ? "fadeSlide 0.3s ease" : "none" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3A2A1A", margin: "0 0 4px" }}>Casos urgentes</h2>
        <p style={{ fontSize: 14, color: "#8A7A6A", margin: "0 0 16px" }}>Estas mascotas necesitan ayuda inmediata</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {urgencias.map(p => <PetCard key={p.id} pet={p} onClick={() => setSelectedPet(p)} />)}
        </div>
      </div>
    );
  }

  function PerdidosSection() {
    return (
      <div style={{ padding: "16px", animation: fadeIn ? "fadeSlide 0.3s ease" : "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3A2A1A", margin: 0 }}>Mascotas perdidas</h2>
            <p style={{ fontSize: 14, color: "#8A7A6A", margin: "4px 0 0" }}>Ayúdalos a volver a casa</p>
          </div>
          <button onClick={() => setReportModal(true)} style={{
            padding: "8px 14px", borderRadius: 12, border: "none", fontFamily: "inherit",
            background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>+ Reportar</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {perdidos.map(p => <PetCard key={p.id} pet={p} onClick={() => setSelectedPet(p)} />)}
        </div>
      </div>
    );
  }

  function AdopcionesSection() {
    return (
      <div style={{ padding: "16px", animation: fadeIn ? "fadeSlide 0.3s ease" : "none" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3A2A1A", margin: "0 0 4px" }}>Adoptar</h2>
        <p style={{ fontSize: 14, color: "#8A7A6A", margin: "0 0 16px" }}>Encuentra a tu compañero ideal</p>
        <input type="text" placeholder="Buscar por nombre, tipo o raza..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid #F0E6D9", fontSize: 14,
            background: "#FFFBF5", color: "#3A2A1A", outline: "none", marginBottom: 16, boxSizing: "border-box", fontFamily: "inherit",
          }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredAdopciones.map(p => <PetCard key={p.id} pet={p} onClick={() => setSelectedPet(p)} />)}
          {filteredAdopciones.length === 0 && <p style={{ textAlign: "center", color: "#A09080", fontSize: 14, padding: 20 }}>No se encontraron mascotas con ese criterio</p>}
        </div>
      </div>
    );
  }

  function DonateModalView() {
    if (!donateModal) return null;
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        onClick={() => { setDonateModal(null); setDonated(false); setDonateAmount(""); }}>
        <div style={{ background: "#FFFBF5", borderRadius: "24px 24px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 480, animation: "slideUp 0.3s ease" }}
          onClick={e => e.stopPropagation()}>
          {donated ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧡</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#3A2A1A", margin: "0 0 8px" }}>¡Gracias por tu donación!</h3>
              <p style={{ fontSize: 14, color: "#8A7A6A", margin: 0 }}>Tu aporte de Bs {donateAmount} ayudará a {donateModal.name}</p>
              <button onClick={() => { setDonateModal(null); setDonated(false); setDonateAmount(""); }} style={{
                marginTop: 20, padding: "12px 32px", borderRadius: 14, border: "none", fontFamily: "inherit",
                background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}>Cerrar</button>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#3A2A1A", margin: "0 0 4px" }}>Donar para {donateModal.name}</h3>
              <p style={{ fontSize: 13, color: "#8A7A6A", margin: "0 0 20px" }}>Le faltan Bs {(donateModal.needed - donateModal.raised).toLocaleString()} para su tratamiento</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[50, 100, 200, 500].map(amt => (
                  <button key={amt} onClick={() => setDonateAmount(String(amt))} style={{
                    flex: 1, padding: "10px 0", borderRadius: 12, border: donateAmount === String(amt) ? "2px solid #D85A30" : "1px solid #F0E6D9",
                    background: donateAmount === String(amt) ? "#FEF0E6" : "#FFFBF5",
                    color: donateAmount === String(amt) ? "#D85A30" : "#5A4A3A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  }}>Bs {amt}</button>
                ))}
              </div>
              <input type="number" placeholder="Otro monto (Bs)" value={!["50","100","200","500"].includes(donateAmount) ? donateAmount : ""}
                onChange={e => setDonateAmount(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid #F0E6D9", fontSize: 14, background: "#FFFBF5", color: "#3A2A1A", outline: "none", marginBottom: 16, boxSizing: "border-box", fontFamily: "inherit" }} />
              <button onClick={() => donateAmount && setDonated(true)} style={{
                width: "100%", padding: 14, borderRadius: 14, border: "none", fontFamily: "inherit",
                background: donateAmount ? "linear-gradient(135deg, #D85A30, #EF9F27)" : "#E0D8D0",
                color: donateAmount ? "#fff" : "#A09080", fontSize: 16, fontWeight: 700, cursor: donateAmount ? "pointer" : "default",
              }}>
                {donateAmount ? `Donar Bs ${donateAmount}` : "Selecciona un monto"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  function ReportModalView() {
    if (!reportModal) return null;
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        onClick={() => setReportModal(false)}>
        <div style={{ background: "#FFFBF5", borderRadius: "24px 24px 0 0", padding: "24px 20px 32px", width: "100%", maxWidth: 480, animation: "slideUp 0.3s ease" }}
          onClick={e => e.stopPropagation()}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#3A2A1A", margin: "0 0 16px" }}>Reportar mascota perdida</h3>
          {["Nombre de la mascota", "Tipo (perro, gato, otro)", "Última ubicación", "Tu número de contacto"].map(label => (
            <div key={label} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#8A7A6A", marginBottom: 4, display: "block" }}>{label}</label>
              <input type="text" style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid #F0E6D9", fontSize: 14, background: "#FFFBF5", color: "#3A2A1A", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
          ))}
          <label style={{ fontSize: 12, fontWeight: 600, color: "#8A7A6A", marginBottom: 4, display: "block" }}>Descripción</label>
          <textarea rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid #F0E6D9", fontSize: 14, background: "#FFFBF5", color: "#3A2A1A", outline: "none", resize: "none", marginBottom: 16, boxSizing: "border-box", fontFamily: "inherit" }} />
          <button onClick={() => setReportModal(false)} style={{
            width: "100%", padding: 14, borderRadius: 14, border: "none", fontFamily: "inherit",
            background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
          }}>Publicar reporte</button>
        </div>
      </div>
    );
  }

  function AiChatView() {
    if (!aiChat) return null;
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        onClick={() => setAiChat(false)}>
        <div style={{ background: "#FFFBF5", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, height: "70%", display: "flex", flexDirection: "column", animation: "slideUp 0.3s ease" }}
          onClick={e => e.stopPropagation()}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0E6D9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#3A2A1A" }}>✧ Zoe AI</div>
              <div style={{ fontSize: 11, color: "#A09080" }}>Asistente inteligente de adopción</div>
            </div>
            <button onClick={() => setAiChat(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#A09080", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {aiMessages.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🐾</div>
                <p style={{ fontSize: 14, color: "#8A7A6A", lineHeight: 1.5 }}>¡Hola! Soy Zoe AI. Puedo ayudarte a encontrar la mascota ideal para adoptar, darte info sobre casos urgentes, o responder cualquier duda.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                  {["¿Qué mascota me recomiendas para depto?", "¿Cómo puedo ayudar a Luna?", "Quiero adoptar un perro cariñoso"].map(q => (
                    <button key={q} onClick={() => { setAiInput(q); }} style={{
                      padding: "10px 16px", borderRadius: 12, border: "1px solid #F0E6D9", background: "#FFF8F0",
                      color: "#D85A30", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                    }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {aiMessages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: 16, fontSize: 14, lineHeight: 1.5,
                  background: m.role === "user" ? "linear-gradient(135deg, #D85A30, #EF9F27)" : "#FFF8F0",
                  color: m.role === "user" ? "#fff" : "#3A2A1A",
                  borderBottomRightRadius: m.role === "user" ? 4 : 16,
                  borderBottomLeftRadius: m.role === "user" ? 16 : 4,
                }}>{m.text}</div>
              </div>
            ))}
            {aiLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: 16, background: "#FFF8F0", color: "#A09080", fontSize: 14, borderBottomLeftRadius: 4 }}>
                  Pensando...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #F0E6D9", display: "flex", gap: 8 }}>
            <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Pregúntale a Zoe AI..."
              onKeyDown={e => e.key === "Enter" && handleAiSend()}
              style={{ flex: 1, padding: "10px 14px", borderRadius: 14, border: "1px solid #F0E6D9", fontSize: 14, background: "#FFFBF5", color: "#3A2A1A", outline: "none", fontFamily: "inherit" }} />
            <button onClick={handleAiSend} style={{
              padding: "10px 16px", borderRadius: 14, border: "none", fontFamily: "inherit",
              background: "linear-gradient(135deg, #D85A30, #EF9F27)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>→</button>
          </div>
        </div>
      </div>
    );
  }

  function renderContent() {
    if (selectedPet) {
      if (selectedPet.section === "urgencia") return <PetDetailUrgencia pet={selectedPet} />;
      if (selectedPet.section === "perdido") return <PetDetailPerdido pet={selectedPet} />;
      if (selectedPet.section === "adopcion") return <PetDetailAdopcion pet={selectedPet} />;
    }
    if (section === "feed") return <FeedSection />;
    if (section === "urgencias") return <UrgenciasSection />;
    if (section === "perdidos") return <PerdidosSection />;
    if (section === "adopciones") return <AdopcionesSection />;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif", background: "#FFF9F2", maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 60px rgba(216,90,48,0.08)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400&family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; }
        input::placeholder, textarea::placeholder { color: #BEB0A0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #E0D8D0; border-radius: 2px; }
      `}</style>
      <Header />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {renderContent()}
      </div>
      <NavBar />
      <DonateModalView />
      <ReportModalView />
      <AiChatView />
    </div>
  );
}

export default ZoeApp;

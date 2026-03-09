import { useState, useEffect, useRef } from "react";
// ─── Supabase ──────────────────────────────────────────────────────────────
const URL_SB  = "https://wagvhfvgowxffqyveiie.supabase.co";
const KEY_SB  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZ3ZoZnZnb3d4ZmZxeXZlaWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzQ4MjksImV4cCI6MjA4NzgxMDgyOX0.Dz270J_RsZxCd6vyPOkKesxW2aTBFRh69WoCrI2HXm8";
const H = { apikey: KEY_SB, Authorization: `Bearer ${KEY_SB}` };
async function sbGet(path: string) {
  const r = await fetch(`${URL_SB}/rest/v1/${path}`, { headers: H });
  if (!r.ok) throw new Error("Error Supabase");
  return r.json();
}
// ─── Helpers ───────────────────────────────────────────────────────────────
function shuffle(arr: any[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const FALLBACK_QUESTIONS = [
  { question: "¿Tu jefe sabe exactamente en qué estás trabajando ahora mismo?", emoji: "🧠", category: "jefe" },
  { question: "¿Tus compañeros acuden a ti cuando necesitan ayuda?", emoji: "🙋", category: "equipo" },
  { question: "¿Puedes admitir que no sabes algo frente a tu jefe sin sentirte mal?", emoji: "🤔", category: "jefe" },
  { question: "¿Conoces algo personal de cada persona con quien trabajas?", emoji: "🫶", category: "equipo" },
  { question: "Si calificaras tu energía en el trabajo hoy, ¿qué número le darías?", emoji: "🌡️", category: "vibe" },
  { question: "Tu jefe llega sin avisar. ¿Qué sientes primero?", emoji: "😅", category: "vibe" },
  { question: "¿Has reconocido el trabajo de un compañero en público?", emoji: "📣", category: "equipo" },
  { question: "Cuando hay tensión en el equipo, ¿formas parte del problema o de la solución?", emoji: "🔥", category: "equipo" },
  { question: "¿Le has pedido feedback a tu jefe por iniciativa propia?", emoji: "📈", category: "jefe" },
  { question: "Alguien se lleva el crédito de tu idea. ¿Cómo lo manejas?", emoji: "😤", category: "vibe" },
];
const catConfig: any = {
  jefe:   { label: "JEFE",   bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.3)", color: "#a78bfa" },
  equipo: { label: "EQUIPO", bg: "rgba(110,231,183,0.15)", border: "rgba(110,231,183,0.3)", color: "#6ee7b7" },
  vibe:   { label: "VIBE",   bg: "rgba(255,122,0,0.15)",   border: "rgba(255,122,0,0.3)",   color: "#FF7A00" },
};
// ─── Journey data — 4 stages ───────────────────────────────────────────────
const JOURNEY = [
  {
    key: "extrano", semana: "Semana 1–2", titulo: "El Extraño", icon: "👤",
    quote: "¿Quién es ese?", sub: "Nadie sabe todavía quién sos ni para qué servís.",
    confianza: 10, likeability: 10, accentColor: "#FF3C6E", bgColor: "#1A0810", borderColor: "#FF3C6E33",
    mision: "Tu única misión: ser visible sin ser ruidoso.",
    dale_u: ["Desautomatizar", "Momento", "Energía"],
    tips: [
      { icon: "👁️", t: "Confianza", v: "Llega puntual. Siempre.", sub: "La puntualidad es la primera promesa que hacés." },
      { icon: "❤️", t: "Likeable",  v: "Aprendete los nombres.", sub: "Una persona que recuerda tu nombre te cae bien sin razón." },
      { icon: "🗣️", t: "Actitud",   v: "Escuchá más, hablá menos.", sub: "El que llega nuevo y ya opina de todo incomoda al equipo." },
    ],
  },
  {
    key: "nuevo", semana: "Semana 3 – Mes 1", titulo: "El Nuevo", icon: "🌱",
    quote: "Ah, sí. El nuevo.", sub: "Ya te ubican. Pero todavía no saben si podés contar con vos.",
    confianza: 30, likeability: 40, accentColor: "#FF7A00", bgColor: "#1A1000", borderColor: "#FF7A0033",
    mision: "Tu misión: que tu nombre aparezca cuando alguien dice 'lo hizo bien'.",
    dale_u: ["Vale!", "Chef", "Bien"],
    tips: [
      { icon: "👁️", t: "Confianza", v: "Hacé lo que dijiste que ibas a hacer.", sub: "Un compromiso cumplido vale diez cumplidos en una reunión." },
      { icon: "❤️", t: "Likeable",  v: "Pedí feedback antes de entregar.", sub: "El que pide feedback antes de entregar parece seguro, no inseguro." },
      { icon: "🗣️", t: "Actitud",   v: "Revisá todo lo que entregás.", sub: "Entregá como si tu firma estuviera en cada tarea." },
    ],
  },
  {
    key: "companero", semana: "Mes 2", titulo: "El Compañero", icon: "🤝",
    quote: "Sí, es parte del equipo.", sub: "Ya confían en vos para cosas concretas. Empezás a ser incluido.",
    confianza: 60, likeability: 65, accentColor: "#F5FF00", bgColor: "#151500", borderColor: "#F5FF0033",
    mision: "Tu misión: ser la persona que suma, no la que complica.",
    dale_u: ["5,4,3,2,1", "Cambio", "Matemáticas"],
    tips: [
      { icon: "👁️", t: "Confianza", v: "Proponé ideas sin miedo a que digan no.", sub: "De 10 ideas, si una sola vuela, te van a invitar a más reuniones." },
      { icon: "❤️", t: "Likeable",  v: "Levantá el trabajo de otros en voz alta.", sub: "La persona que celebra a otros siempre es bien recibida." },
      { icon: "🗣️", t: "Actitud",   v: "Aparecé en los almuerzos, celebraciones, invitaciones.", sub: "La conexión informal construye más confianza que 10 reuniones formales." },
    ],
  },
  {
    key: "referido", semana: "Mes 3", titulo: "El Referido", icon: "⭐",
    quote: "Quiero trabajar con él/ella.", sub: "Te buscan a vos. Te mencionan cuando no estás. Sos referencia.",
    confianza: 90, likeability: 88, accentColor: "#00FF88", bgColor: "#001510", borderColor: "#00FF8833",
    mision: "Tu misión: ser sujeto, no objeto. Actuás sin que te empujen.",
    dale_u: ["Máximizar", "Sujétate", "Mio"],
    tips: [
      { icon: "👁️", t: "Confianza", v: "Cuando algo falla, aparecé con solución.", sub: "El que señala la falla y aparece con la solución se convierte en líder." },
      { icon: "❤️", t: "Referible", v: "Otras personas te mencionan cuando hay oportunidades.", sub: "No se llega aquí siendo simpático. Se llega siendo confiable Y simpático." },
      { icon: "🗣️", t: "Actitud",   v: "Sos la persona que hace que el equipo funcione mejor.", sub: "No esperás que te pidan, ves lo que falta y lo hacés." },
    ],
  },
];
// ─── Score helper ──────────────────────────────────────────────────────────
function getScore(pct: number) {
  if (pct >= 80) return { label:"BRILLANDO", icon:"🔥", sub:"Sos exactamente la persona que todos quieren en su equipo.", accent:"#F5FF00" };
  if (pct >= 60) return { label:"SÓLIDO",    icon:"💪", sub:"Buena energía. Con algunos ajustes, sos imparable.",      accent:"#FFB800" };
  if (pct >= 40) return { label:"REGULAR",   icon:"😐", sub:"Está pasable. Hora de subir el nivel.",                   accent:"#FF7A00" };
  return           { label:"ALERTA",     icon:"🚩", sub:"Sin juzgar — pero tenemos que hablar.",                  accent:"#FF3333" };
}
// ─── Mini Components ────────────────────────────────────────────────────────
function Tag({ children, color = "#F5FF00", textColor = "#0D0D0D" }: any) {
  return (
    <span style={{
      display:"inline-block", background: color, color: textColor,
      fontFamily:"'Archivo Black',sans-serif", fontSize:"0.58rem",
      letterSpacing:"0.18em", padding:"0.22rem 0.6rem", borderRadius:"4px",
      textTransform:"uppercase", flexShrink:0,
    }}>{children}</span>
  );
}
function BarMeter({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ background:"#1A1A1A", borderRadius:"999px", height:"6px", overflow:"hidden", width:"100%" }}>
      <div style={{
        height:"100%", width:`${value}%`, background: color,
        borderRadius:"999px", transition:"width 1s cubic-bezier(0.22,1,0.36,1)",
        boxShadow:`0 0 8px ${color}66`,
      }}/>
    </div>
  );
}
// ─── DALE LA VUELTA screen ─────────────────────────────────────────────────
function DalaVueltaScreen({ onBack, etapasDB }: { onBack: () => void; etapasDB: any }) {
  const [etapaActiva, setEtapaActiva] = useState(0);
  const [tabActivo, setTabActivo] = useState("tips");
  const etapa = JOURNEY[etapaActiva];
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsDB = etapasDB[etapa.key] || [];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"1.4rem 1.6rem 0", flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:"#333", fontSize:"0.8rem", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.1em", cursor:"pointer" }}>← VOLVER</button>
          <Tag color="#F5FF00">DALE LA VUELTA</Tag>
        </div>
        <div style={{ marginBottom:"1rem" }}>
          <h2 style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"2.1rem", color:"#F0F0F0", lineHeight:0.95, letterSpacing:"-0.02em" }}>
            DE EXTRAÑO<br /><span style={{ color:"#F5FF00" }}>A REFERIDO</span><br /><span style={{ fontSize:"1.1rem", color:"#333" }}>EN 3 MESES.</span>
          </h2>
        </div>
        <div style={{ display:"flex", gap:"0.4rem", overflowX:"auto", paddingBottom:"0.6rem", scrollbarWidth:"none", marginBottom:"0.2rem" }}>
          {JOURNEY.map((e, i) => (
            <button key={e.key} onClick={() => setEtapaActiva(i)} style={{
              flexShrink:0, background: etapaActiva===i ? e.accentColor : "#161616",
              border:`1.5px solid ${etapaActiva===i ? e.accentColor : "#222"}`,
              borderRadius:"10px", padding:"0.5rem 0.9rem", cursor:"pointer", transition:"all 0.18s",
            }}>
              <div style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"0.65rem", color: etapaActiva===i ? "#0D0D0D" : "#555", letterSpacing:"0.08em", whiteSpace:"nowrap" }}>
                {e.icon} {e.titulo.toUpperCase()}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div ref={scrollRef} style={{ flex:1, overflowY:"auto", padding:"0 1.6rem 1.6rem", scrollbarWidth:"none" }}>
        <div style={{ background: etapa.bgColor, border:`1.5px solid ${etapa.borderColor}`, borderRadius:"20px", padding:"1.5rem", marginBottom:"1rem", marginTop:"0.8rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
            <div>
              <div style={{ fontSize:"0.62rem", color:"#444", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.15em", marginBottom:"0.3rem" }}>{etapa.semana}</div>
              <div style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"1.6rem", color:"#F0F0F0", lineHeight:1 }}>{etapa.titulo}</div>
            </div>
            <div style={{ fontSize:"2.8rem", lineHeight:1 }}>{etapa.icon}</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"0.8rem 1rem", marginBottom:"1rem" }}>
            <div style={{ color: etapa.accentColor, fontFamily:"'Archivo Black',sans-serif", fontSize:"0.95rem", marginBottom:"0.2rem" }}>"{etapa.quote}"</div>
            <div style={{ color:"#555", fontSize:"0.78rem", lineHeight:1.5 }}>{etapa.sub}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
                <span style={{ color:"#444", fontSize:"0.65rem", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.1em" }}>👁️ CONFIANZA</span>
                <span style={{ color: etapa.accentColor, fontSize:"0.65rem", fontFamily:"'Archivo Black',sans-serif" }}>{etapa.confianza}%</span>
              </div>
              <BarMeter value={etapa.confianza} color={etapa.accentColor} />
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
                <span style={{ color:"#444", fontSize:"0.65rem", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.1em" }}>❤️ LIKEABILITY</span>
                <span style={{ color: etapa.accentColor, fontSize:"0.65rem", fontFamily:"'Archivo Black',sans-serif" }}>{etapa.likeability}%</span>
              </div>
              <BarMeter value={etapa.likeability} color={etapa.accentColor} />
            </div>
          </div>
          <div style={{ marginTop:"1rem", paddingTop:"0.8rem", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize:"0.62rem", color:"#333", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.12em", marginBottom:"0.3rem" }}>TU MISIÓN</div>
            <div style={{ color:"#ccc", fontSize:"0.82rem", lineHeight:1.5 }}>{etapa.mision}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"0.4rem", marginBottom:"0.8rem" }}>
          {[["tips","CÓMO LOGRARLO"],["dale_u","DALE LA U"]].map(([k, l]) => (
            <button key={k} onClick={() => setTabActivo(k)} style={{
              flex:1, background: tabActivo===k ? "#F5FF00" : "transparent",
              border:`1.5px solid ${tabActivo===k ? "#F5FF00" : "#1E1E1E"}`,
              borderRadius:"10px", padding:"0.5rem", fontFamily:"'Archivo Black',sans-serif", fontSize:"0.6rem",
              color: tabActivo===k ? "#0D0D0D" : "#444", letterSpacing:"0.08em", cursor:"pointer", transition:"all 0.15s",
            }}>{l}</button>
          ))}
        </div>
        {tabActivo === "tips" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
            {etapa.tips.map((tip, i) => (
              <div key={i} style={{ background:"#161616", border:"1px solid #1E1E1E", borderRadius:"14px", padding:"1rem 1.1rem" }}>
                <div style={{ display:"flex", gap:"0.6rem", alignItems:"flex-start" }}>
                  <span style={{ fontSize:"1.3rem", lineHeight:1, flexShrink:0 }}>{tip.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.3rem" }}><Tag color={etapa.accentColor}>{tip.t}</Tag></div>
                    <div style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"0.9rem", color:"#F0F0F0", marginBottom:"0.3rem", lineHeight:1.2 }}>{tip.v}</div>
                    <div style={{ color:"#444", fontSize:"0.75rem", lineHeight:1.5 }}>{tip.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tabActivo === "dale_u" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
            {itemsDB.length > 0 ? itemsDB.map((item: any, i: number) => (
              <div key={i} style={{ background:"#161616", border:`1px solid ${etapa.borderColor}`, borderRadius:"14px", padding:"1rem 1.1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
                  <Tag color={etapa.accentColor}>{item.title}</Tag>
                  <span style={{ color:"#222", fontSize:"0.6rem", fontFamily:"'Archivo Black',sans-serif" }}>DALE LA U</span>
                </div>
                <p style={{ color:"#999", fontSize:"0.8rem", lineHeight:1.6 }}>{item.description}</p>
              </div>
            )) : etapa.dale_u.map((k, i) => (
              <div key={i} style={{ background:"#161616", border:`1px solid ${etapa.borderColor}`, borderRadius:"14px", padding:"1rem 1.1rem" }}>
                <Tag color={etapa.accentColor}>{k}</Tag>
                <p style={{ color:"#555", fontSize:"0.78rem", marginTop:"0.5rem" }}>Cargando consejo...</p>
              </div>
            ))}
            <div style={{ background:"transparent", border:"1px dashed #1E1E1E", borderRadius:"12px", padding:"0.9rem", textAlign:"center", marginTop:"0.4rem" }}>
              <div style={{ color:"#333", fontSize:"0.65rem", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.12em" }}>METODOLOGÍA · INSTITUTO I3</div>
              <div style={{ color:"#222", fontSize:"0.68rem", marginTop:"0.3rem" }}>Dale la U — Inclusión · Inflexión · Impacto</div>
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:"0.6rem", marginTop:"1rem" }}>
          <button onClick={() => setEtapaActiva(p => Math.max(0, p-1))} disabled={etapaActiva === 0}
            style={{ flex:1, background:"transparent", border:`1px solid ${etapaActiva===0 ? "#161616" : "#222"}`, borderRadius:"12px", padding:"0.75rem", fontFamily:"'Archivo Black',sans-serif", fontSize:"0.7rem", color: etapaActiva===0 ? "#1E1E1E" : "#444", letterSpacing:"0.08em", cursor: etapaActiva===0 ? "default" : "pointer", transition:"all 0.15s" }}>← ANTERIOR</button>
          <button onClick={() => setEtapaActiva(p => Math.min(JOURNEY.length-1, p+1))} disabled={etapaActiva === JOURNEY.length-1}
            style={{ flex:1, background: etapaActiva===JOURNEY.length-1 ? "transparent" : etapa.accentColor, border:`1px solid ${etapaActiva===JOURNEY.length-1 ? "#161616" : etapa.accentColor}`, borderRadius:"12px", padding:"0.75rem", fontFamily:"'Archivo Black',sans-serif", fontSize:"0.7rem", color: etapaActiva===JOURNEY.length-1 ? "#1E1E1E" : "#0D0D0D", letterSpacing:"0.08em", cursor: etapaActiva===JOURNEY.length-1 ? "default" : "pointer", transition:"all 0.15s", boxShadow: etapaActiva===JOURNEY.length-1 ? "none" : `0 4px 16px ${etapa.accentColor}33` }}>SIGUIENTE →</button>
        </div>
      </div>
    </div>
  );
}
// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function RelacionAt() {
  const [pantalla, setPantalla] = useState("inicio");
  const [modo, setModo] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<{ jefe: any[]; equipo: any[]; vibe: any[] }>({ jefe:[], equipo:[], vibe:[] });
  const [etapasDB, setEtapasDB] = useState<any>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [vibeIdx, setVibeIdx] = useState(0);
  const [slide, setSlide] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  // Home checkin question state
  const [homeQuestions, setHomeQuestions] = useState<any[]>([]);
  const [homeQIdx, setHomeQIdx] = useState(0);
  const [homeAnimOut, setHomeAnimOut] = useState(false);
  const [homeAnswered, setHomeAnswered] = useState<string | null>(null);
  const [homeShowAnswer, setHomeShowAnswer] = useState(false);

  useEffect(() => {
    Promise.all([
      sbGet("checkin_questions?select=id,question,emoji,category,sort_order&archived_at=is.null&order=sort_order.asc"),
      sbGet("coaching_items?select=id,title,description,sort_order,section_id,coaching_sections(title,category_id,coaching_categories(slug))&order=sort_order.asc"),
    ]).then(([qs, items]) => {
      setPreguntas({
        jefe:   qs.filter((q: any) => q.category === "jefe"),
        equipo: qs.filter((q: any) => q.category === "equipo"),
        vibe:   qs.filter((q: any) => q.category === "vibe"),
      });
      if (qs && qs.length > 0) setHomeQuestions(shuffle(qs));
      else setHomeQuestions(shuffle(FALLBACK_QUESTIONS));
      const map: any = {};
      const titleToKey: any = { "El Extraño":"extrano","El Nuevo":"nuevo","El Compañero":"companero","El Referido":"referido" };
      items.forEach((item: any) => {
        const sTitle = item.coaching_sections?.title;
        const k = titleToKey[sTitle];
        if (k) { if (!map[k]) map[k]=[]; map[k].push(item); }
      });
      setEtapasDB(map);
      setCargando(false);
    }).catch((e: any) => {
      setError(e.message);
      setHomeQuestions(shuffle(FALLBACK_QUESTIONS));
      setCargando(false);
    });
  }, []);

  const lista = modo ? (preguntas as any)[modo] : [];
  const pregActual = lista[indice];
  const pregVibe = preguntas.vibe[vibeIdx % Math.max(preguntas.vibe.length,1)];
  const responder = (si: boolean) => {
    setSlide(si ? "r" : "l");
    setTimeout(() => {
      const next = [...respuestas, si ? 1 : 0];
      setRespuestas(next);
      if (indice + 1 >= lista.length) { setPantalla("resultado"); }
      else { setIndice(i => i+1); }
      setSlide("in");
      setTimeout(() => setSlide(null), 280);
    }, 240);
  };
  const nextVibe = () => {
    setVisible(false);
    setTimeout(() => { setVibeIdx(v => v+1); setVisible(true); }, 260);
  };
  const reiniciar = () => {
    setPantalla("inicio"); setModo(null); setIndice(0);
    setRespuestas([]); setSlide(null); setVisible(true);
  };
  const pct = respuestas.length ? Math.round(respuestas.reduce((a,b)=>a+b,0) / respuestas.length * 100) : 0;
  const scoreInfo = getScore(pct);
  const cardX = ({ r:"translateX(110%) rotate(6deg)", l:"translateX(-110%) rotate(-6deg)", in:"translateX(0) scale(0.96)" } as any)[slide as string] || "none";

  // Home checkin helpers
  const homeQ = homeQuestions[homeQIdx % Math.max(homeQuestions.length, 1)];
  const homeCat = homeQ ? (catConfig[homeQ.category] || catConfig.vibe) : catConfig.vibe;
  const homeNext = (ans: string) => {
    if (homeAnimOut) return;
    setHomeAnswered(ans);
    setHomeShowAnswer(true);
    setTimeout(() => {
      setHomeAnimOut(true);
      setTimeout(() => {
        setHomeQIdx(i => i + 1);
        setHomeAnimOut(false);
        setHomeAnswered(null);
        setHomeShowAnswer(false);
      }, 260);
    }, 600);
  };
  const homeSkip = () => {
    if (homeAnimOut) return;
    setHomeAnimOut(true);
    setTimeout(() => {
      setHomeQIdx(i => i + 1);
      setHomeAnimOut(false);
    }, 220);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0D0D0D;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes fadeOut{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-16px)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        @keyframes slideRight{from{opacity:1;transform:none}to{opacity:0;transform:translateX(80px) rotate(4deg)}}
        @keyframes slideLeft{from{opacity:1;transform:none}to{opacity:0;transform:translateX(-80px) rotate(-4deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes popBounce{0%{transform:scale(1)}40%{transform:scale(1.06)}70%{transform:scale(0.97)}100%{transform:scale(1)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.35}}
        .fu{animation:fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;}
        .fu2{animation:fadeUp 0.45s .08s cubic-bezier(0.22,1,0.36,1) both;}
        .fu3{animation:fadeUp 0.45s .16s cubic-bezier(0.22,1,0.36,1) both;}
        .fu4{animation:fadeUp 0.45s .24s cubic-bezier(0.22,1,0.36,1) both;}
        .q-card-in{animation:slideIn 0.32s cubic-bezier(0.22,1,0.36,1) both;}
        .q-card-out-r{animation:slideRight 0.24s ease-in both;}
        .q-card-out-l{animation:slideLeft 0.24s ease-in both;}
        .q-card-out{animation:fadeOut 0.22s ease-in both;}
        .pulse{animation:pulse 2s infinite;}
        .pop{animation:popBounce 0.35s ease both;}
        .popIn{animation:popIn 0.42s cubic-bezier(0.34,1.56,0.64,1) both;}
        .blink{animation:blink 2s infinite;}
        .btn-ruta{transition:transform .15s,box-shadow .15s;}
        .btn-ruta:hover{transform:scale(1.02)!important;box-shadow:0 8px 36px rgba(245,255,0,0.42)!important;}
        .btn-card:hover{border-color:#2a2a2a!important;}
        .btn-ans:hover{filter:brightness(1.12);transform:scale(1.03);}
        .btn-skip:hover{border-color:#2a2a2a!important;color:#555!important;}
        ::-webkit-scrollbar{display:none;}
        button{cursor:pointer;outline:none;}
      `}</style>
      <div style={{
        minHeight:"100vh", background:"#0D0D0D",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"1rem", fontFamily:"'Plus Jakarta Sans',sans-serif",
      }}>
        <div style={{
          width:"100%", maxWidth:"390px",
          background:"#111", borderRadius:"28px",
          border:"1px solid #1E1E1E",
          boxShadow:"0 24px 64px rgba(0,0,0,0.85)",
          display:"flex", flexDirection:"column",
          overflow:"hidden",
        }}>
          {/* Accent stripe */}
          <div style={{ height:"3px", background:"linear-gradient(90deg,#F5FF00,#FF7A00,#FF3C6E,#F5FF00)", flexShrink:0 }}/>

          {/* ── LOADING ── */}
          {cargando && (
            <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",minHeight:"760px" }}>
              <div style={{ fontSize:"2.5rem" }} className="blink">🔄</div>
              <div style={{ color:"#333",fontSize:"0.72rem",fontFamily:"'Archivo Black',sans-serif",letterSpacing:"0.2em" }}>CARGANDO...</div>
            </div>
          )}

          {/* ── ERROR ── */}
          {error && !cargando && (
            <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",gap:"1rem",textAlign:"center",minHeight:"760px" }}>
              <div style={{ fontSize:"2rem" }}>⚠️</div>
              <div style={{ color:"#FF3333",fontFamily:"'Archivo Black',sans-serif" }}>Error de conexión</div>
              <div style={{ color:"#444",fontSize:"0.8rem" }}>{error}</div>
            </div>
          )}

          {/* ── DALE LA VUELTA ── */}
          {!cargando && !error && pantalla === "ruta" && (
            <DalaVueltaScreen onBack={() => setPantalla("inicio")} etapasDB={etapasDB} />
          )}

          {/* ══════════════════════════════════════════
              ── NEW HOME / INICIO ──
          ══════════════════════════════════════════ */}
          {!cargando && !error && pantalla === "inicio" && (
            <>
              {/* HOME SECTION */}
              <div style={{ padding:"2rem 1.6rem 1.4rem" }}>
                <div className="fu" style={{ marginBottom:"1.6rem" }}>
                  <span style={{
                    display:"inline-block", background:"#F5FF00", color:"#0D0D0D",
                    fontFamily:"'Archivo Black',sans-serif", fontSize:"0.58rem",
                    letterSpacing:"0.18em", padding:"0.22rem 0.6rem",
                    borderRadius:"4px", textTransform:"uppercase",
                  }}>relacion.at</span>
                  <h1 style={{
                    fontFamily:"'Archivo Black',sans-serif", fontSize:"2.8rem",
                    color:"#F0F0F0", lineHeight:0.93,
                    letterSpacing:"-0.03em", marginTop:"0.8rem",
                  }}>
                    ¿CÓMO<br/><span style={{ color:"#F5FF00" }}>ESTÁS</span><br/>CON ELLOS?
                  </h1>
                  <p style={{ color:"#444", fontSize:"0.85rem", lineHeight:1.65, marginTop:"0.7rem", maxWidth:"260px" }}>
                    Descubrí cómo van tus relaciones laborales. Sin filtros. Sin consejos genéricos.
                  </p>
                </div>
                {/* Action Buttons */}
                <div className="fu2" style={{ display:"flex", flexDirection:"column", gap:"0.6rem", marginBottom:"1rem" }}>
                  <button className="btn-ruta" onClick={() => setPantalla("ruta")} style={{
                    background:"#F5FF00", border:"none", borderRadius:"14px",
                    padding:"1.2rem 1.4rem", textAlign:"left",
                    boxShadow:"0 4px 24px rgba(245,255,0,0.22)",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.25rem" }}>
                      <span style={{ fontSize:"1.1rem" }}>🔄</span>
                      <span style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"1rem", color:"#0D0D0D" }}>DALE LA VUELTA</span>
                    </div>
                    <div style={{ fontSize:"0.76rem", color:"#555" }}>De extraño a referido en 3 meses — la ruta</div>
                  </button>
                  <div style={{ display:"flex", gap:"0.6rem" }}>
                    <button className="btn-card" onClick={() => setPantalla("modo")} style={{
                      flex:1, background:"transparent", border:"1.5px solid #1E1E1E",
                      borderRadius:"14px", padding:"1rem", textAlign:"left", transition:"border-color .15s",
                    }}>
                      <div style={{ fontSize:"1.1rem", marginBottom:"0.3rem" }}>📊</div>
                      <div style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"0.85rem", color:"#F0F0F0" }}>MI PUNTAJE</div>
                      <div style={{ fontSize:"0.7rem", color:"#444", marginTop:"0.15rem" }}>Jefe · Equipo</div>
                    </button>
                    <button className="btn-card" onClick={() => { setPantalla("vibe"); setVibeIdx(0); }} style={{
                      flex:1, background:"transparent", border:"1.5px solid #1E1E1E",
                      borderRadius:"14px", padding:"1rem", textAlign:"left", transition:"border-color .15s",
                    }}>
                      <div style={{ fontSize:"1.1rem", marginBottom:"0.3rem" }}>🎲</div>
                      <div style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"0.85rem", color:"#F0F0F0" }}>EXPLORAR</div>
                      <div style={{ fontSize:"0.7rem", color:"#444", marginTop:"0.15rem" }}>Sin presión</div>
                    </button>
                  </div>
                </div>
                {/* Stats strip */}
                <div className="fu3" style={{ display:"flex", borderRadius:"12px", border:"1px solid #1E1E1E", overflow:"hidden" }}>
                  {[
                    { n: preguntas.jefe.length || "7", label: "Jefe", color: "#a78bfa" },
                    { n: preguntas.equipo.length || "7", label: "Equipo", color: "#6ee7b7" },
                    { n: "3", label: "Meses", color: "#F5FF00" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      flex:1, padding:"0.75rem 0", textAlign:"center",
                      borderRight: i < 2 ? "1px solid #1E1E1E" : "none",
                    }}>
                      <div style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"1.3rem", color: s.color }}>{s.n}</div>
                      <div style={{ fontSize:"0.6rem", color:"#2A2A2A", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.12em", textTransform:"uppercase" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIVIDER */}
              <div style={{ padding:"0 1.6rem" }}>
                <div style={{ height:"1px", background:"#1A1A1A" }} />
              </div>

              {/* CHECKIN — PREGUNTA DEL MOMENTO */}
              <div className="fu4" style={{ padding:"1.4rem 1.6rem 2rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                    <span style={{ fontSize:"0.95rem" }}>✍️</span>
                    <div>
                      <div style={{ fontFamily:"'Archivo Black',sans-serif", fontSize:"0.72rem", color:"#F0F0F0", letterSpacing:"0.08em" }}>PREGUNTA DEL MOMENTO</div>
                      <div style={{ fontSize:"0.62rem", color:"#2A2A2A", marginTop:"1px" }}>Respondé con honestidad</div>
                    </div>
                  </div>
                  <button onClick={homeSkip} className="btn-skip" style={{
                    background:"none", border:"1px solid #1E1E1E", borderRadius:"8px", padding:"0.28rem 0.65rem",
                    fontSize:"0.62rem", color:"#333", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.08em",
                    transition:"border-color .15s, color .15s",
                  }}>SALTAR →</button>
                </div>
                {/* Question card */}
                {homeQ && (
                  <div
                    className={
                      homeAnimOut
                        ? (homeAnswered === "si" ? "q-card-out-r" : homeAnswered === "no" ? "q-card-out-l" : "q-card-out")
                        : "q-card-in"
                    }
                    style={{
                      background:"#161616",
                      border:`1.5px solid ${homeShowAnswer
                        ? homeAnswered === "si" ? "rgba(245,255,0,0.35)" : "rgba(255,60,110,0.35)"
                        : "#1E1E1E"}`,
                      borderRadius:"20px", padding:"1.6rem 1.4rem 1.4rem",
                      marginBottom:"0.9rem", transition:"border-color .2s",
                      position:"relative", overflow:"hidden",
                    }}>
                    {homeShowAnswer && (
                      <div style={{
                        position:"absolute", inset:0, borderRadius:"20px", pointerEvents:"none",
                        background: homeAnswered === "si"
                          ? "linear-gradient(135deg,rgba(245,255,0,0.04),transparent)"
                          : "linear-gradient(135deg,rgba(255,60,110,0.04),transparent)",
                      }} />
                    )}
                    <span style={{
                      display:"inline-flex", alignItems:"center", gap:"0.3rem",
                      background: homeCat.bg, border:`1px solid ${homeCat.border}`,
                      borderRadius:"6px", padding:"0.2rem 0.6rem",
                      fontFamily:"'Archivo Black',sans-serif", fontSize:"0.56rem",
                      letterSpacing:"0.12em", color: homeCat.color, marginBottom:"1rem",
                    }}>{homeCat.label}</span>
                    <div style={{ textAlign:"center", padding:"0.4rem 0 1rem" }}>
                      <div style={{ fontSize:"2.8rem", marginBottom:"0.9rem", lineHeight:1 }}>{homeQ.emoji}</div>
                      <p style={{
                        fontFamily:"'Archivo Black',sans-serif", fontSize:"1.05rem", color:"#F0F0F0",
                        lineHeight:1.3, letterSpacing:"-0.01em",
                      }}>{homeQ.question}</p>
                    </div>
                    {homeShowAnswer && (
                      <div className="pop" style={{
                        textAlign:"center", paddingTop:"0.3rem", fontSize:"0.75rem",
                        fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.1em",
                        color: homeAnswered === "si" ? "#F5FF00" : "#FF3C6E",
                      }}>
                        {homeAnswered === "si" ? "✓ SÍ — SIGUIENTE" : "✗ NO — SIGUIENTE"}
                      </div>
                    )}
                  </div>
                )}
                {/* Yes / No buttons */}
                {!homeShowAnswer && (
                  <div style={{ display:"flex", gap:"0.6rem" }}>
                    {[
                      { label:"😬  NO", ans:"no", bg:"#1A0A0A", border:"rgba(255,60,110,0.2)", color:"#FF3C6E", hBg:"rgba(255,60,110,0.1)", hBorder:"#FF3C6E" },
                      { label:"✅  SÍ", ans:"si", bg:"#0D1A0D", border:"rgba(245,255,0,0.2)", color:"#F5FF00", hBg:"rgba(245,255,0,0.08)", hBorder:"#F5FF00" },
                    ].map(b => (
                      <button key={b.ans} className="btn-ans" onClick={() => homeNext(b.ans)} style={{
                        flex:1, background:b.bg, border:`1.5px solid ${b.border}`,
                        borderRadius:"14px", padding:"0.95rem",
                        fontFamily:"'Archivo Black',sans-serif", fontSize:"0.88rem",
                        color:b.color, transition:"all .15s",
                      }}
                        onMouseOver={(e: any) => { e.currentTarget.style.background=b.hBg; e.currentTarget.style.borderColor=b.hBorder; }}
                        onMouseOut={(e: any) =>  { e.currentTarget.style.background=b.bg;  e.currentTarget.style.borderColor=b.border; }}
                      >{b.label}</button>
                    ))}
                  </div>
                )}
                {/* Progress dots */}
                <div style={{ display:"flex", justifyContent:"center", gap:"5px", marginTop:"1rem" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                      width: i === (homeQIdx % 5) ? 16 : 5, height:5, borderRadius:99,
                      background: i === (homeQIdx % 5) ? "#F5FF00" : "#1E1E1E",
                      transition:"width .3s, background .3s",
                    }} />
                  ))}
                </div>
              </div>
              {/* Footer */}
              <div style={{
                borderTop:"1px solid #161616", padding:"0.8rem",
                textAlign:"center", color:"#1E1E1E",
                fontSize:"0.58rem", fontFamily:"'Archivo Black',sans-serif", letterSpacing:"0.18em",
              }}>
                RELACION.AT · MENTORING · SIN BS
              </div>
            </>
          )}

          {/* ── MODO ── */}
          {!cargando && !error && pantalla === "modo" && (
            <div className="fu" style={{ flex:1,padding:"2rem 1.6rem",display:"flex",flexDirection:"column",gap:"1.5rem" }}>
              <button onClick={() => setPantalla("inicio")} style={{ background:"none",border:"none",color:"#333",fontSize:"0.8rem",textAlign:"left",fontFamily:"'Archivo Black',sans-serif",letterSpacing:"0.1em" }}>← VOLVER</button>
              <div>
                <Tag>ELEGÍ</Tag>
                <h2 style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"2.5rem",color:"#F0F0F0",lineHeight:0.95,marginTop:"0.8rem",letterSpacing:"-0.02em" }}>¿DE QUIÉN<br/>HABLAMOS?</h2>
              </div>
              {[
                { key:"jefe",  icon:"👔", label:"MI JEFE",   sub:"¿Cómo está esa relación en serio?", c:"#F5FF00" },
                { key:"equipo",icon:"🤝", label:"MI EQUIPO", sub:"¿Sos el jugador o el problema?",   c:"#F5FF00" },
              ].map(op => (
                <button key={op.key} onClick={() => { setModo(op.key); setIndice(0); setRespuestas([]); setPantalla("quiz"); }}
                  style={{ width:"100%", background:"#161616", border:"1.5px solid #222", borderRadius:"18px", padding:"1.8rem 1.5rem", textAlign:"left", transition:"all 0.18s" }}
                  onMouseOver={(e: any) => { e.currentTarget.style.borderColor=op.c; e.currentTarget.style.background="#1A1A1A"; }}
                  onMouseOut={(e: any) =>  { e.currentTarget.style.borderColor="#222"; e.currentTarget.style.background="#161616"; }}
                >
                  <div style={{ fontSize:"2.5rem",marginBottom:"0.7rem" }}>{op.icon}</div>
                  <div style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"1.4rem",color:"#F0F0F0",marginBottom:"0.3rem" }}>{op.label}</div>
                  <div style={{ color:"#444",fontSize:"0.82rem" }}>{op.sub}</div>
                  <div style={{ color:"#333",fontSize:"0.62rem",fontFamily:"'Archivo Black',sans-serif",letterSpacing:"0.1em",marginTop:"0.8rem" }}>
                    {(preguntas as any)[op.key]?.length || "—"} PREGUNTAS
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── QUIZ ── */}
          {!cargando && !error && pantalla === "quiz" && pregActual && (
            <div style={{ flex:1,padding:"1.8rem 1.6rem",display:"flex",flexDirection:"column",gap:"1rem" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"0.8rem" }}>
                <button onClick={reiniciar} style={{ background:"none",border:"none",color:"#333",fontSize:"1rem" }}>✕</button>
                <div style={{ flex:1,display:"flex",gap:"3px" }}>
                  {lista.map((_: any, i: number) => (
                    <div key={i} style={{ flex:1, height:"3px", borderRadius:"2px", background: i<indice ? "#F5FF00" : i===indice ? "#F5FF0044" : "#1E1E1E", transition:"background 0.3s" }}/>
                  ))}
                </div>
                <span style={{ color:"#333",fontSize:"0.7rem",fontFamily:"'Archivo Black',sans-serif",letterSpacing:"0.1em" }}>{indice+1}/{lista.length}</span>
              </div>
              <Tag color={modo==="jefe" ? "#a78bfa" : "#6ee7b7"}>{modo==="jefe" ? "👔 JEFE" : "🤝 EQUIPO"}</Tag>
              <div style={{ flex:1,display:"flex",alignItems:"center" }}>
                <div style={{
                  width:"100%", background:"#161616", border:"1px solid #1E1E1E", borderRadius:"22px",
                  padding:"2.5rem 1.8rem", transform: cardX || "none",
                  opacity: slide==="r"||slide==="l" ? 0 : 1,
                  transition:"transform 0.24s cubic-bezier(0.22,1,0.36,1),opacity 0.2s",
                  boxShadow:"0 4px 32px rgba(0,0,0,0.5)",
                }}>
                  <div style={{ fontSize:"3rem",marginBottom:"1.2rem",textAlign:"center" }}>{pregActual.emoji}</div>
                  <p style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"1.2rem",color:"#F0F0F0",lineHeight:1.3,textAlign:"center",letterSpacing:"-0.01em" }}>{pregActual.question}</p>
                </div>
              </div>
              <div style={{ display:"flex",gap:"0.7rem" }}>
                {[
                  { label:"😬 NO", si:false, bg:"#1A0A0A", border:"#FF3C6E33", hBg:"#FF3C6E22", hBorder:"#FF3C6E", color:"#FF3C6E" },
                  { label:"✅ SÍ", si:true,  bg:"#0D1A0D", border:"#F5FF0033", hBg:"#F5FF0015", hBorder:"#F5FF00", color:"#F5FF00" },
                ].map(b => (
                  <button key={b.label} onClick={() => responder(b.si)} style={{
                    flex:1, background:b.bg, border:`1.5px solid ${b.border}`, borderRadius:"14px", padding:"1rem",
                    fontFamily:"'Archivo Black',sans-serif", fontSize:"0.9rem", color:b.color, transition:"all 0.15s",
                  }}
                    onMouseOver={(e: any) => { e.currentTarget.style.background=b.hBg; e.currentTarget.style.borderColor=b.hBorder; }}
                    onMouseOut={(e: any) =>  { e.currentTarget.style.background=b.bg;  e.currentTarget.style.borderColor=b.border; }}
                  >{b.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULTADO ── */}
          {!cargando && !error && pantalla === "resultado" && (
            <div className="popIn" style={{ flex:1,padding:"2rem 1.6rem",display:"flex",flexDirection:"column",gap:"1rem" }}>
              <Tag color={modo==="jefe" ? "#a78bfa" : "#6ee7b7"}>{modo==="jefe" ? "👔 JEFE" : "🤝 EQUIPO"} · RESULTADO</Tag>
              <h2 style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"2rem",color:"#F0F0F0",letterSpacing:"-0.02em" }}>TU DIAGNÓSTICO</h2>
              <div style={{ background:"#161616",border:`1.5px solid ${scoreInfo.accent}22`,borderRadius:"20px",padding:"2rem 1.5rem",textAlign:"center" }}>
                <div style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"5.5rem",color:scoreInfo.accent,lineHeight:1 }}>{pct}%</div>
                <div style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"1.2rem",color:scoreInfo.accent,marginTop:"0.3rem" }}>{scoreInfo.icon} {scoreInfo.label}</div>
                <div style={{ background:"#1E1E1E",borderRadius:"999px",height:"8px",margin:"1.2rem auto 0",overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${pct}%`,background:scoreInfo.accent,borderRadius:"999px",transition:"width 1.2s cubic-bezier(0.22,1,0.36,1)",boxShadow:`0 0 10px ${scoreInfo.accent}88` }}/>
                </div>
                <p style={{ color:"#555",fontSize:"0.86rem",lineHeight:1.6,marginTop:"1rem" }}>{scoreInfo.sub}</p>
              </div>
              <div style={{ display:"flex",gap:"0.6rem" }}>
                {[
                  { v:respuestas.filter(Boolean).length, l:"SÍ", c:"#F5FF00" },
                  { v:respuestas.filter(x=>!x).length, l:"NO", c:"#FF3C6E" },
                  { v:respuestas.length, l:"TOTAL", c:"#444" },
                ].map((b,i) => (
                  <div key={i} style={{ flex:1,background:"#161616",borderRadius:"12px",padding:"0.9rem 0.5rem",textAlign:"center",border:"1px solid #1E1E1E" }}>
                    <div style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"1.7rem",color:b.c }}>{b.v}</div>
                    <div style={{ fontSize:"0.6rem",color:"#333",fontFamily:"'Archivo Black',sans-serif",letterSpacing:"0.12em" }}>{b.l}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setPantalla("ruta")} style={{
                width:"100%", background:"transparent", border:"1.5px solid #1E1E1E", borderRadius:"12px", padding:"0.85rem",
                fontFamily:"'Archivo Black',sans-serif", fontSize:"0.75rem", color:"#555", letterSpacing:"0.08em", transition:"all 0.15s",
              }}
                onMouseOver={(e: any) => { e.currentTarget.style.borderColor="#F5FF00"; e.currentTarget.style.color="#F5FF00"; }}
                onMouseOut={(e: any) =>  { e.currentTarget.style.borderColor="#1E1E1E"; e.currentTarget.style.color="#555"; }}
              >🔄 VER RUTA DE 3 MESES →</button>
              <div style={{ display:"flex",gap:"0.6rem" }}>
                <button onClick={() => { setModo(modo==="jefe"?"equipo":"jefe"); setIndice(0); setRespuestas([]); setPantalla("quiz"); }}
                  style={{ flex:1,background:"#161616",border:"1px solid #1E1E1E",borderRadius:"12px",padding:"0.8rem",fontFamily:"'Archivo Black',sans-serif",fontSize:"0.68rem",color:"#555",letterSpacing:"0.08em",transition:"border-color 0.15s" }}
                  onMouseOver={(e: any) => e.currentTarget.style.borderColor="#333"}
                  onMouseOut={(e: any) =>  e.currentTarget.style.borderColor="#1E1E1E"}
                >{modo==="jefe" ? "🤝 EQUIPO" : "👔 JEFE"}</button>
                <button onClick={reiniciar} style={{ flex:2,background:"#F5FF00",border:"none",borderRadius:"12px",padding:"0.8rem",fontFamily:"'Archivo Black',sans-serif",fontSize:"0.72rem",color:"#0D0D0D",letterSpacing:"0.08em",boxShadow:"0 4px 16px rgba(245,255,0,0.25)" }}>→ INICIO</button>
              </div>
            </div>
          )}

          {/* ── VIBE ── */}
          {!cargando && !error && pantalla === "vibe" && (
            <div className="fu" style={{ flex:1,padding:"2rem 1.6rem",display:"flex",flexDirection:"column",gap:"1.5rem" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <button onClick={() => setPantalla("inicio")} style={{ background:"none",border:"none",color:"#333",fontSize:"0.8rem",fontFamily:"'Archivo Black',sans-serif",letterSpacing:"0.1em" }}>← VOLVER</button>
                <Tag color="#FF7A00">MODO EXPLORAR</Tag>
              </div>
              <h2 style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"2.2rem",color:"#F0F0F0",lineHeight:0.95,letterSpacing:"-0.02em" }}>
                SIN PUNTAJE.<br/><span style={{ color:"#FF7A00" }}>SOLO<br/>PENSÁ.</span>
              </h2>
              <div style={{ flex:1,display:"flex",alignItems:"center" }}>
                {pregVibe && (
                  <div style={{ width:"100%",opacity:visible?1:0,transition:"opacity 0.26s",background:"#161616",border:"1px solid #1E1E1E",borderRadius:"22px",padding:"2.5rem 2rem",textAlign:"center" }}>
                    <div style={{ fontSize:"3.5rem",marginBottom:"1.5rem" }}>{pregVibe.emoji}</div>
                    <p style={{ fontFamily:"'Archivo Black',sans-serif",fontSize:"1.15rem",color:"#F0F0F0",lineHeight:1.3,letterSpacing:"-0.01em" }}>{pregVibe.question}</p>
                    <div style={{ marginTop:"1.8rem",color:"#FF7A00",fontSize:"0.62rem",fontFamily:"'Archivo Black',sans-serif",letterSpacing:"0.2em" }} className="blink">PENSALO...</div>
                  </div>
                )}
              </div>
              <button onClick={nextVibe} style={{ width:"100%",background:"#FF7A00",border:"none",borderRadius:"14px",padding:"1.1rem",fontFamily:"'Archivo Black',sans-serif",fontSize:"0.9rem",color:"#0D0D0D",letterSpacing:"0.08em",boxShadow:"0 4px 20px rgba(255,122,0,0.3)",transition:"transform 0.15s" }}
                onMouseOver={(e: any) => e.currentTarget.style.transform="scale(1.02)"}
                onMouseOut={(e: any) =>  e.currentTarget.style.transform="scale(1)"}
              >SIGUIENTE →</button>
              <button onClick={() => setPantalla("modo")} style={{ width:"100%",background:"transparent",border:"1px solid #1E1E1E",borderRadius:"12px",padding:"0.8rem",fontFamily:"'Archivo Black',sans-serif",fontSize:"0.72rem",color:"#333",letterSpacing:"0.1em",transition:"border-color 0.15s" }}
                onMouseOver={(e: any) => e.currentTarget.style.borderColor="#333"}
                onMouseOut={(e: any) =>  e.currentTarget.style.borderColor="#1E1E1E"}
              >¿LISTO PARA TU PUNTAJE? →</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { useEffect, useRef, useState } from "react";

const BG_IMAGE =
  "https://cdn.poehali.dev/projects/5506b00a-69a7-4cdb-9dc6-e9f352c6fc0b/files/dc1e2ff4-c1ff-46ae-85ad-50b7fb81af4f.jpg";

const benefits = [
  { text: "בלי טעויות מיותרות", delay: 0.55 },
  { text: "בלי עיכובים בלוחות זמנים", delay: 0.7 },
  { text: "בלי פשרות ועיגול פינות", delay: 0.85 },
];

/* ── Animated grid lines ── */
const GridLines = () => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, opacity: 0.07 }}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#EFEFF2" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

/* ── Floating neon orbs ── */
const Orbs = () => (
  <>
    <div style={{
      position: "absolute", top: "8%", right: "10%",
      width: 420, height: 420, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(0,153,255,0.22) 0%, transparent 70%)",
      animation: "float-y 9s ease-in-out infinite", zIndex: 1,
      filter: "blur(20px)",
    }} />
    <div style={{
      position: "absolute", bottom: "10%", left: "5%",
      width: 360, height: 360, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(235,47,116,0.18) 0%, transparent 70%)",
      animation: "float-y 12s ease-in-out infinite reverse", zIndex: 1,
      filter: "blur(20px)",
    }} />
    <div style={{
      position: "absolute", top: "45%", left: "35%",
      width: 250, height: 250, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(0,153,255,0.1) 0%, transparent 70%)",
      animation: "float-x 15s ease-in-out infinite", zIndex: 1,
      filter: "blur(30px)",
    }} />
  </>
);

/* ── Particle canvas ── */
const Particles = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let id: number;
    const pts: { x: number; y: number; vx: number; vy: number; r: number; c: string }[] = [];
    const colors = ["#0099FF", "#EB2F74", "#EFEFF2"];
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++)
      pts.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.4,
        c: colors[Math.floor(Math.random() * colors.length)] });
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        pts.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = p.c; ctx.globalAlpha = (1 - d / 130) * 0.1;
            ctx.lineWidth = 0.6; ctx.stroke();
          }
        });
        ctx.globalAlpha = 0.45; ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c; ctx.fill(); ctx.globalAlpha = 1;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, zIndex: 2 }} />;
};

export default function Index() {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  const fade = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(44px)",
    transition: `opacity 0.8s ${delay}s cubic-bezier(.16,1,.3,1), transform 0.8s ${delay}s cubic-bezier(.16,1,.3,1)`,
  });

  return (
    <div dir="rtl" style={{ fontFamily: "'Inter', sans-serif", background: "#17161C", minHeight: "100vh", overflow: "hidden" }}>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

        {/* photo bg */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.18,
        }} />

        {/* dark overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "linear-gradient(160deg, rgba(23,22,28,0.92) 0%, rgba(15,18,30,0.85) 60%, rgba(23,22,28,0.96) 100%)",
        }} />

        <GridLines />
        <Orbs />
        <Particles />

        {/* decorative corner accent */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 280, height: 3,
          background: "linear-gradient(90deg, #0099FF, #EB2F74)",
          zIndex: 5,
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 3, height: 200,
          background: "linear-gradient(180deg, #0099FF, transparent)",
          zIndex: 5,
        }} />
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: 200, height: 3,
          background: "linear-gradient(270deg, #EB2F74, transparent)",
          zIndex: 5,
        }} />

        {/* CONTENT */}
        <div style={{
          position: "relative", zIndex: 10,
          textAlign: "center",
          padding: "80px 24px",
          maxWidth: 780,
          transform: `translateY(${scrollY * 0.28}px)`,
        }}>

          {/* pill badge */}
          <div style={{
            ...fade(0.05),
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 20px", borderRadius: 100, marginBottom: 36,
            background: "rgba(0,153,255,0.08)",
            border: "1px solid rgba(0,153,255,0.28)",
            color: "#0099FF", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0099FF", display: "inline-block", boxShadow: "0 0 8px #0099FF" }} />
            מערכות אלומיניום מקצועיות
          </div>

          {/* headline line 1 */}
          <h1 style={{
            ...fade(0.18),
            margin: "0 0 6px",
            fontSize: "clamp(2.4rem, 6.5vw, 6rem)",
            lineHeight: 1.06,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#EFEFF2",
          }}>
            תכנון מערכות
          </h1>

          {/* headline line 2 — gradient */}
          <h1 style={{
            ...fade(0.3),
            margin: "0 0 28px",
            fontSize: "clamp(2.4rem, 6.5vw, 6rem)",
            lineHeight: 1.06,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            background: "linear-gradient(90deg, #0099FF 0%, #EB2F74 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            אלומיניום מדויק
          </h1>

          {/* subtitle */}
          <p style={{
            ...fade(0.42),
            fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)",
            color: "rgba(239,239,242,0.55)",
            fontWeight: 400,
            marginBottom: 52,
            letterSpacing: "0.01em",
          }}>
            במקום אחד מא' ועד ת'
          </p>

          {/* divider */}
          <div style={{
            ...fade(0.5),
            width: 60, height: 2, margin: "0 auto 48px",
            background: "linear-gradient(90deg, #0099FF, #EB2F74)",
            borderRadius: 2,
          }} />

          {/* benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                ...fade(b.delay),
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 28px", borderRadius: 14,
                background: "rgba(239,239,242,0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(239,239,242,0.08)",
                width: "100%", maxWidth: 420,
                transition: `opacity 0.8s ${b.delay}s cubic-bezier(.16,1,.3,1), transform 0.8s ${b.delay}s cubic-bezier(.16,1,.3,1), box-shadow 0.3s ease, border-color 0.3s ease`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,153,255,0.35)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 24px rgba(0,153,255,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(239,239,242,0.08)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
              >
                {/* check icon */}
                <span style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: i % 2 === 0 ? "rgba(0,153,255,0.15)" : "rgba(235,47,116,0.15)",
                  border: `1px solid ${i % 2 === 0 ? "rgba(0,153,255,0.4)" : "rgba(235,47,116,0.4)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: i % 2 === 0 ? "#0099FF" : "#EB2F74",
                  fontSize: 12, fontWeight: 700,
                  boxShadow: i % 2 === 0 ? "0 0 12px rgba(0,153,255,0.3)" : "0 0 12px rgba(235,47,116,0.3)",
                }}>✓</span>
                <span style={{ fontSize: 16, color: "rgba(239,239,242,0.88)", fontWeight: 500 }}>{b.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ ...fade(1.0), marginTop: 52, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "15px 40px", borderRadius: 12, fontSize: 16,
                fontFamily: "'Inter', sans-serif", fontWeight: 700,
                letterSpacing: "0.02em",
                background: "linear-gradient(135deg, #0099FF, #EB2F74)",
                color: "#fff", border: "none", cursor: "pointer",
                boxShadow: "0 0 32px rgba(0,153,255,0.3), 0 4px 20px rgba(0,0,0,0.4)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.03)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 56px rgba(0,153,255,0.45), 0 8px 30px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 32px rgba(0,153,255,0.3), 0 4px 20px rgba(0,0,0,0.4)";
              }}
            >
              צור קשר עכשיו
            </button>
            <button
              style={{
                padding: "15px 40px", borderRadius: 12, fontSize: 16,
                fontFamily: "'Inter', sans-serif", fontWeight: 600,
                letterSpacing: "0.02em",
                background: "transparent",
                color: "#EFEFF2", cursor: "pointer",
                border: "1px solid rgba(239,239,242,0.2)",
                transition: "border-color 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,153,255,0.55)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,239,242,0.2)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              הפרויקטים שלנו
            </button>
          </div>
        </div>

        {/* bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 100, zIndex: 8,
          background: "linear-gradient(to bottom, transparent, #17161C)",
        }} />
      </section>
    </div>
  );
}

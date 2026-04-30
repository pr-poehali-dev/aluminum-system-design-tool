import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    icon: "✓",
    text: "בלי טעויות מיותרות",
    color: "var(--brand-cyan)",
    glow: "0 0 30px rgba(6,182,212,0.5)",
    delay: "0.1s",
  },
  {
    icon: "✓",
    text: "בלי עיכובים בלוחות זמנים",
    color: "var(--brand-orange)",
    glow: "0 0 30px rgba(255,107,26,0.5)",
    delay: "0.3s",
  },
  {
    icon: "✓",
    text: "בלי פשרות ועיגול פינות",
    color: "var(--brand-purple)",
    glow: "0 0 30px rgba(168,85,247,0.5)",
    delay: "0.5s",
  },
];

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }[] = [];

    const colors = ["#ff6b1a", "#a855f7", "#06b6d4", "#fbbf24"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        particles.slice(i + 1).forEach((q) => {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 120) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    />
  );
};

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "hsl(var(--background))",
        overflow: "hidden",
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* animated particle background */}
        <ParticleCanvas />

        {/* radial glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
            animation: "float-y 8s ease-in-out infinite",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "2%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
            animation: "float-y 10s ease-in-out infinite reverse",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,107,26,0.12) 0%, transparent 70%)",
            animation: "float-x 12s ease-in-out infinite",
            zIndex: 1,
          }}
        />

        {/* rotating ring */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            border: "1px solid rgba(168,85,247,0.08)",
            animation: "spin-slow 30s linear infinite",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 900,
            height: 900,
            borderRadius: "50%",
            border: "1px solid rgba(6,182,212,0.05)",
            animation: "spin-slow 50s linear infinite reverse",
            zIndex: 1,
          }}
        />

        {/* parallax content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 24px",
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          {/* tag */}
          <div
            className="glass"
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: 100,
              marginBottom: 32,
              fontSize: 13,
              letterSpacing: "0.12em",
              color: "var(--brand-cyan)",
              border: "1px solid rgba(6,182,212,0.25)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            מערכות אלומיניום מקצועיות
          </div>

          {/* main headline */}
          <h1
            style={{
              fontSize: "clamp(2.6rem, 7vw, 6.5rem)",
              lineHeight: 1.05,
              margin: "0 0 24px",
              fontFamily: "Oswald, sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s 0.15s ease, transform 0.8s 0.15s ease",
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              תכנון מערכות
            </span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #ff6b1a 0%, #a855f7 50%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              אלומיניום מדויק
            </span>
          </h1>

          {/* subtitle */}
          <p
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              color: "rgba(255,255,255,0.65)",
              marginBottom: 56,
              fontFamily: "Golos Text, sans-serif",
              fontWeight: 400,
              maxWidth: 560,
              margin: "0 auto 56px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s 0.3s ease, transform 0.8s 0.3s ease",
            }}
          >
            במקום אחד מא' ועד ת'
          </p>

          {/* benefits cards */}
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            {benefits.map((b, i) => (
              <div
                key={i}
                className="glass hover-lift"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 24px",
                  borderRadius: 16,
                  border: `1px solid ${b.color}30`,
                  cursor: "default",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(50px)",
                  transition: `opacity 0.8s ${b.delay} ease, transform 0.8s ${b.delay} ease`,
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${b.color}20`,
                    border: `1px solid ${b.color}60`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: b.color,
                    flexShrink: 0,
                    boxShadow: b.glow,
                  }}
                >
                  {b.icon}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "Golos Text, sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div
            style={{
              marginTop: 52,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s 0.7s ease, transform 0.8s 0.7s ease",
            }}
          >
            <button
              style={{
                padding: "16px 48px",
                borderRadius: 100,
                fontSize: 17,
                fontFamily: "Oswald, sans-serif",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background:
                  "linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-purple) 100%)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow:
                  "0 0 40px rgba(255,107,26,0.35), 0 0 80px rgba(168,85,247,0.2)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.05)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 60px rgba(255,107,26,0.5), 0 0 120px rgba(168,85,247,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 40px rgba(255,107,26,0.35), 0 0 80px rgba(168,85,247,0.2)";
              }}
            >
              צור קשר עכשיו
            </button>
          </div>
        </div>

        {/* bottom gradient fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background:
              "linear-gradient(to bottom, transparent, hsl(var(--background)))",
            zIndex: 3,
          }}
        />
      </section>
    </div>
  );
};

export default Index;

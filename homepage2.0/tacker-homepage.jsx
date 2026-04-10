import { useState, useEffect, useRef } from "react";

const H = "'Sora', sans-serif";
const B = "'DM Sans', sans-serif";
const M = "'DM Mono', monospace";

const c = {
  bg: "#FDFCFA", card: "#FFFFFF", subtle: "#F5F3EF",
  text: "#111111", sec: "#555555", muted: "#999999",
  border: "#E5E2DC", borderSub: "#F0EDE8",
  accent: "#4A5D73", accentSub: "#ECF0F4",
  success: "#3D6B4F", error: "#9E3B32",
};

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useInView(0.08);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR
   Reference: Anthropic clean nav + Airbnb sticky CTA
   ═══════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const linkStyle = { fontFamily: B, fontSize: 14, fontWeight: 500, color: c.sec, textDecoration: "none", transition: "color 0.15s", cursor: "pointer" };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      backgroundColor: scrolled ? "rgba(253,252,250,0.92)" : "rgba(253,252,250,0)",
      borderBottom: scrolled ? `1px solid ${c.border}` : "1px solid transparent",
      transition: "all 0.35s ease",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            backgroundColor: c.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: c.card, fontSize: 15, fontWeight: 800, fontFamily: H,
          }}>T</div>
          <span style={{ fontFamily: H, fontWeight: 700, fontSize: 17, letterSpacing: "-0.03em", color: c.text }}>Tacker</span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a style={linkStyle} href="#features">Features</a>
          <a style={linkStyle} href="#how-it-works">How it works</a>
          <a style={linkStyle} href="#faq">FAQ</a>
          <button style={{
            fontFamily: B, fontSize: 13, fontWeight: 600,
            backgroundColor: c.text, color: c.card,
            border: "none", borderRadius: 8,
            padding: "8px 18px", cursor: "pointer",
            letterSpacing: "-0.01em",
            transition: "background-color 0.15s",
          }}>
            Download Free
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HERO
   Reference: Treasury hero + Airbnb simplicity
   ═══════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{ backgroundColor: c.bg, paddingTop: 128, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 72 }}>
        {/* Left: Copy */}
        <div style={{ flex: "1 1 480px", minWidth: 280 }}>
          <Reveal>
            <span style={{
              fontFamily: B, fontSize: 13, fontWeight: 600,
              color: c.accent, letterSpacing: "0.07em",
              textTransform: "uppercase",
              display: "inline-block", marginBottom: 20,
            }}>Expense & Income Tracker</span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 style={{
              fontFamily: H,
              fontSize: "clamp(2.5rem, 5.5vw, 3.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1.04,
              color: c.text,
              margin: "0 0 24px",
            }}>
              Know exactly<br />where your<br />money goes.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p style={{
              fontFamily: B, fontSize: 18, lineHeight: 1.6,
              color: c.sec, margin: "0 0 36px", maxWidth: 440,
            }}>
              AI-powered tracking that categorizes your spending, monitors cash flow, and calculates your saving rate — effortlessly.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button style={{
                fontFamily: B, fontSize: 15, fontWeight: 600,
                backgroundColor: c.text, color: c.card,
                border: "none", borderRadius: 12,
                padding: "15px 32px", cursor: "pointer",
                letterSpacing: "-0.01em",
                transition: "background-color 0.15s",
                boxShadow: "0 2px 8px rgba(17,17,17,0.12)",
              }}>Download Free</button>
              <button style={{
                fontFamily: B, fontSize: 15, fontWeight: 500,
                backgroundColor: "transparent", color: c.text,
                border: `1.5px solid ${c.border}`, borderRadius: 12,
                padding: "14px 28px", cursor: "pointer",
                letterSpacing: "-0.01em",
                transition: "all 0.15s",
              }}>See how it works</button>
            </div>
            <p style={{ fontFamily: B, fontSize: 13, color: c.muted, marginTop: 14, letterSpacing: "0.005em" }}>
              No account needed. No credit card. 100% free to start.
            </p>
          </Reveal>
        </div>

        {/* Right: Phone mockup */}
        <Reveal delay={0.2} style={{ flexShrink: 0 }}>
          <div style={{
            width: 300, height: 600,
            borderRadius: 40,
            backgroundColor: c.card,
            border: `1.5px solid ${c.border}`,
            boxShadow: `0 32px 80px rgba(17,17,17,0.1), 0 12px 32px rgba(17,17,17,0.06), 0 0 0 1px rgba(17,17,17,0.02)`,
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Notch */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: 126, height: 30,
              backgroundColor: c.text,
              borderRadius: "0 0 18px 18px",
              zIndex: 5,
            }} />
            {/* Status bar area */}
            <div style={{ height: 52, backgroundColor: c.card }} />

            {/* Screen content */}
            <div style={{ padding: "0 18px 18px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span style={{ fontFamily: H, fontSize: 16, fontWeight: 700, color: c.text, letterSpacing: "-0.025em" }}>Dashboard</span>
                <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.accentSub, color: c.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, fontFamily: H }}>FK</div>
              </div>

              {/* Balance card */}
              <div style={{
                backgroundColor: c.subtle, borderRadius: 14, padding: 16, marginBottom: 14,
              }}>
                <div style={{ fontFamily: B, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>April Balance</div>
                <div style={{ fontFamily: M, fontSize: 32, fontWeight: 500, color: c.text, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                  €352<span style={{ fontSize: 18, color: c.muted }}>.50</span>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  {[
                    { l: "Income", v: "+€3,200", cl: c.success },
                    { l: "Expenses", v: "-€2,847", cl: c.text },
                    { l: "Saving", v: "28.3%", cl: c.accent },
                  ].map(s => (
                    <div key={s.l}>
                      <div style={{ fontFamily: B, fontSize: 10, color: c.muted, marginBottom: 2 }}>{s.l}</div>
                      <div style={{ fontFamily: M, fontSize: 13, fontWeight: 500, color: s.cl }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini chart */}
              <div style={{ display: "flex", alignItems: "end", gap: 5, height: 52, marginBottom: 16, padding: "0 2px" }}>
                {[32, 48, 38, 62, 45, 72, 55, 68, 42, 78, 52, 35].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h}%`, borderRadius: 3,
                    backgroundColor: i === 9 ? c.accent : `${c.accent}25`,
                    transition: `height 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s`,
                  }} />
                ))}
              </div>

              {/* Transactions */}
              <div style={{ fontFamily: B, fontSize: 12, fontWeight: 600, color: c.sec, marginBottom: 10 }}>Recent</div>
              {[
                { ini: "ME", name: "Mercadona", cat: "Groceries", amt: "-€47.23" },
                { ini: "SA", name: "Salary Deposit", cat: "Income", amt: "+€3,200" },
                { ini: "NF", name: "Netflix", cat: "Subscriptions", amt: "-€15.49" },
                { ini: "GY", name: "Gym", cat: "Health", amt: "-€39.00" },
                { ini: "UE", name: "Uber Eats", cat: "Food", amt: "-€22.80" },
              ].map((tx, i, a) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 0",
                  borderBottom: i < a.length - 1 ? `1px solid ${c.borderSub}` : "none",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 15,
                    backgroundColor: c.accentSub, color: c.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9.5, fontWeight: 700, fontFamily: H,
                    flexShrink: 0,
                  }}>{tx.ini}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: B, fontSize: 12.5, fontWeight: 600, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.name}</div>
                    <div style={{ fontFamily: B, fontSize: 10.5, color: c.muted }}>{tx.cat}</div>
                  </div>
                  <div style={{
                    fontFamily: M, fontSize: 12.5, fontWeight: 500,
                    color: tx.amt.startsWith("+") ? c.success : c.text,
                    flexShrink: 0,
                  }}>{tx.amt}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SOCIAL PROOF BAR
   Reference: Revolut trust metrics
   ═══════════════════════════════════════════ */
function SocialProof() {
  const stats = [
    { value: "10K+", label: "Downloads" },
    { value: "4.8", label: "App Store", suffix: "★" },
    { value: "30+", label: "Countries" },
    { value: "100%", label: "Private & encrypted" },
  ];

  return (
    <section style={{ backgroundColor: c.subtle, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 56, flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {i > 0 && <div style={{ width: 1, height: 32, backgroundColor: c.border, marginRight: 4, flexShrink: 0 }} />}
                <div style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
                    <span style={{ fontFamily: H, fontSize: 24, fontWeight: 700, color: c.text, letterSpacing: "-0.03em" }}>{s.value}</span>
                    {s.suffix && <span style={{ fontFamily: B, fontSize: 16, color: c.accent, fontWeight: 600 }}>{s.suffix}</span>}
                  </div>
                  <div style={{ fontFamily: B, fontSize: 13, color: c.muted, marginTop: 2, letterSpacing: "0.005em" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FEATURES — 3 CARDS
   Reference: Treasury feature blocks → Revolut card format
   ═══════════════════════════════════════════ */
function Features() {
  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      title: "AI-powered tracking",
      desc: "Add expenses in seconds. Our AI categorizes them for you — learning your habits and getting smarter over time.",
      badge: "Smart",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
        </svg>
      ),
      title: "Visual insights",
      desc: "See your spending patterns with beautiful charts and breakdowns. Know exactly where every euro goes.",
      badge: "Clear",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 100 4h4a2 2 0 010 4H8"/><path d="M12 18V6"/>
        </svg>
      ),
      title: "Saving rate",
      desc: "Know your real saving rate. Track cash flow month over month without spreadsheets or manual math.",
      badge: "Simple",
    },
  ];

  return (
    <section id="features" style={{ backgroundColor: c.bg, padding: "88px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontFamily: B, fontSize: 13, fontWeight: 600, color: c.accent, letterSpacing: "0.07em", textTransform: "uppercase", display: "inline-block", marginBottom: 14 }}>Features</span>
            <h2 style={{ fontFamily: H, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.12, color: c.text, margin: 0 }}>
              Everything you need.<br/>Nothing you don't.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div style={{
                backgroundColor: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: 16,
                padding: 28,
                boxShadow: "0 1px 3px rgba(17,17,17,0.05)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Top row: icon + badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 13,
                    backgroundColor: c.accentSub,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{f.icon}</div>
                  <span style={{
                    fontFamily: B, fontSize: 11.5, fontWeight: 600,
                    color: c.accent, backgroundColor: c.accentSub,
                    padding: "4px 10px", borderRadius: 6,
                    letterSpacing: "0.02em",
                  }}>{f.badge}</span>
                </div>
                {/* Title */}
                <h3 style={{
                  fontFamily: H, fontSize: 19, fontWeight: 700,
                  letterSpacing: "-0.02em", color: c.text,
                  margin: "0 0 10px",
                }}>{f.title}</h3>
                {/* Description */}
                <p style={{
                  fontFamily: B, fontSize: 15, lineHeight: 1.6,
                  color: c.sec, margin: 0, flex: 1,
                }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT SHOWCASE — Tabbed phone mockup
   Reference: Treasury immersive sections + Airbnb phone mockups
   ═══════════════════════════════════════════ */
function Showcase() {
  const [tab, setTab] = useState(0);
  const tabs = ["Dashboard", "Transactions", "Insights"];

  const DashboardScreen = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { l: "Income", v: "€3,200", cl: c.success },
          { l: "Expenses", v: "€2,847", cl: c.text },
          { l: "Saving rate", v: "28.3%", cl: c.accent },
          { l: "Transactions", v: "47", cl: c.text },
        ].map(s => (
          <div key={s.l} style={{ backgroundColor: c.subtle, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontFamily: B, fontSize: 9.5, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
            <div style={{ fontFamily: M, fontSize: 17, fontWeight: 500, color: s.cl, letterSpacing: "-0.02em", marginTop: 3 }}>{s.v}</div>
          </div>
        ))}
      </div>
      {/* Budget bar */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontFamily: B, fontSize: 10.5, fontWeight: 600, color: c.sec }}>Monthly budget</span>
          <span style={{ fontFamily: M, fontSize: 10.5, color: c.muted }}>72%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, backgroundColor: c.subtle, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "72%", borderRadius: 3, backgroundColor: c.accent }} />
        </div>
      </div>
    </div>
  );

  const TransactionsScreen = () => (
    <div>
      {[
        { ini: "ME", name: "Mercadona", cat: "Groceries", amt: "-€47.23", time: "Today" },
        { ini: "SA", name: "Salary Deposit", cat: "Income", amt: "+€3,200", time: "Apr 1" },
        { ini: "NF", name: "Netflix", cat: "Subscriptions", amt: "-€15.49", time: "Apr 2" },
        { ini: "GY", name: "Gym", cat: "Health & Fitness", amt: "-€39.00", time: "Apr 3" },
        { ini: "UE", name: "Uber Eats", cat: "Food & Dining", amt: "-€22.80", time: "Apr 3" },
        { ini: "ZA", name: "Zara", cat: "Shopping", amt: "-€89.90", time: "Apr 4" },
        { ini: "SP", name: "Spotify", cat: "Subscriptions", amt: "-€12.99", time: "Apr 5" },
      ].map((tx, i, a) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "8px 0",
          borderBottom: i < a.length - 1 ? `1px solid ${c.borderSub}` : "none",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            backgroundColor: c.accentSub, color: c.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700, fontFamily: H, flexShrink: 0,
          }}>{tx.ini}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: B, fontSize: 12, fontWeight: 600, color: c.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.name}</div>
            <div style={{ fontFamily: B, fontSize: 10, color: c.muted }}>{tx.cat} · {tx.time}</div>
          </div>
          <div style={{ fontFamily: M, fontSize: 12, fontWeight: 500, color: tx.amt.startsWith("+") ? c.success : c.text, flexShrink: 0 }}>{tx.amt}</div>
        </div>
      ))}
    </div>
  );

  const InsightsScreen = () => (
    <div>
      <div style={{ fontFamily: H, fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 14, letterSpacing: "-0.015em" }}>Spending by category</div>
      {[
        { cat: "Food & Dining", pct: 34, amt: "€968" },
        { cat: "Housing", pct: 28, amt: "€798" },
        { cat: "Transport", pct: 15, amt: "€427" },
        { cat: "Shopping", pct: 12, amt: "€342" },
        { cat: "Health", pct: 7, amt: "€199" },
        { cat: "Other", pct: 4, amt: "€113" },
      ].map(item => (
        <div key={item.cat} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: B, fontSize: 11.5, fontWeight: 500, color: c.text }}>{item.cat}</span>
            <span style={{ fontFamily: M, fontSize: 10.5, color: c.muted }}>{item.amt} · {item.pct}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 2.5, backgroundColor: c.subtle, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${item.pct}%`, borderRadius: 2.5, backgroundColor: item.pct > 25 ? c.accent : `${c.accent}70`, transition: "width 0.5s ease" }} />
          </div>
        </div>
      ))}
      {/* Donut placeholder */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          {[
            { pct: 34, color: c.accent, offset: 0 },
            { pct: 28, color: `${c.accent}B0`, offset: 34 },
            { pct: 15, color: `${c.accent}80`, offset: 62 },
            { pct: 12, color: `${c.accent}55`, offset: 77 },
            { pct: 7, color: `${c.accent}35`, offset: 89 },
            { pct: 4, color: `${c.accent}20`, offset: 96 },
          ].map((seg, i) => {
            const r = 38;
            const circ = 2 * Math.PI * r;
            return (
              <circle
                key={i}
                cx="50" cy="50" r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${(seg.pct / 100) * circ} ${circ}`}
                strokeDashoffset={-(seg.offset / 100) * circ}
                transform="rotate(-90 50 50)"
              />
            );
          })}
          <text x="50" y="48" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: M, fontSize: 14, fontWeight: 500, fill: c.text }}>€2,847</text>
          <text x="50" y="62" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: B, fontSize: 8, fill: c.muted }}>This month</text>
        </svg>
      </div>
    </div>
  );

  const screens = [<DashboardScreen key="d" />, <TransactionsScreen key="t" />, <InsightsScreen key="i" />];

  return (
    <section style={{ backgroundColor: c.subtle, padding: "88px 0", borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 72, flexWrap: "wrap", justifyContent: "center" }}>
        {/* Left copy */}
        <div style={{ flex: "1 1 400px", maxWidth: 460, minWidth: 280 }}>
          <Reveal>
            <span style={{ fontFamily: B, fontSize: 13, fontWeight: 600, color: c.accent, letterSpacing: "0.07em", textTransform: "uppercase", display: "inline-block", marginBottom: 14 }}>Product</span>
            <h2 style={{ fontFamily: H, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.12, color: c.text, margin: "0 0 18px" }}>
              Your finances,<br/>at a glance.
            </h2>
            <p style={{ fontFamily: B, fontSize: 16.5, lineHeight: 1.6, color: c.sec, margin: "0 0 32px", maxWidth: 400 }}>
              Three views. That's all you need. A dashboard for the big picture, transactions for the detail, and insights for the patterns.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            {/* Tab selector */}
            <div style={{ display: "inline-flex", gap: 4, backgroundColor: c.card, borderRadius: 10, padding: 4, border: `1px solid ${c.border}` }}>
              {tabs.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setTab(i)}
                  style={{
                    fontFamily: B, fontSize: 13,
                    fontWeight: tab === i ? 600 : 450,
                    color: tab === i ? c.text : c.muted,
                    backgroundColor: tab === i ? c.subtle : "transparent",
                    border: "none",
                    borderRadius: 7,
                    padding: "8px 16px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    letterSpacing: "-0.005em",
                  }}
                >{label}</button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Dashboard", "Overview of balance, income, expenses, and budget progress."],
                ["Transactions", "Every transaction, auto-categorized and searchable."],
                ["Insights", "Category breakdowns and spending patterns over time."],
              ][tab] && (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent, marginTop: 7, flexShrink: 0 }} />
                  <p style={{ fontFamily: B, fontSize: 14, color: c.sec, margin: 0, lineHeight: 1.5 }}>
                    {["Overview of balance, income, expenses, and budget progress at a glance.", "Every transaction logged, AI-categorized, and instantly searchable.", "Category breakdowns with spending patterns charted over time."][tab]}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* Right phone */}
        <Reveal delay={0.15} style={{ flexShrink: 0 }}>
          <div style={{
            width: 290, height: 580,
            borderRadius: 38,
            backgroundColor: c.card,
            border: `1.5px solid ${c.border}`,
            boxShadow: `0 28px 72px rgba(17,17,17,0.1), 0 10px 28px rgba(17,17,17,0.06)`,
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Notch */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 28, backgroundColor: c.text, borderRadius: "0 0 16px 16px", zIndex: 5 }} />
            <div style={{ height: 48 }} />
            {/* Screen header */}
            <div style={{ padding: "0 18px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: c.text, letterSpacing: "-0.02em" }}>{tabs[tab]}</span>
                <div style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.accentSub, color: c.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, fontFamily: H }}>FK</div>
              </div>
            </div>
            {/* Screen content */}
            <div style={{ padding: "0 18px 18px", transition: "opacity 0.25s ease" }}>
              {screens[tab]}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   HOW IT WORKS — 3 steps
   Reference: Airbnb "It's easy to list" pattern
   ═══════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Download the app",
      desc: "Free on iOS and Android. No account creation, no credit card. Open it and you're ready.",
      visual: (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {/* App Store badge mock */}
          {["App Store", "Google Play"].map(store => (
            <div key={store} style={{
              backgroundColor: c.text, color: c.card,
              borderRadius: 8, padding: "8px 14px",
              fontFamily: B, fontSize: 11, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6,
              letterSpacing: "-0.005em",
            }}>
              <span style={{ fontSize: 14 }}>{store === "App Store" ? "▶" : "▷"}</span>
              {store}
            </div>
          ))}
        </div>
      ),
    },
    {
      num: "02",
      title: "Log your first transaction",
      desc: "Tap the + button, enter an amount, and our AI suggests the category. Takes 3 seconds.",
      visual: (
        <div style={{ backgroundColor: c.subtle, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.text, color: c.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 300, fontFamily: H }}>+</div>
          <div>
            <div style={{ fontFamily: M, fontSize: 16, fontWeight: 500, color: c.text, letterSpacing: "-0.01em" }}>€47.23</div>
            <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
              <span style={{ fontFamily: B, fontSize: 10, fontWeight: 600, color: c.accent, backgroundColor: c.accentSub, padding: "2px 6px", borderRadius: 4 }}>Groceries</span>
              <span style={{ fontFamily: B, fontSize: 10, color: c.muted }}>AI suggested</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: "03",
      title: "Watch your insights build",
      desc: "After a few entries, charts and patterns appear. Your saving rate, top categories, monthly trends — all automatic.",
      visual: (
        <div style={{ display: "flex", alignItems: "end", gap: 4, height: 48, padding: "0 4px" }}>
          {[18, 30, 25, 42, 35, 58, 48, 65, 52, 72, 60, 45].map((h, i) => (
            <div key={i} style={{
              flex: 1, height: `${h}%`, borderRadius: 2.5,
              backgroundColor: i >= 8 ? c.accent : `${c.accent}30`,
            }} />
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" style={{ backgroundColor: c.bg, padding: "88px 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: B, fontSize: 13, fontWeight: 600, color: c.accent, letterSpacing: "0.07em", textTransform: "uppercase", display: "inline-block", marginBottom: 14 }}>How it works</span>
            <h2 style={{ fontFamily: H, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.12, color: c.text, margin: 0 }}>
              Up and running in<br/>under a minute.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.1}>
              <div style={{
                backgroundColor: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: 16,
                padding: 28,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Step number */}
                <div style={{
                  fontFamily: M, fontSize: 13, fontWeight: 500,
                  color: c.accent, letterSpacing: "0.02em",
                  marginBottom: 16,
                }}>Step {step.num}</div>

                {/* Visual */}
                <div style={{
                  backgroundColor: c.subtle,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                  minHeight: 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {step.visual}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: H, fontSize: 18, fontWeight: 700,
                  letterSpacing: "-0.02em", color: c.text,
                  margin: "0 0 8px",
                }}>{step.title}</h3>

                {/* Description */}
                <p style={{
                  fontFamily: B, fontSize: 14.5, lineHeight: 1.55,
                  color: c.sec, margin: 0, flex: 1,
                }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TESTIMONIALS
   Reference: Treasury testimonial + App Store review snippets
   ═══════════════════════════════════════════ */
function Testimonials() {
  const reviews = [
    {
      quote: "I tried every finance app out there. Tacker is the first one that actually stuck — because it takes 3 seconds to log something.",
      name: "Sofia M.",
      role: "Marketing Manager",
      stars: 5,
    },
    {
      quote: "The AI categorization is scary good. After a week it knew that 'Mercadona' is groceries and 'Glovo' is takeout. I barely touch it now.",
      name: "Daniel R.",
      role: "Software Engineer",
      stars: 5,
    },
    {
      quote: "Seeing my actual saving rate every month changed how I think about spending. Simple number, huge impact.",
      name: "Laura K.",
      role: "Freelance Designer",
      stars: 5,
    },
  ];

  return (
    <section style={{ backgroundColor: c.subtle, padding: "88px 0", borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontFamily: B, fontSize: 13, fontWeight: 600, color: c.accent, letterSpacing: "0.07em", textTransform: "uppercase", display: "inline-block", marginBottom: 14 }}>Testimonials</span>
            <h2 style={{ fontFamily: H, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.12, color: c.text, margin: 0 }}>
              Loved by people who<br/>hate spreadsheets.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1}>
              <div style={{
                backgroundColor: c.card,
                border: `1px solid ${c.border}`,
                borderRadius: 16,
                padding: 28,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: r.stars }).map((_, si) => (
                    <svg key={si} width="16" height="16" viewBox="0 0 24 24" fill={c.accent} stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p style={{
                  fontFamily: B, fontSize: 15.5, lineHeight: 1.6,
                  color: c.text, margin: "0 0 24px", flex: 1,
                  fontStyle: "italic",
                }}>"{r.quote}"</p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: c.accentSub, color: c.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, fontFamily: H,
                  }}>{r.name.split(" ").map(w => w[0]).join("")}</div>
                  <div>
                    <div style={{ fontFamily: B, fontSize: 14, fontWeight: 600, color: c.text }}>{r.name}</div>
                    <div style={{ fontFamily: B, fontSize: 12.5, color: c.muted }}>{r.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FAQ — Accordion
   Reference: Airbnb tabbed FAQ
   ═══════════════════════════════════════════ */
function FAQ() {
  const [open, setOpen] = useState(null);

  const items = [
    {
      q: "Is Tacker free?",
      a: "Yes. Tacker is completely free to download and use. We offer a premium plan with advanced features like bank sync and unlimited export, but the core tracking experience is free forever.",
    },
    {
      q: "How does the AI categorization work?",
      a: "When you log a transaction, our AI analyzes the merchant name and amount to suggest a category. It learns from your corrections, so it gets more accurate over time. After a week of use, most transactions are categorized automatically.",
    },
    {
      q: "Is my financial data secure?",
      a: "Absolutely. All data is encrypted end-to-end and stored on your device. We never sell your data, and we don't have access to your bank credentials. Your finances stay private.",
    },
    {
      q: "Does it connect to my bank?",
      a: "The free version is manual entry — which many users prefer for mindful spending. Premium offers optional bank sync through secure open banking APIs so transactions import automatically.",
    },
    {
      q: "What platforms is it available on?",
      a: "Tacker is available on iOS and Android. A web dashboard for viewing your data on desktop is on the roadmap.",
    },
    {
      q: "Can I export my data?",
      a: "Yes. You can export all your transactions as CSV at any time. Your data belongs to you, always.",
    },
  ];

  return (
    <section id="faq" style={{ backgroundColor: c.bg, padding: "88px 0" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontFamily: B, fontSize: 13, fontWeight: 600, color: c.accent, letterSpacing: "0.07em", textTransform: "uppercase", display: "inline-block", marginBottom: 14 }}>FAQ</span>
            <h2 style={{ fontFamily: H, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.12, color: c.text, margin: 0 }}>
              Common questions.
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.04}>
                <div style={{ borderBottom: `1px solid ${c.border}` }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px 0",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{
                      fontFamily: B, fontSize: 16, fontWeight: 600,
                      color: c.text, letterSpacing: "-0.01em",
                      paddingRight: 16,
                    }}>{item.q}</span>
                    <span style={{
                      fontFamily: H, fontSize: 18, fontWeight: 300,
                      color: c.muted,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                      flexShrink: 0,
                      width: 24, height: 24,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>+</span>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? 300 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.35s ease, opacity 0.25s ease",
                    opacity: isOpen ? 1 : 0,
                  }}>
                    <p style={{
                      fontFamily: B, fontSize: 15, lineHeight: 1.6,
                      color: c.sec, margin: 0,
                      paddingBottom: 20,
                      maxWidth: 600,
                    }}>{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FINAL CTA
   Reference: Treasury closing CTA
   ═══════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section style={{
      backgroundColor: c.text,
      padding: "80px 0",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              fontFamily: H,
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: c.card,
              margin: "0 0 16px",
            }}>
              Start tracking in<br/>under a minute.
            </h2>
            <p style={{
              fontFamily: B, fontSize: 17, lineHeight: 1.6,
              color: "rgba(237,235,231,0.7)",
              margin: "0 0 36px",
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              Join thousands of people who finally know where their money goes.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
              <button style={{
                fontFamily: B, fontSize: 15, fontWeight: 600,
                backgroundColor: c.card, color: c.text,
                border: "none", borderRadius: 12,
                padding: "15px 32px", cursor: "pointer",
                letterSpacing: "-0.01em",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}>Download Free</button>
              <button style={{
                fontFamily: B, fontSize: 15, fontWeight: 500,
                backgroundColor: "transparent",
                color: "rgba(237,235,231,0.85)",
                border: "1.5px solid rgba(237,235,231,0.2)",
                borderRadius: 12,
                padding: "14px 28px", cursor: "pointer",
                letterSpacing: "-0.01em",
                transition: "all 0.15s",
              }}>See how it works</button>
            </div>

            {/* Store badges */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              {["App Store", "Google Play"].map(store => (
                <div key={store} style={{
                  backgroundColor: "rgba(237,235,231,0.1)",
                  border: "1px solid rgba(237,235,231,0.15)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontFamily: B, fontSize: 12, fontWeight: 500,
                  color: "rgba(237,235,231,0.7)",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ fontSize: 14 }}>{store === "App Store" ? "▶" : "▷"}</span>
                  {store}
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: B, fontSize: 13,
              color: "rgba(237,235,231,0.45)",
              margin: 0,
            }}>
              No account needed. No credit card. 100% free to start.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   Reference: Anthropic organized footer (simplified)
   ═══════════════════════════════════════════ */
function Footer() {
  const columns = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Changelog", "Roadmap"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Contact", "Careers"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  ];

  return (
    <footer style={{
      backgroundColor: c.bg,
      borderTop: `1px solid ${c.border}`,
      padding: "56px 0 40px",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 48, marginBottom: 48 }}>
          {/* Brand column */}
          <div style={{ minWidth: 200, maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                backgroundColor: c.text,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: c.card, fontSize: 13, fontWeight: 800, fontFamily: H,
              }}>T</div>
              <span style={{ fontFamily: H, fontWeight: 700, fontSize: 16, letterSpacing: "-0.03em", color: c.text }}>Tacker</span>
            </div>
            <p style={{
              fontFamily: B, fontSize: 14, lineHeight: 1.55,
              color: c.muted, margin: "0 0 20px",
            }}>
              AI-powered expense tracking.<br/>Simple, private, free.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                /* X/Twitter */
                <svg key="x" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.muted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16H20L8.267 4H4z"/><path d="M4 20l6.768-6.768"/><path d="M20 4l-6.768 6.768"/>
                </svg>,
                /* Instagram */
                <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.muted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill={c.muted} stroke="none"/>
                </svg>,
              ].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8,
                  backgroundColor: c.subtle,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background-color 0.15s",
                  textDecoration: "none",
                }}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title} style={{ minWidth: 140 }}>
              <div style={{
                fontFamily: B, fontSize: 12, fontWeight: 600,
                color: c.muted, textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 16,
              }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{
                    fontFamily: B, fontSize: 14, fontWeight: 450,
                    color: c.sec, textDecoration: "none",
                    transition: "color 0.15s",
                  }}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${c.border}`,
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <span style={{ fontFamily: B, fontSize: 13, color: c.muted }}>
            © 2026 Tacker. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Cookies"].map(link => (
              <a key={link} href="#" style={{
                fontFamily: B, fontSize: 13, color: c.muted,
                textDecoration: "none", transition: "color 0.15s",
              }}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   PAGE SHELL
   ═══════════════════════════════════════════ */
export default function TackerHomepage() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <Showcase />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (mirror of CSS custom properties)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  navy:       "#0B1220",
  navyRaised: "#121C2E",
  cyan:       "#00D9C0",
  amber:      "#F5A623",
  textPrime:  "#EDF2F7",
  textSec:    "#8B98AC",
  hairline:   "rgba(237,242,247,0.08)",
};

// ─────────────────────────────────────────────────────────────────────────────
// useScrollReveal — Intersection Observer hook for scroll-triggered dividers
// ─────────────────────────────────────────────────────────────────────────────
function useScrollReveal(className = "sid-triggered", threshold = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk) {
      el.classList.add(className);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(className);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [className, threshold]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// ScanDivider — thin horizontal line, scan animation triggers once on scroll
// ─────────────────────────────────────────────────────────────────────────────
function ScanDivider() {
  const ref = useScrollReveal("sid-triggered", 0.5);
  return <div ref={ref} className="sid-scan-divider" aria-hidden="true" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// FaceMeshSVG — Biometric wireframe grid SVG inside open viewfinder
// ─────────────────────────────────────────────────────────────────────────────
function FaceMeshSVG() {
  return (
    <svg
      viewBox="0 0 300 360"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", opacity: 0.65 }}
      aria-hidden="true"
    >
      {/* Outer face oval */}
      <ellipse cx="150" cy="175" rx="105" ry="130" fill="none" stroke={T.cyan} strokeWidth="0.8" strokeOpacity="0.5" />
      <ellipse cx="150" cy="175" rx="82" ry="108" fill="none" stroke={T.cyan} strokeWidth="0.6" strokeOpacity="0.35" />

      {/* Horizontal & vertical grid lines */}
      {[100, 120, 140, 158, 175, 192, 210, 228, 248, 265].map((y) => (
        <line key={y} x1="50" y1={y} x2="250" y2={y} stroke={T.cyan} strokeWidth="0.5" strokeOpacity="0.2" />
      ))}
      {[80, 100, 120, 140, 150, 160, 180, 200, 220].map((x) => (
        <line key={x} x1={x} y1="55" x2={x} y2="305" stroke={T.cyan} strokeWidth="0.5" strokeOpacity="0.2" />
      ))}

      {/* Diagonal cheekbone meshes */}
      <line x1="60" y1="190" x2="115" y2="220" stroke={T.cyan} strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1="240" y1="190" x2="185" y2="220" stroke={T.cyan} strokeWidth="0.6" strokeOpacity="0.3" />

      {/* Eye sockets & pupils */}
      <ellipse cx="112" cy="155" rx="22" ry="13" fill="none" stroke={T.cyan} strokeWidth="1.2" strokeOpacity="0.75" />
      <ellipse cx="188" cy="155" rx="22" ry="13" fill="none" stroke={T.cyan} strokeWidth="1.2" strokeOpacity="0.75" />
      <circle cx="112" cy="155" r="6" fill="none" stroke={T.cyan} strokeWidth="1" strokeOpacity="0.9" />
      <circle cx="188" cy="155" r="6" fill="none" stroke={T.cyan} strokeWidth="1" strokeOpacity="0.9" />
      <circle cx="112" cy="155" r="2" fill={T.cyan} fillOpacity="0.8" />
      <circle cx="188" cy="155" r="2" fill={T.cyan} fillOpacity="0.8" />

      {/* Nose & Mouth */}
      <path d="M 138 155 L 135 195 Q 150 205 165 195 L 162 155" fill="none" stroke={T.cyan} strokeWidth="0.8" strokeOpacity="0.5" />
      <path d="M 122 230 Q 150 248 178 230" fill="none" stroke={T.cyan} strokeWidth="1.2" strokeOpacity="0.7" />

      {/* Viewfinder crosshairs */}
      <line x1="150" y1="20" x2="150" y2="340" stroke={T.cyan} strokeWidth="0.4" strokeDasharray="3 3" strokeOpacity="0.25" />
      <line x1="20" y1="175" x2="280" y2="175" stroke={T.cyan} strokeWidth="0.4" strokeDasharray="3 3" strokeOpacity="0.25" />

      {/* Biometric landmark dots */}
      {[
        [110,138],[188,138],[112,155],[188,155],[122,230],[178,230],[150,248],
        [135,195],[165,195],[90,210],[210,210],[100,265],[200,265]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={T.cyan} fillOpacity="0.6" />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroImagePlaceholder — Open Corner-Bracket Viewfinder Frame
// ════════════════════════════════════════════════════════════════════════════
// IMAGE PLACEHOLDER — swap src here when ready
// File:      apps/frontend/src/pages/HomePage.jsx
// Component: HeroImagePlaceholder  (search "HeroImagePlaceholder")
// Frame:     Open Viewfinder with 4 L-shaped corner brackets (no dashed box)
// Dimensions: 520×600 px
// ════════════════════════════════════════════════════════════════════════════
function HeroImagePlaceholder() {
  return (
    <div
      className="sid-viewfinder-frame"
      style={{ height: 580, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      aria-label="Biometric verification viewfinder placeholder"
    >
      {/* Four Open Corner Brackets (NO dashed box border) */}
      <div className="sid-bracket sid-bracket-tl" aria-hidden="true" />
      <div className="sid-bracket sid-bracket-tr" aria-hidden="true" />
      <div className="sid-bracket sid-bracket-bl" aria-hidden="true" />
      <div className="sid-bracket sid-bracket-br" aria-hidden="true" />

      {/* Animated cyan scan line sweeping vertically */}
      <div className="sid-scan-bar" aria-hidden="true" />

      {/* Top HUD bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 11 }}>
        <span className="sid-mono" style={{ fontSize: "0.68rem", color: T.cyan, letterSpacing: "0.1em" }}>
          [VF // FACE_MESH_01]
        </span>
        <span className="sid-mono" style={{ fontSize: "0.68rem", color: T.cyan, background: "rgba(0,217,192,0.12)", padding: "2px 8px" }}>
          LIVE_STREAM
        </span>
      </div>

      {/* Face mesh wireframe SVG */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <FaceMeshSVG />
      </div>

      {/* Bottom HUD readout & placeholder label */}
      <div style={{ zIndex: 11, background: "rgba(11, 18, 32, 0.85)", padding: "10px 14px", borderLeft: `2px solid ${T.cyan}` }}>
        <p className="sid-mono" style={{ margin: 0, fontSize: "0.65rem", color: T.cyan, opacity: 0.85, letterSpacing: "0.08em" }}>
          &gt; AI-generated showcase image — replace src here
        </p>
        <span className="sid-mono" style={{ fontSize: "0.6rem", color: T.textSec, marginTop: 4, display: "block" }}>
          VECTOR: [0.142, -0.892, 0.441, 0.092]
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DashboardImagePlaceholder — Open Corner-Bracket Viewfinder Frame
// ════════════════════════════════════════════════════════════════════════════
// DASHBOARD IMAGE PLACEHOLDER — swap src here when ready
// File:      apps/frontend/src/pages/HomePage.jsx
// Component: DashboardImagePlaceholder (search "DashboardImagePlaceholder")
// Frame:     Open Viewfinder Frame (1200×560px)
// ════════════════════════════════════════════════════════════════════════════
function DashboardImagePlaceholder() {
  return (
    <div
      className="sid-viewfinder-frame"
      style={{ maxWidth: 1200, height: 520, margin: "0 auto", padding: 24 }}
      aria-label="Admin dashboard screenshot placeholder"
    >
      {/* Four Corner Brackets */}
      <div className="sid-bracket sid-bracket-tl" aria-hidden="true" />
      <div className="sid-bracket sid-bracket-tr" aria-hidden="true" />
      <div className="sid-bracket sid-bracket-bl" aria-hidden="true" />
      <div className="sid-bracket sid-bracket-br" aria-hidden="true" />

      <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Top bar mock */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${T.hairline}`, paddingBottom: 14 }}>
          <span className="sid-mono" style={{ fontSize: "0.75rem", color: T.cyan, fontWeight: 700 }}>
            [SYS // ADMIN_CONSOLE]
          </span>
          <div style={{ flex: 1 }} />
          <span className="sid-mono" style={{ fontSize: "0.65rem", color: T.textSec }}>
            STATUS: ACTIVE_AUDIT
          </span>
        </div>

        {/* Mock stat metrics */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "VERIFIED_TODAY", val: "1,247", c: T.cyan },
            { label: "PENDING_KYC",   val: "38",    c: T.amber },
            { label: "CONFIDENCE_AVG",val: "99.7%", c: "#7ffff4" },
            { label: "BLOCKCHAIN_LOG",val: "100%",  c: T.textSec },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, minWidth: 140, padding: "12px 14px", background: "rgba(237,242,247,0.03)", borderLeft: `2px solid ${s.c}` }}>
              <div className="sid-mono" style={{ fontSize: "1.2rem", fontWeight: 700, color: s.c }}>{s.val}</div>
              <div className="sid-mono" style={{ fontSize: "0.58rem", color: T.textSec, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mock table */}
        <div style={{ flex: 1, background: "rgba(237,242,247,0.02)", padding: 14, border: `1px solid ${T.hairline}` }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 8, borderBottom: `1px solid ${T.hairline}`, paddingBottom: 6 }}>
            {["ID_HASH", "STUDENT_NAME", "MATCH_SCORE", "BLOCK_HEIGHT", "AUDIT"].map((h) => (
              <div key={h} className="sid-mono" style={{ flex: 1, fontSize: "0.55rem", color: T.cyan, fontWeight: 700 }}>{h}</div>
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, r) => (
            <div key={r} style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "center" }}>
              {[0.7, 1, 0.6, 0.9, 0.5].map((w, i) => (
                <div key={i} style={{ flex: 1, height: 6, background: `rgba(139,152,172,${i === 2 ? 0.35 : 0.12})` }} />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom placeholder label */}
        <div style={{ textAlign: "center", paddingTop: 4 }}>
          <p className="sid-mono" style={{ margin: 0, fontSize: "0.65rem", color: T.cyan, opacity: 0.75, letterSpacing: "0.08em" }}>
            &gt; AI-generated showcase image — replace src here
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content data
// ─────────────────────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    code: "SYS.01",
    phase: "Capture",
    description: "Live selfie and government-issued ID captured through the secure browser interface. Liveness validated client-side before submission.",
  },
  {
    code: "SYS.02",
    phase: "Match",
    description: "DeepFace AI computes a 128-dimension face embedding and compares it against the reference vector in under 2 seconds.",
  },
  {
    code: "SYS.03",
    phase: "Cross-check",
    description: "Face match is cross-referenced against Aadhaar and student records. All vectors must align before verdict issuance.",
  },
  {
    code: "SYS.04",
    phase: "Verdict",
    description: "Cryptographically signed Verified Identity token is issued and permanently logged to the immutable blockchain audit trail.",
  },
];

const USE_CASES = [
  {
    tag: "TOUCHPOINT_01",
    label: "Exam Hall Entry",
    description: "Replace manual ID checks with instant face scan at exam gates. Zero queues, zero impersonation.",
  },
  {
    tag: "TOUCHPOINT_02",
    label: "Library Access",
    description: "Students tap in with a selfie. Borrowing history tied to their verified identity automatically.",
  },
  {
    tag: "TOUCHPOINT_03",
    label: "Hostel Check-in",
    description: "Secure hostel gate entry with face recognition — no keys, no cards, no manual sign-ins.",
  },
  {
    tag: "TOUCHPOINT_04",
    label: "Fee Payment Auth",
    description: "High-value campus transactions require live selfie match to prevent fraud at source.",
  },
];

const FOOTER_LINKS = {
  Platform: [
    { label: "Home",      to: "/" },
    { label: "Sign In",   to: "/login" },
    { label: "Register",  to: "/register" },
    { label: "Dashboard", to: "/dashboard" },
  ],
  Features: ["KYC Verification", "Face Authentication", "Digital Student ID", "Blockchain Audit", "Admin Dashboard"],
  "Use Cases": ["Exam Hall Entry", "Library Access", "Hostel Check-in", "Fee Payment Auth"],
  "Built With": ["FastAPI", "React + MUI", "DeepFace AI", "Hardhat + Solidity", "SQLAlchemy"],
};

// ─────────────────────────────────────────────────────────────────────────────
// HomePage — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: T.navy, color: T.textPrime }}>

      {/* ── HERO SECTION (Asymmetric Terminal/Viewfinder Structure) ────── */}
      <section
        id="sid-hero"
        style={{ paddingTop: 90, paddingBottom: 80, position: "relative", overflow: "hidden" }}
      >
        {/* Background ambient lighting */}
        <div className="sid-orb sid-orb-1" />
        <div className="sid-orb sid-orb-2" />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

          {/* Asymmetric Hero Grid (Text Left-heavy, Scan Visual Overlaps Right) */}
          <div className="sid-hero-grid">

            {/* Left: Terminal Readout + Headline + Bracket Buttons */}
            <div>
              {/* Terminal Status Line (replaces generic pill badge) */}
              <div className="sid-terminal-status">
                <span className="sid-pulse-dot" />
                <span>&gt; SYSTEM: BIOMETRIC_AI — ACTIVE</span>
              </div>

              {/* Headline — Asymmetric, left-aligned, tight display spacing */}
              <h1
                className="sid-display"
                style={{
                  fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                  margin: "0 0 24px",
                  maxWidth: 580,
                }}
              >
                Verify Student Identity.{" "}
                <span style={{ color: T.cyan }}>
                  Eliminate Impersonation.
                </span>
              </h1>

              {/* Subheadline — preserved verbatim */}
              <p
                style={{
                  fontSize: "1.05rem",
                  color: T.textSec,
                  lineHeight: 1.7,
                  maxWidth: 500,
                  margin: "0 0 40px",
                }}
              >
                SECUREID combines face recognition, KYC validation, and a blockchain audit trail to give every student a tamper-proof digital identity — verified in under 2 seconds.
              </p>

              {/* CTA Buttons — Bracket-Cut Buttons (sharp corners with diagonal cut) */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a
                  href={isLoggedIn ? "/dashboard" : "/register"}
                  id="sid-cta-primary"
                  className="sid-btn-bracket"
                >
                  <span>[&gt; {isLoggedIn ? "Go to Dashboard" : "Get Verified Free"}]</span>
                </a>

                <a
                  href="/login"
                  id="sid-cta-secondary"
                  className="sid-btn-bracket-outlined"
                >
                  Sign In
                </a>
              </div>
            </div>

            {/* Right: Open Corner-Bracket Viewfinder + Vertical Ticker Readout */}
            <div className="sid-hero-visual-wrapper">
              <HeroImagePlaceholder />

              {/* Vertical Monospace Readout Ticker (replaces horizontal 3-stat row) */}
              <div className="sid-mono-ticker">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="sid-ticker-item">
                    <span className="sid-ticker-label">LATENCY_INDEX</span>
                    <span className="sid-ticker-value">&lt;2s</span>
                  </div>
                  <div className="sid-ticker-item" style={{ textAlign: "center" }}>
                    <span className="sid-ticker-label">MODEL_ACCURACY</span>
                    <span className="sid-ticker-value">99.7%</span>
                  </div>
                  <div className="sid-ticker-item" style={{ textAlign: "right" }}>
                    <span className="sid-ticker-label">AUDIT_COVERAGE</span>
                    <span className="sid-ticker-value">100%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SCAN DIVIDER ──────────────────────────────────────────────── */}
      <ScanDivider />

      {/* ── TRUSTED BY STRIP (Terminal Monospace Bar) ──────────────────── */}
      <div
        style={{
          background: T.navyRaised,
          borderTop: `1px solid ${T.hairline}`,
          borderBottom: `1px solid ${T.hairline}`,
          padding: "16px 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 32, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <span className="sid-mono" style={{ fontSize: "0.65rem", color: T.cyan, letterSpacing: "0.12em" }}>
            &gt; DEPLOYED_CAMPUSES:
          </span>
          {["VIT Vellore", "BITS Pilani", "NIT Trichy", "SRM Chennai", "Amity University"].map((u) => (
            <span key={u} className="sid-mono" style={{ fontSize: "0.8rem", color: T.textSec, fontWeight: 600 }}>{u}</span>
          ))}
        </div>
      </div>

      {/* ── SCAN DIVIDER ──────────────────────────────────────────────── */}
      <ScanDivider />

      {/* ── HOW IT WORKS (Terminal Step Cards with Corner Brackets) ────── */}
      <section id="sid-how-it-works" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ marginBottom: 56 }}>
            <div className="sid-mono" style={{ fontSize: "0.72rem", color: T.cyan, letterSpacing: "0.14em", marginBottom: 12 }}>
              &gt; VERIFICATION_SEQUENCE
            </div>
            <h2 className="sid-display" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, margin: 0 }}>
              Capture → Match → Cross-check → Verdict
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {HOW_IT_WORKS.map((s) => (
              <div key={s.code} className="sid-card-terminal">
                <div className="sid-bracket sid-bracket-tl" aria-hidden="true" />
                <div className="sid-bracket sid-bracket-tr" aria-hidden="true" />

                <div className="sid-mono" style={{ fontSize: "0.68rem", color: T.cyan, fontWeight: 700, marginBottom: 16 }}>
                  [{s.code} // {s.phase.toUpperCase()}]
                </div>

                <h3 className="sid-display" style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px" }}>
                  {s.phase}
                </h3>

                <p style={{ fontSize: "0.875rem", color: T.textSec, lineHeight: 1.7, margin: 0 }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCAN DIVIDER ──────────────────────────────────────────────── */}
      <ScanDivider />

      {/* ── WHO IT'S FOR (Use Cases with Corner Brackets) ──────────────── */}
      <section id="sid-use-cases" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ marginBottom: 56 }}>
            <div className="sid-mono" style={{ fontSize: "0.72rem", color: T.cyan, letterSpacing: "0.14em", marginBottom: 12 }}>
              &gt; CAMPUS_DEPLOYMENT_MODULES
            </div>
            <h2 className="sid-display" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, margin: 0 }}>
              Built for every campus touchpoint
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {USE_CASES.map((uc) => (
              <div key={uc.tag} className="sid-card-terminal" tabIndex={0} role="article" aria-label={uc.label}>
                <div className="sid-bracket sid-bracket-bl" aria-hidden="true" />
                <div className="sid-bracket sid-bracket-br" aria-hidden="true" />

                <div className="sid-mono" style={{ fontSize: "0.62rem", color: T.cyan, opacity: 0.8, marginBottom: 14 }}>
                  [{uc.tag}]
                </div>

                <h3 className="sid-display" style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 10px" }}>
                  {uc.label}
                </h3>

                <p style={{ fontSize: "0.875rem", color: T.textSec, lineHeight: 1.7, margin: 0 }}>
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCAN DIVIDER ──────────────────────────────────────────────── */}
      <ScanDivider />

      {/* ── DASHBOARD SHOWCASE (Open Corner Viewfinder Frame) ──────────── */}
      <section id="sid-dashboard-showcase" style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <div className="sid-mono" style={{ fontSize: "0.72rem", color: T.cyan, letterSpacing: "0.14em", marginBottom: 12 }}>
              &gt; REALTIME_MONITORING_CONSOLE
            </div>
            <h2 className="sid-display" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, margin: 0 }}>
              Full visibility. Full control.
            </h2>
          </div>

          {/* Enclosed in open corner-bracket viewfinder frame */}
          <DashboardImagePlaceholder />
        </div>
      </section>

      {/* ── SCAN DIVIDER ──────────────────────────────────────────────── */}
      <ScanDivider />

      {/* ── CTA SECTION (Terminal Bracket Cut CTA) ────────────────────── */}
      <section id="sid-cta" style={{ padding: "96px 0", background: "rgba(0,217,192,0.03)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div className="sid-mono" style={{ fontSize: "0.72rem", color: T.cyan, letterSpacing: "0.14em", marginBottom: 16 }}>
            &gt; INITIATE_ENROLLMENT
          </div>

          <h2 className="sid-display" style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 24px" }}>
            Your campus identity, <span style={{ color: T.cyan }}>verified in seconds.</span>
          </h2>

          <p style={{ fontSize: "1rem", color: T.textSec, lineHeight: 1.7, marginBottom: 40 }}>
            Stop manual ID checks. Start secure, instant, AI-powered student verification today — completely free.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={isLoggedIn ? "/dashboard" : "/register"}
              id="sid-footer-cta-primary"
              className="sid-btn-bracket"
              style={{ fontSize: "1rem", padding: "14px 32px" }}
            >
              <span>[&gt; {isLoggedIn ? "Go to Dashboard" : "Create Free Account"}]</span>
            </a>

            {!isLoggedIn && (
              <a
                href="/login"
                id="sid-footer-cta-secondary"
                className="sid-btn-bracket-outlined"
                style={{ fontSize: "1rem", padding: "14px 28px" }}
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER (Terminal Status Footer) ────────────────────────────── */}
      <footer id="sid-footer" style={{ background: T.navyRaised, borderTop: `1px solid ${T.hairline}`, padding: "64px 0 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(4, 1fr)", gap: 32, marginBottom: 48 }}>
            <div>
              <div className="sid-mono" style={{ fontSize: "0.9rem", fontWeight: 700, color: T.cyan, marginBottom: 12 }}>
                &gt; SECUREID_SYSTEM
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: T.textSec, lineHeight: 1.85, maxWidth: 260 }}>
                AI-powered student identity with facial recognition, KYC validation, and blockchain audit trail.
              </p>
              <div className="sid-mono" style={{ marginTop: 14, fontSize: "0.62rem", color: "rgba(139,152,172,0.4)" }}>
                BUILD_HASH: 0xa3f9c1d8…
              </div>
            </div>

            {Object.entries(FOOTER_LINKS).map(([heading, items]) => (
              <div key={heading}>
                <div className="sid-mono" style={{ fontSize: "0.62rem", fontWeight: 700, color: T.cyan, letterSpacing: "0.12em", marginBottom: 16 }}>
                  {heading.toUpperCase()}
                </div>
                {items.map((item) => {
                  const label = typeof item === "string" ? item : item.label;
                  const to    = typeof item === "string" ? null : item.to;
                  return to ? (
                    <RouterLink
                      key={label}
                      to={to}
                      style={{ display: "block", marginBottom: 10, fontSize: "0.82rem", color: T.textSec, textDecoration: "none" }}
                    >
                      {label}
                    </RouterLink>
                  ) : (
                    <span key={label} style={{ display: "block", marginBottom: 10, fontSize: "0.82rem", color: "rgba(139,152,172,0.45)" }}>
                      {label}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${T.hairline}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span className="sid-mono" style={{ fontSize: "0.68rem", color: "rgba(139,152,172,0.4)" }}>
              © 2026 SECUREID. Terminal biometric identity platform.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy", "Terms", "Contact"].map((link) => (
                <span key={link} className="sid-mono" style={{ fontSize: "0.72rem", color: "rgba(139,152,172,0.4)", cursor: "pointer" }}>
                  {link}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

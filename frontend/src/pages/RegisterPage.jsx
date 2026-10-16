import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Check, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import Logo from "../components/Logo";
import { THEME } from "../theme/colors";

const BG = THEME.secondary;
const CARD = "#FFFFFF";
const FIELD = THEME.field;
const FIELD_FOCUS = "#FFFFFF";
const INK = THEME.charcoal;
const INK_SOFT = THEME.textSoft;
const INK_MUTED = THEME.textMuted;
const INK_FAINT = "rgba(32, 37, 34, 0.14)";
const INK_HAIR = THEME.border;
const PRIMARY = THEME.primary;
const PRIMARY_HOVER = THEME.primaryHover;
const PRIMARY_DARK = THEME.primaryDark;
const ACCENT = THEME.accent;

const ROLES = [
  { value: "CUSTOMER", label: "Order Food", desc: "Discover restaurants and track live orders", emoji: "🍽" },
  { value: "RESTAURANT_OWNER", label: "Restaurant Partner", desc: "Manage kitchen orders and digital menu", emoji: "👨‍🍳" },
  { value: "DRIVER", label: "Delivery Partner", desc: "Earn on your route with real-time tracking", emoji: "🛵" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "CUSTOMER" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) return toast.error("Please fill all fields");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await register(form);
      toast.success(res.message || "Account created! Verify your email.");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapStyle = (key) => ({
    position: "relative",
    marginBottom: 16,
  });

  const inputStyle = (key) => ({
    width: "100%",
    padding: "16px 16px 8px",
    background: focused === key ? FIELD_FOCUS : FIELD,
    border: `1.5px solid ${focused === key ? PRIMARY : "transparent"}`,
    borderRadius: 12,
    fontSize: "0.95rem",
    fontFamily: "var(--font-sans)",
    color: INK,
    outline: "none",
    transition: "all 0.2s",
    boxShadow: focused === key ? `0 0 0 4px rgba(23,76,60,0.12)` : "none",
  });

  const labelStyle = (key, value) => ({
    position: "absolute",
    left: 16,
    top: focused === key || value ? 6 : 14,
    fontSize: focused === key || value ? "0.68rem" : "0.85rem",
    color: focused === key ? PRIMARY : INK_MUTED,
    fontFamily: "var(--font-sans)",
    fontWeight: focused === key || value ? 700 : 500,
    textTransform: focused === key || value ? "uppercase" : "none",
    letterSpacing: focused === key || value ? "0.08em" : "0",
    pointerEvents: "none",
    transition: "all 0.18s ease-out",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: "absolute", top: -150, left: "20%", width: 700, height: 700,
        borderRadius: "50%", background: `radial-gradient(circle, rgba(23,76,60,0.1) 0%, transparent 60%)`,
        filter: "blur(80px)", animation: "drift 24s ease-in-out infinite", pointerEvents: "none",
      }} />

      {/* Top Header */}
      <div style={{
        position: "relative", zIndex: 10,
        padding: "24px 36px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Link to="/login" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 999,
          border: `1px solid ${INK_HAIR}`, background: CARD,
          color: INK_SOFT, fontSize: "0.85rem", textDecoration: "none",
          fontWeight: 600, transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = PRIMARY; e.currentTarget.style.color = PRIMARY; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = INK_HAIR; e.currentTarget.style.color = INK_SOFT; }}
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>

        <Logo size="md" />
      </div>

      <div className="register-form-wrap" style={{
        position: "relative", zIndex: 5, maxWidth: 560,
        margin: "0 auto", padding: "20px 24px 60px", width: "100%",
      }}>
        <div style={{ animation: "fade-up 0.6s ease-out both", textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 999,
            background: THEME.primaryLight, border: `1px solid rgba(23,76,60,0.18)`,
            marginBottom: 18,
          }}>
            <span style={{
              fontSize: "0.72rem", color: PRIMARY_DARK,
              textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700,
            }}>Create Your CraveRoute Account</span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-sans)", fontSize: "2.6rem",
            fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em",
            marginBottom: 10, color: INK,
          }}>
            Join Crave<span style={{ color: PRIMARY }}>Route</span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: INK_MUTED, maxWidth: 400, margin: "0 auto" }}>
            Smart food ordering, live driver tracking, and digital wallet checkout.
          </p>
        </div>

        {/* Card Form */}
        <div style={{
          background: CARD, borderRadius: 24,
          padding: "36px 36px 40px", border: `1px solid ${INK_HAIR}`,
          boxShadow: "0 16px 48px rgba(23,76,60,0.08)",
          animation: "fade-up 0.7s ease-out 0.1s both",
        }}>
          <form onSubmit={handleSubmit}>
            {/* Account Role Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontSize: "0.74rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.1em",
                color: INK_MUTED, marginBottom: 10,
              }}>I want to</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ROLES.map((r) => {
                  const sel = form.role === r.value;
                  return (
                    <div
                      key={r.value}
                      onClick={() => setForm({ ...form, role: r.value })}
                      style={{
                        padding: "12px 16px", borderRadius: 14,
                        border: `1.5px solid ${sel ? PRIMARY : INK_HAIR}`,
                        background: sel ? THEME.primaryLight : "#FFFFFF",
                        cursor: "pointer", transition: "all 0.2s",
                        display: "flex", alignItems: "center", gap: 12,
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>{r.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: sel ? PRIMARY_DARK : INK }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: INK_MUTED }}>{r.desc}</div>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        border: `2px solid ${sel ? PRIMARY : INK_HAIR}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: sel ? PRIMARY : "transparent",
                      }}>
                        {sel && <Check size={12} style={{ color: "#FFF" }} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            {[
              { key: "name", label: "Full Name", type: "text", auto: "name" },
              { key: "email", label: "Email Address", type: "email", auto: "email" },
              { key: "phone", label: "Phone Number", type: "tel", auto: "tel" },
              { key: "password", label: "Create Password (min 6 chars)", type: "password", auto: "new-password" },
            ].map((f) => (
              <div key={f.key} style={inputWrapStyle(f.key)}>
                <input
                  id={f.key}
                  type={f.type}
                  value={form[f.key]}
                  onChange={set(f.key)}
                  onFocus={() => setFocused(f.key)}
                  onBlur={() => setFocused(null)}
                  autoComplete={f.auto}
                  required
                  style={inputStyle(f.key)}
                />
                <label htmlFor={f.key} style={labelStyle(f.key, form[f.key])}>{f.label}</label>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "16px", marginTop: 12,
                borderRadius: 14, border: "none",
                background: loading ? INK_FAINT : PRIMARY,
                color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700,
                fontFamily: "var(--font-sans)", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.2s",
                boxShadow: loading ? "none" : `0 8px 24px rgba(23,76,60,0.28)`,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = PRIMARY_HOVER;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = PRIMARY;
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? (
                <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Creating account...</>
              ) : (
                <>Create CraveRoute Account <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: `1px solid ${INK_HAIR}`,
            textAlign: "center", fontSize: "0.86rem", color: INK_MUTED,
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: PRIMARY, textDecoration: "none", fontWeight: 700,
            }}>Sign in →</Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }
        @media (max-width: 600px) {
          .register-form-wrap { padding: 16px 16px 40px !important; }
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import Logo from "../components/Logo";
import { THEME } from "../theme/colors";

const INK = THEME.charcoal;
const INK_SOFT = THEME.textSoft;
const INK_MUTED = THEME.textMuted;
const INK_FAINT = "rgba(32, 37, 34, 0.14)";
const INK_HAIR = THEME.border;
const CARD = "#FFFFFF";
const FIELD = THEME.field;
const FIELD_FOCUS = "#FFFFFF";
const PRIMARY = THEME.primary;
const PRIMARY_HOVER = THEME.primaryHover;
const PRIMARY_DARK = THEME.primaryDark;
const ACCENT = THEME.accent;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name || "friend"}!`);

      // Role-based redirect
      if (user.role === "RESTAURANT_OWNER") {
        navigate("/owner");
      } else if (user.role === "DRIVER" || user.role === "DELIVERY_DRIVER") {
        navigate("/driver");
      } else {
        navigate("/");
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 403 && (data?.message?.includes("verify") || data?.error?.includes("verify"))) {
        toast.error("Please verify your email first");
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data?.message || data?.error || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: THEME.secondary,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%", width: 700, height: 700,
        borderRadius: "50%", background: `radial-gradient(circle, rgba(23,76,60,0.12) 0%, transparent 60%)`,
        filter: "blur(80px)", animation: "drift 20s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%", width: 600, height: 600,
        borderRadius: "50%", background: `radial-gradient(circle, rgba(240,120,85,0.09) 0%, transparent 60%)`,
        filter: "blur(80px)", animation: "drift 24s ease-in-out infinite reverse", pointerEvents: "none",
      }} />

      {/* Top Navbar Logo */}
      <div style={{ position: "relative", zIndex: 10, padding: "28px 48px", display: "flex", alignItems: "center" }}>
        <Logo size="md" showTagline />
      </div>

      {/* Main Grid */}
      <div className="login-grid" style={{
        position: "relative", zIndex: 5, maxWidth: 1260, margin: "0 auto",
        padding: "20px 48px 60px",
        display: "grid", gridTemplateColumns: "1.15fr 1fr",
        gap: 72, alignItems: "center", minHeight: "calc(100vh - 160px)",
      }}>
        {/* Left Editorial Column */}
        <div style={{ animation: "fade-up 0.7s ease-out both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 16px", borderRadius: 999, background: THEME.primaryLight,
            border: `1px solid rgba(23,76,60,0.18)`, marginBottom: 26,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: PRIMARY,
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            <span style={{
              fontSize: "0.72rem", color: PRIMARY_DARK, textTransform: "uppercase",
              letterSpacing: "0.14em", fontWeight: 700,
            }}>
              AI-Powered Real-Time Food Delivery
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-sans)", fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)",
            fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.035em", marginBottom: 24, color: INK,
          }}>
            Craving great food?<br />
            <span style={{ color: PRIMARY }}>
              Delivered on route.
            </span>
          </h1>

          <p style={{ fontSize: "1.08rem", color: INK_SOFT, maxWidth: 460, lineHeight: 1.6, marginBottom: 44 }}>
            Experience intelligent ordering with CraveRoute AI. Track your driver's live GPS route sub-second, and checkout instantly with your digital wallet.
          </p>

          <div style={{ display: "flex", gap: 0, paddingTop: 26, borderTop: `1px solid ${INK_HAIR}` }}>
            {[
              { num: "500+", label: "Partner Kitchens", suffix: "", color: PRIMARY },
              { num: "28",  label: "Avg. Delivery", suffix: "min", color: ACCENT },
              { num: "4.9", label: "App Rating",   suffix: "★",  color: THEME.star },
            ].map((s, i) => (
              <div key={s.label} style={{
                flex: 1,
                borderLeft: i > 0 ? `1px solid ${INK_HAIR}` : "none",
                paddingLeft: i > 0 ? 28 : 0,
                animation: `fade-up 0.6s ease-out ${0.2 + i * 0.1}s both`,
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{
                    fontFamily: "var(--font-sans)", fontSize: "2.1rem", fontWeight: 800,
                    color: INK, letterSpacing: "-0.02em",
                  }}>{s.num}</span>
                  {s.suffix && <span style={{ fontSize: "0.9rem", color: s.color, fontWeight: 700 }}>{s.suffix}</span>}
                </div>
                <div style={{
                  fontSize: "0.72rem", color: INK_MUTED, textTransform: "uppercase",
                  letterSpacing: "0.08em", marginTop: 4, fontWeight: 600,
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Card */}
        <div style={{ animation: "fade-up 0.8s ease-out 0.1s both" }}>
          <div style={{
            background: CARD, borderRadius: 24,
            padding: "48px 44px", border: `1px solid ${INK_HAIR}`,
            boxShadow: "0 16px 48px rgba(23,76,60,0.08)",
            position: "relative",
          }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontFamily: "var(--font-sans)", fontSize: "1.9rem",
                fontWeight: 800, color: INK, letterSpacing: "-0.02em", marginBottom: 8,
              }}>Welcome back</h2>
              <p style={{ fontSize: "0.9rem", color: INK_MUTED }}>
                Sign in to CraveRoute to track orders and discover restaurants.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Email Field */}
              <div>
                <label style={{
                  display: "block", fontSize: "0.74rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, marginBottom: 8,
                }}>Email address</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    style={{
                      width: "100%", padding: "14px 16px 14px 44px",
                      background: focused === "email" ? FIELD_FOCUS : FIELD,
                      border: `1.5px solid ${focused === "email" ? PRIMARY : "transparent"}`,
                      borderRadius: 12, fontSize: "0.95rem", color: INK, outline: "none",
                      transition: "all 0.2s",
                      boxShadow: focused === "email" ? `0 0 0 4px rgba(23,76,60,0.12)` : "none",
                    }}
                  />
                  <Mail size={18} style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: focused === "email" ? PRIMARY : INK_MUTED, transition: "color 0.2s",
                  }} />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{
                    fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.1em", color: INK_MUTED,
                  }}>Password</label>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    style={{
                      width: "100%", padding: "14px 44px 14px 44px",
                      background: focused === "pass" ? FIELD_FOCUS : FIELD,
                      border: `1.5px solid ${focused === "pass" ? PRIMARY : "transparent"}`,
                      borderRadius: 12, fontSize: "0.95rem", color: INK, outline: "none",
                      transition: "all 0.2s",
                      boxShadow: focused === "pass" ? `0 0 0 4px rgba(23,76,60,0.12)` : "none",
                    }}
                  />
                  <Lock size={18} style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: focused === "pass" ? PRIMARY : INK_MUTED, transition: "color 0.2s",
                  }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: INK_MUTED,
                      display: "flex", padding: 4,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "15px", borderRadius: 14, border: "none",
                  background: loading ? INK_FAINT : PRIMARY,
                  color: "#FFFFFF", fontSize: "0.95rem", fontWeight: 700,
                  fontFamily: "var(--font-sans)", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  marginTop: 8, transition: "all 0.2s",
                  boxShadow: loading ? "none" : `0 6px 20px rgba(23,76,60,0.28)`,
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
                  <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Signing in...</>
                ) : (
                  <>Sign in to CraveRoute <ArrowRight size={17} /></>
                )}
              </button>
            </form>

            {/* Footer switch */}
            <div style={{ marginTop: 28, textAlign: "center", fontSize: "0.88rem", color: INK_MUTED }}>
              New to CraveRoute?{" "}
              <Link to="/register" style={{
                color: PRIMARY, textDecoration: "none", fontWeight: 700,
              }}>
                Create an account →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
        @media (max-width: 900px) {
          .login-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 20px 24px 60px !important; }
        }
      `}</style>
    </div>
  );
}

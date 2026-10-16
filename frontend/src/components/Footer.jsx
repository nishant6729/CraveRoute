import { Link } from "react-router-dom";
import { ShoppingBag, MapPin, Wallet, Heart, Shield, HelpCircle, Compass } from "lucide-react";
import Logo from "./Logo";
import { THEME } from "../theme/colors";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#10231D",
        color: "rgba(255,255,255,0.6)",
        padding: "54px 24px 32px",
        marginTop: "auto",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 40,
          marginBottom: 44,
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <Logo size="md" variant="light" />
          </div>
          <p
            style={{
              fontSize: "0.86rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 290,
              marginBottom: 12,
            }}
          >
            AI-Powered Food Delivery & Real-Time Tracking Platform. Smart Ordering. Seamless Delivery.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(240, 120, 85, 0.15)",
                color: THEME.accent,
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: THEME.accent,
                }}
              />
              CraveRoute AI Active
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 16,
            }}
          >
            Explore
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { to: "/", label: "Home" },
              { to: "/search", label: "Search Restaurants" },
              { to: "/orders", label: "Order Tracking" },
              { to: "/profile", label: "Account Profile" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Account & Services */}
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 16,
            }}
          >
            Services & Wallet
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { to: "/wallet", label: "Digital Wallet", icon: Wallet },
              { to: "/addresses", label: "Saved Addresses", icon: MapPin },
              { to: "/orders", label: "Live Orders", icon: ShoppingBag },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                style={{
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
                }
              >
                <l.icon size={14} style={{ color: THEME.accent }} /> {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact & Support */}
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 16,
            }}
          >
            Support & Connect
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span>📧 support@craveroute.app</span>
            <span>📱 +91 98765 43210</span>
            <span>📍 Real-Time Tracking & Delivery</span>
            <div style={{ marginTop: 6, fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
              Fast · Fresh · Smart Delivery
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
          © {new Date().getFullYear()} CraveRoute. Built with{" "}
          <Heart
            size={12}
            fill={THEME.accent}
            color={THEME.accent}
            style={{ display: "inline", verticalAlign: "-1px" }}
          />{" "}
          for smart food delivery.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Service", "Help Center"].map((t) => (
            <span
              key={t}
              style={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
              }
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

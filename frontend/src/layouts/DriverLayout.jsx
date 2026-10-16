import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, History, LogOut, Navigation } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useDriverStore } from "../store/driverStore";
import { THEME } from "../theme/colors";

const BG = THEME.secondary;
const INK = THEME.charcoal;
const INK_MUTED = THEME.textMuted;
const INK_HAIR = THEME.hairline;
const PRIMARY = THEME.primary;
const SUCCESS = THEME.success;

export default function DriverLayout() {
  const { user, logout } = useAuthStore();
  const { isOnline } = useDriverStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        flexDirection: "column",
        maxWidth: 540,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Top status bar */}
      <div
        style={{
          background: isOnline
            ? `linear-gradient(135deg, ${THEME.primaryHover}, ${THEME.primaryDark})`
            : "#1A221E",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          transition: "background 0.4s",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontWeight: 800,
              fontSize: "0.85rem",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            CR
          </div>
          <div>
            <div
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              Crave<span style={{ color: THEME.accent }}>Route</span>
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.65)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              Driver Companion
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              background: isOnline
                ? "rgba(74,222,128,0.2)"
                : "rgba(255,255,255,0.08)",
              border: `1px solid ${
                isOnline ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.12)"
              }`,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: isOnline ? "#4ADE80" : "#94A3B8",
                boxShadow: isOnline ? "0 0 0 3px rgba(74,222,128,0.3)" : "none",
                animation: isOnline ? "pulse-dot 2s infinite" : "none",
              }}
            />
            <span
              style={{
                fontSize: "0.72rem",
                color: isOnline ? "#4ADE80" : "rgba(255,255,255,0.5)",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "D"}
          </div>
        </div>
      </div>

      {/* Page content */}
      <main style={{ flex: 1, padding: "0 0 80px 0" }}>
        <Outlet />
      </main>

      {/* Bottom nav bar — mobile style */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 540,
          background: "#FFFFFF",
          borderTop: `1px solid ${THEME.border}`,
          display: "flex",
          zIndex: 50,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}
      >
        {[
          { to: "/driver", label: "Deliveries", Icon: Home },
          { to: "/driver/history", label: "History", Icon: History },
        ].map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/driver"}
            style={({ isActive }) => ({
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 0 8px",
              textDecoration: "none",
              gap: 4,
              color: isActive ? PRIMARY : INK_MUTED,
              borderTop: `2px solid ${isActive ? PRIMARY : "transparent"}`,
              transition: "all 0.15s",
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 0 8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            gap: 4,
            color: "#FC8181",
            borderTop: "2px solid transparent",
          }}
        >
          <LogOut size={21} strokeWidth={1.8} />
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              fontFamily: "var(--font-sans)",
            }}
          >
            Sign out
          </span>
        </button>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50%      { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }
      `}</style>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { THEME } from "../theme/colors";

export default function Logo({
  size = "md", // "sm", "md", "lg"
  variant = "dark", // "dark" (for light backgrounds), "light" (for dark backgrounds)
  showTagline = false,
  asLink = true,
  className = "",
  style = {},
}) {
  const iconSizes = {
    sm: 28,
    md: 34,
    lg: 42,
  };

  const textSizes = {
    sm: "1.1rem",
    md: "1.3rem",
    lg: "1.65rem",
  };

  const isLight = variant === "light";
  const iconSize = iconSizes[size] || 34;
  const textSize = textSizes[size] || "1.3rem";

  const content = (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "lg" ? 12 : 10,
        textDecoration: "none",
        userSelect: "none",
        ...style,
      }}
    >
      {/* CraveRoute Icon Mark */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: size === "sm" ? 8 : size === "lg" ? 12 : 10,
          background: `linear-gradient(135deg, ${THEME.primaryHover} 0%, ${THEME.primary} 60%, ${THEME.primaryDark} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: isLight
            ? "0 4px 14px rgba(0,0,0,0.3)"
            : `0 4px 14px rgba(23,76,60,0.22)`,
          border: isLight
            ? "1px solid rgba(255,255,255,0.15)"
            : `1px solid rgba(23,76,60,0.2)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width={iconSize * 0.65}
          height={iconSize * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle route line */}
          <path
            d="M4 18C7 18 8 13 12 13C16 13 17 8 20 8"
            stroke="#FAF7F0"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Starting dot */}
          <circle cx="4" cy="18" r="2" fill="#FAF7F0" />
          {/* Destination pin / accent pulse */}
          <circle cx="20" cy="8" r="3" fill="#F07855" />
          <circle cx="20" cy="8" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: textSize,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span style={{ color: isLight ? "#FFFFFF" : THEME.charcoal }}>
            Crave
          </span>
          <span style={{ color: isLight ? THEME.accent : THEME.primary }}>
            Route
          </span>
          <span
            style={{
              color: THEME.accent,
              fontSize: "1.15em",
              marginLeft: 1,
            }}
          >
            .
          </span>
        </div>
        {showTagline && (
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: isLight ? "rgba(255,255,255,0.6)" : THEME.textMuted,
              textTransform: "uppercase",
              marginTop: 3,
            }}
          >
            Smart Ordering · Seamless Delivery
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return content;
}

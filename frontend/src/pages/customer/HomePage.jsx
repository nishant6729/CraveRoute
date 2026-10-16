import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star, Clock, TrendingUp, Flame, ChefHat, Zap, Sparkles,
  Search, ArrowRight, ShieldCheck, Bike, Award
} from "lucide-react";
import { useRestaurantStore } from "../../store/restaurantStore";
import { useAuthStore } from "../../store/authStore";
import { THEME } from "../../theme/colors";

const CUISINES = [
  { label: "All",          emoji: "🍽" },
  { label: "North Indian", emoji: "🍛" },
  { label: "South Indian", emoji: "🥘" },
  { label: "Chinese",      emoji: "🥡" },
  { label: "Biryani",      emoji: "🍚" },
  { label: "Italian",      emoji: "🍕" },
  { label: "Desserts",     emoji: "🍮" },
  { label: "Continental",  emoji: "🥗" },
];

const PROMPTS = [
  "Smart Ordering · Real-Time Delivery Tracking ⚡",
  "AI-curated recommendations based on your cravings 🤖",
  "Fresh kitchen favorites delivered in under 30 minutes 🛵",
  "Zero delivery fee on your first 3 CraveRoute orders 🎉",
  "Track every turn from kitchen prep to your doorstep 📍",
];

const palettes = [
  { bg: "#EBF3F0", accent: THEME.primary },
  { bg: "#FDF1ED", accent: THEME.accent },
  { bg: "#FAF7F0", accent: THEME.charcoal },
  { bg: "#F3EFE6", accent: THEME.primaryHover },
];

const paletteFor = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { topRated, nearby, loading, fetchTopRated, fetchNearby } = useRestaurantStore();
  const [cuisine, setCuisine] = useState("All");
  const [promptIdx, setPromptIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTopRated();
    fetchNearby();
  }, []);

  // Rotate catchy prompt every 3.5s
  useEffect(() => {
    const t = setInterval(() => setPromptIdx((i) => (i + 1) % PROMPTS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const all = useMemo(() => {
    const m = new Map();
    [...topRated, ...nearby].forEach((r) => m.set(r.restaurantId, r));
    return Array.from(m.values());
  }, [topRated, nearby]);

  const featured = topRated[0];
  const others = useMemo(
    () => all.filter((r) => r.restaurantId !== featured?.restaurantId),
    [all, featured]
  );
  const filtered = useMemo(
    () => (cuisine === "All" ? others : others.filter((r) => r.cuisineType === cuisine)),
    [others, cuisine]
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div style={{ paddingBottom: 100, position: "relative" }}>
      {/* ── Ambient Glows ── */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -140,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(23,76,60,0.08) 0%, transparent 68%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 360,
          left: -160,
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(240,120,85,0.07) 0%, transparent 70%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* ── HERO SECTION ── */}
      <section style={{ marginBottom: 44, animation: "fade-up 0.5s ease-out both" }}>
        {/* Live Status Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: THEME.primaryLight,
            border: `1px solid rgba(23,76,60,0.15)`,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: THEME.primary,
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              color: THEME.primaryDark,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontWeight: 700,
            }}
          >
            Live Delivery · Bhopal Express Route
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            color: THEME.charcoal,
            marginBottom: 14,
          }}
        >
          Good {greeting},{" "}
          <span
            style={{
              color: THEME.primary,
              display: "inline-block",
            }}
          >
            {user?.name?.split(" ")?.[0] || "Friend"}
          </span>
        </h1>

        {/* Dynamic Tagline Prompt */}
        <div style={{ minHeight: 28, overflow: "hidden", marginBottom: 24 }}>
          <p
            key={promptIdx}
            style={{
              fontSize: "1.05rem",
              color: THEME.textMuted,
              lineHeight: 1.5,
              fontWeight: 500,
              animation: "slide-up 0.35s ease-out both",
            }}
          >
            {PROMPTS[promptIdx]}
          </p>
        </div>

        {/* Quick Search Bar within Hero */}
        <form
          onSubmit={handleHeroSearch}
          style={{
            maxWidth: 620,
            display: "flex",
            alignItems: "center",
            background: "#FFFFFF",
            borderRadius: 16,
            border: `1.5px solid ${THEME.border}`,
            padding: "6px 8px 6px 18px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
            marginBottom: 28,
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = THEME.primary;
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(23,76,60,0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = THEME.border;
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.04)";
          }}
        >
          <Search size={18} style={{ color: THEME.textMuted, marginRight: 10, flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines, butter chicken, biryani..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "0.95rem",
              color: THEME.charcoal,
              fontFamily: "var(--font-sans)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 22px",
              borderRadius: 12,
              border: "none",
              background: THEME.primary,
              color: "#FFFFFF",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = THEME.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = THEME.primary)}
          >
            <span>Explore</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Quick stats badges */}
        <div className="home-stats" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[
            { num: "28", suffix: "min", label: "Average Delivery", icon: "⚡" },
            { num: "4.9", suffix: "★", label: "Customer Satisfaction", icon: "⭐" },
            { num: "100%", suffix: "", label: "Verified Kitchens", icon: "🌱" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                animation: `fade-up 0.5s ease-out ${0.15 + i * 0.08}s both`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: THEME.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                }}
              >
                {s.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: THEME.charcoal,
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: THEME.accent,
                      marginLeft: 2,
                    }}
                  >
                    {s.suffix}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: THEME.textMuted,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginTop: 3,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CUISINE FILTER ── */}
      <section style={{ marginBottom: 40 }}>
        <div
          style={{
            fontSize: "0.72rem",
            color: THEME.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          Explore by Cuisine
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            paddingBottom: 6,
            scrollbarWidth: "none",
          }}
        >
          {CUISINES.map((c) => {
            const active = cuisine === c.label;
            return (
              <button
                key={c.label}
                onClick={() => setCuisine(c.label)}
                style={{
                  padding: "9px 18px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  border: `1.5px solid ${active ? THEME.primary : THEME.border}`,
                  background: active ? THEME.primary : "#FFFFFF",
                  color: active ? "#FFFFFF" : THEME.charcoal,
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.86rem",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: active
                    ? `0 4px 14px rgba(23,76,60,0.25)`
                    : "0 1px 3px rgba(0,0,0,0.03)",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED RESTAURANT ── */}
      {featured && (
        <section style={{ marginBottom: 48 }}>
          <FeaturedCard
            restaurant={featured}
            onClick={() => navigate(`/restaurants/${featured.restaurantId}`)}
          />
        </section>
      )}

      {/* ── OFFERS STRIP ── */}
      <OffersStrip />

      {/* ── POPULAR GRID ── */}
      <section style={{ marginTop: 48 }}>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TrendingUp size={20} style={{ color: THEME.primary }} />
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.65rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: THEME.charcoal,
              }}
            >
              Popular on CraveRoute
            </h2>
          </div>
          {filtered.length > 0 && (
            <span
              style={{
                fontSize: "0.82rem",
                color: THEME.textMuted,
                fontWeight: 600,
              }}
            >
              {filtered.length} kitchen{filtered.length !== 1 ? "s" : ""} available
            </span>
          )}
        </div>

        {loading && filtered.length === 0 ? (
          <GridSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState cuisine={cuisine} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: 24,
            }}
          >
            {filtered.map((r, i) => (
              <RestaurantCard
                key={r.restaurantId}
                restaurant={r}
                index={i}
                onClick={() => navigate(`/restaurants/${r.restaurantId}`)}
              />
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes fade-up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-up  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @media (max-width: 768px) {
          .home-stats { gap: 18px !important; }
          .featured-card { grid-template-columns: 1fr !important; }
          .featured-card > div:first-child { padding: 24px 20px !important; }
          .featured-card > div:last-child { height: 220px !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Value Offers Strip ── */
function OffersStrip() {
  const offers = [
    { icon: "🎉", title: "Flat 50% Off", sub: "First 3 orders with CraveRoute", bg: "#FDF1ED", accent: THEME.accent },
    { icon: "⚡", title: "Free Express Delivery", sub: "On orders above ₹299", bg: "#EBF3F0", accent: THEME.primary },
    { icon: "💳", title: "₹100 Wallet Reward", sub: "Instant cashback into CraveWallet", bg: "#FAF7F0", accent: THEME.charcoal },
    { icon: "🤖", title: "CraveRoute AI", sub: "Order directly via smart voice or chat", bg: "#EBF3F0", accent: THEME.primaryDark },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 14,
        marginBottom: 8,
      }}
    >
      {offers.map((o, i) => (
        <div
          key={i}
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            cursor: "pointer",
            border: `1px solid ${THEME.border}`,
            transition: "all 0.2s",
            animation: `fade-up 0.4s ease-out ${i * 0.05}s both`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
            e.currentTarget.style.borderColor = THEME.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
            e.currentTarget.style.borderColor = THEME.border;
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: o.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              flexShrink: 0,
            }}
          >
            {o.icon}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.92rem", color: o.accent }}>
              {o.title}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: THEME.textMuted,
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              {o.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Featured Card ── */
function FeaturedCard({ restaurant: r, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const palette = paletteFor(r.name);

  return (
    <div
      onClick={onClick}
      className="featured-card"
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        background: "#FFFFFF",
        borderRadius: 24,
        border: `1px solid ${THEME.border}`,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 8px 30px rgba(23,76,60,0.08)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(23,76,60,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(23,76,60,0.08)";
      }}
    >
      {/* Left Details */}
      <div
        style={{
          padding: "40px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              background: THEME.primaryLight,
              color: THEME.primary,
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <Flame size={12} color={THEME.accent} />
            Featured Partner · CraveRoute Top Pick
          </div>
          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "2.3rem",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: THEME.charcoal,
              marginBottom: 12,
            }}
          >
            {r.name}
          </h3>
          <p
            style={{
              fontSize: "0.92rem",
              color: THEME.textMuted,
              lineHeight: 1.6,
              marginBottom: 24,
              maxWidth: 400,
            }}
          >
            {r.description ||
              `Experience authentic ${r.cuisineType} dishes prepared freshly with quality ingredients and tracked in real-time.`}
          </p>
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            <HeroMetric
              icon={Star}
              value={r.avgRating > 0 ? Number(r.avgRating).toFixed(1) : "New"}
              label="Rating"
              color={THEME.star}
              filled
            />
            <HeroMetric
              icon={Clock}
              value={`${r.avgDeliveryTimeMins || 28}`}
              suffix="min"
              label="Delivery Time"
              color={THEME.primary}
            />
            <HeroMetric
              value={r.cuisineType}
              label="Cuisine"
              color={THEME.accent}
              textOnly
            />
          </div>
        </div>

        <button
          style={{
            alignSelf: "flex-start",
            padding: "12px 26px",
            borderRadius: 12,
            border: "none",
            background: THEME.primary,
            color: "#FFFFFF",
            fontSize: "0.9rem",
            fontWeight: 700,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: `0 6px 18px rgba(23,76,60,0.25)`,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = THEME.primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = THEME.primary)}
        >
          <span>View Menu & Order</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Right Image */}
      <div
        style={{
          position: "relative",
          minHeight: 320,
          background: THEME.primaryLight,
          overflow: "hidden",
        }}
      >
        {r.imageUrl && !imgError && (
          <img
            src={r.imageUrl}
            alt={r.name}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.4s",
            }}
          />
        )}
        {(!r.imageUrl || imgError) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "8rem",
                fontWeight: 900,
                color: THEME.primary,
                opacity: 0.2,
              }}
            >
              {r.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
        {r.imageUrl && !imgError && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(16,35,29,0.7) 100%)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#FFFFFF",
          }}
        >
          CraveRoute Verified Kitchen
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ icon: Icon, value, suffix, label, color, filled, textOnly }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {Icon ? (
          <Icon size={16} style={{ color }} fill={filled ? color : "none"} />
        ) : (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
            }}
          />
        )}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.1rem",
              fontWeight: 800,
              color: THEME.charcoal,
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          {suffix && (
            <span
              style={{
                fontSize: "0.75rem",
                color,
                fontWeight: 700,
              }}
            >
              {suffix}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: "0.68rem",
            color: THEME.textMuted,
            marginTop: 3,
            letterSpacing: "0.04em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* ── Restaurant Card ── */
function RestaurantCard({ restaurant: r, index, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const palette = paletteFor(r.name);

  return (
    <div
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        border: `1px solid ${THEME.border}`,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.25s ease",
        animation: `fade-up 0.4s ease-out ${index * 0.04}s both`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(23,76,60,0.12)";
        e.currentTarget.style.borderColor = THEME.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
        e.currentTarget.style.borderColor = THEME.border;
      }}
    >
      {/* Image container */}
      <div
        style={{
          height: 185,
          position: "relative",
          background: THEME.secondary,
          overflow: "hidden",
        }}
      >
        {r.imageUrl && !imgError ? (
          <>
            {!imgLoaded && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, ${THEME.secondary} 0%, #FFFFFF 50%, ${THEME.secondary} 100%)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            )}
            <img
              src={r.imageUrl}
              alt={r.name}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: imgLoaded ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            />
          </>
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${palette.bg} 0%, ${palette.accent}25 100%)`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "4.5rem",
                fontWeight: 800,
                color: palette.accent,
                opacity: 0.5,
              }}
            >
              {r.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Closed overlay */}
        {r.isOpen === false && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(32,37,34,0.7)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "0.82rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Currently Closed
          </div>
        )}

        {/* Rating Pill */}
        {r.avgRating > 0 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "4px 9px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.96)",
              color: THEME.charcoal,
              fontSize: "0.76rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <Star size={11} fill={THEME.star} color={THEME.star} />{" "}
            {Number(r.avgRating).toFixed(1)}
          </div>
        )}

        {/* Delivery Time Pill */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            padding: "4px 9px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: THEME.charcoal,
            display: "flex",
            alignItems: "center",
            gap: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Clock size={11} color={THEME.primary} /> {r.avgDeliveryTimeMins || 28} min
        </div>
      </div>

      {/* Card Info */}
      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3
          style={{
            fontSize: "1.08rem",
            fontWeight: 700,
            color: THEME.charcoal,
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {r.name}
        </h3>
        <p
          style={{
            fontSize: "0.82rem",
            color: THEME.textMuted,
            marginBottom: 14,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {r.cuisineType} · {r.address?.split(",")?.[0] || "Nearby"}
        </p>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            paddingTop: 12,
            borderTop: `1px solid ${THEME.border}`,
            fontSize: "0.75rem",
            color: THEME.textMuted,
          }}
        >
          {r.minOrderAmount > 0 && <span>Min order ₹{r.minOrderAmount}</span>}
          {r.totalReviews > 0 && (
            <span style={{ marginLeft: "auto", color: THEME.textMuted, fontSize: "0.72rem" }}>
              {r.totalReviews} ratings
            </span>
          )}
          {r.isPureVeg && (
            <span
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: "0.7rem",
                color: THEME.veg,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  border: `1.5px solid ${THEME.veg}`,
                  borderRadius: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: THEME.veg,
                  }}
                />
              </span>
              Pure Veg
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
        gap: 24,
      }}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            background: "#FFFFFF",
            borderRadius: 18,
            border: `1px solid ${THEME.border}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 185,
              background: `linear-gradient(90deg, ${THEME.secondary} 0%, #FFFFFF 50%, ${THEME.secondary} 100%)`,
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div style={{ padding: 18 }}>
            <div
              style={{
                height: 16,
                width: "65%",
                background: THEME.secondary,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 12,
                width: "45%",
                background: THEME.secondary,
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ cuisine }) {
  return (
    <div
      style={{
        padding: "64px 24px",
        textAlign: "center",
        background: "#FFFFFF",
        borderRadius: 20,
        border: `1.5px dashed ${THEME.border}`,
      }}
    >
      <ChefHat
        size={44}
        style={{ color: THEME.textMuted, margin: "0 auto 14px", display: "block" }}
      />
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          marginBottom: 6,
          color: THEME.charcoal,
        }}
      >
        No {cuisine === "All" ? "kitchens" : `${cuisine} restaurants`} found nearby
      </h3>
      <p
        style={{
          fontSize: "0.88rem",
          color: THEME.textMuted,
          maxWidth: 360,
          margin: "0 auto",
        }}
      >
        Try selecting a different cuisine filter or browse our top picks above.
      </p>
    </div>
  );
}

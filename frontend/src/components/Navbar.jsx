import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  User,
  LogOut,
  MapPin,
  ChevronDown,
  Search,
  X,
  Star,
  Clock,
  Wallet,
  Menu,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useRestaurantStore } from "../store/restaurantStore";
import CartPanel from "./CartPanel";
import Logo from "./Logo";
import { THEME } from "../theme/colors";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchTimerRef = useRef(null);
  const { searchRestaurants } = useRestaurantStore();

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Live search with debounce
  const handleSearchChange = useCallback((e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (q.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/v1/restaurants/search?query=${encodeURIComponent(q.trim())}`,
          {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data.slice(0, 6) : []);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      }
      setSearching(false);
    }, 350);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchResults([]);
      setMobileMenuOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const NAV_LINKS = [
    { to: "/profile", icon: User, label: "My Profile" },
    { to: "/addresses", icon: MapPin, label: "Addresses" },
    { to: "/orders", icon: ShoppingBag, label: "My Orders" },
    { to: "/wallet", icon: Wallet, label: "Wallet" },
  ];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(250, 247, 240, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${THEME.border}`,
          boxShadow: "0 2px 10px rgba(23, 76, 60, 0.03)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* CraveRoute Logo */}
          <Logo size="md" />

          {/* Desktop search bar */}
          <div
            ref={searchRef}
            className="hide-mobile"
            style={{ flex: 1, maxWidth: 460, position: "relative" }}
          >
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: THEME.primary,
                    pointerEvents: "none",
                  }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search restaurants, cuisines, dishes..."
                  style={{
                    width: "100%",
                    padding: "10px 38px 10px 40px",
                    background: "#FFFFFF",
                    borderRadius: 12,
                    border: `1.5px solid ${THEME.primary}`,
                    fontSize: "0.88rem",
                    fontFamily: "var(--font-sans)",
                    color: THEME.charcoal,
                    outline: "none",
                    boxShadow: `0 0 0 3px rgba(23, 76, 60, 0.12), 0 4px 16px rgba(0,0,0,0.06)`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    color: THEME.textMuted,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={16} />
                </button>

                {/* Search dropdown results */}
                {searchQuery.trim().length >= 2 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      right: 0,
                      background: "#FFFFFF",
                      borderRadius: 14,
                      border: `1px solid ${THEME.border}`,
                      boxShadow: "0 16px 40px rgba(23, 76, 60, 0.12)",
                      maxHeight: 400,
                      overflowY: "auto",
                      animation: "scale-in 0.15s ease-out",
                    }}
                  >
                    {searching ? (
                      <div
                        style={{
                          padding: "20px 24px",
                          textAlign: "center",
                          color: THEME.textMuted,
                          fontSize: "0.88rem",
                        }}
                      >
                        Searching CraveRoute...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div style={{ padding: "20px 24px", textAlign: "center" }}>
                        <p
                          style={{
                            color: THEME.textMuted,
                            fontSize: "0.88rem",
                            marginBottom: 8,
                          }}
                        >
                          No results for "{searchQuery}"
                        </p>
                        <button
                          type="submit"
                          style={{
                            padding: "7px 16px",
                            borderRadius: 999,
                            border: "none",
                            background: THEME.primaryLight,
                            color: THEME.primary,
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            fontFamily: "var(--font-sans)",
                            cursor: "pointer",
                          }}
                        >
                          Search all results →
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: 8 }}>
                        {searchResults.map((r) => (
                          <div
                            key={r.restaurantId}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                              setSearchResults([]);
                              navigate(`/restaurants/${r.restaurantId}`);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 14px",
                              borderRadius: 10,
                              cursor: "pointer",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = THEME.secondary)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                flexShrink: 0,
                                background: r.imageUrl
                                  ? `url(${r.imageUrl}) center/cover`
                                  : THEME.primaryLight,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                              }}
                            >
                              {!r.imageUrl && (
                                <span
                                  style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    color: THEME.primary,
                                  }}
                                >
                                  {r.name?.charAt(0)?.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: "0.88rem",
                                  fontWeight: 600,
                                  color: THEME.charcoal,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {r.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: THEME.textMuted,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <span>{r.cuisineType}</span>
                                {r.avgRating > 0 && (
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                    }}
                                  >
                                    <Star
                                      size={9}
                                      fill={THEME.star}
                                      color={THEME.star}
                                    />
                                    {Number(r.avgRating).toFixed(1)}
                                  </span>
                                )}
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Clock size={9} />{" "}
                                  {r.avgDeliveryTimeMins || 30}m
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div
                          style={{
                            borderTop: `1px solid ${THEME.border}`,
                            padding: "8px 14px",
                          }}
                        >
                          <button
                            type="submit"
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: 8,
                              border: "none",
                              background: THEME.primaryLight,
                              color: THEME.primary,
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              fontFamily: "var(--font-sans)",
                              cursor: "pointer",
                            }}
                          >
                            View all results for "{searchQuery}" →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            ) : (
              <button
                onClick={openSearch}
                style={{
                  width: "100%",
                  padding: "10px 16px 10px 40px",
                  background: THEME.field,
                  borderRadius: 12,
                  border: `1.5px solid transparent`,
                  fontSize: "0.88rem",
                  fontFamily: "var(--font-sans)",
                  color: THEME.textMuted,
                  cursor: "text",
                  textAlign: "left",
                  transition: "all 0.2s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = THEME.border;
                  e.currentTarget.style.background = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.background = THEME.field;
                }}
              >
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: THEME.textMuted,
                  }}
                />
                Search restaurants, cuisines, dishes...
              </button>
            )}
          </div>

          {/* Desktop right actions */}
          <div
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 18px",
                borderRadius: 999,
                border: "none",
                background:
                  itemCount > 0 ? THEME.primary : THEME.primaryTint,
                color: itemCount > 0 ? "#FFFFFF" : THEME.primary,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.2s",
                boxShadow:
                  itemCount > 0
                    ? `0 4px 14px rgba(23, 76, 60, 0.28)`
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (itemCount > 0) e.currentTarget.style.background = THEME.primaryHover;
              }}
              onMouseLeave={(e) => {
                if (itemCount > 0) e.currentTarget.style.background = THEME.primary;
              }}
            >
              <ShoppingBag size={16} />
              <span>Cart</span>
              {itemCount > 0 && (
                <span
                  style={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: 999,
                    background: THEME.accent,
                    color: "#FFFFFF",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 6px",
                    animation: "scale-in 0.2s ease-out",
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* User dropdown */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 14px 5px 6px",
                  borderRadius: 999,
                  border: `1.5px solid ${THEME.border}`,
                  background: "#FFFFFF",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = THEME.primary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = THEME.border)
                }
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${THEME.primaryHover}, ${THEME.primary})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: THEME.charcoal,
                    maxWidth: 110,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name?.split(" ")?.[0] || "User"}
                </span>
                <ChevronDown
                  size={14}
                  style={{
                    color: THEME.textMuted,
                    transition: "transform 0.2s",
                    transform: menuOpen ? "rotate(180deg)" : "rotate(0)",
                  }}
                />
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: 220,
                    background: "#FFFFFF",
                    borderRadius: 14,
                    border: `1px solid ${THEME.border}`,
                    boxShadow: "0 14px 36px rgba(23, 76, 60, 0.12)",
                    padding: 6,
                    animation: "scale-in 0.15s ease-out",
                  }}
                >
                  {NAV_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        textDecoration: "none",
                        color: THEME.charcoal,
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = THEME.secondary)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <item.icon size={15} style={{ color: THEME.textMuted }} />
                      {item.label}
                    </Link>
                  ))}
                  <div
                    style={{
                      height: 1,
                      background: THEME.border,
                      margin: "4px 0",
                    }}
                  />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      color: THEME.error,
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = THEME.errorLight)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile right actions */}
          <div
            className="hide-desktop"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            {/* Mobile search */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/search");
              }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "none",
                background: THEME.field,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search size={17} style={{ color: THEME.textMuted }} />
            </button>

            {/* Cart button mobile */}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "none",
                background:
                  itemCount > 0 ? THEME.primary : THEME.field,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBag
                size={17}
                style={{ color: itemCount > 0 ? "#FFFFFF" : THEME.textMuted }}
              />
              {itemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 999,
                    background: THEME.accent,
                    color: "#FFFFFF",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #FAF7F0",
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: `1.5px solid ${
                  mobileMenuOpen ? THEME.primary : THEME.border
                }`,
                background: mobileMenuOpen ? THEME.primaryLight : "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              {mobileMenuOpen ? (
                <X size={17} style={{ color: THEME.primary }} />
              ) : (
                <Menu size={17} style={{ color: THEME.charcoal }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: "12px 18px 20px",
              borderTop: `1px solid ${THEME.border}`,
              background: "#FFFFFF",
              animation: "fade-up 0.2s ease-out",
            }}
          >
            {/* User info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 0 14px",
                borderBottom: `1px solid ${THEME.border}`,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${THEME.primaryHover}, ${THEME.primary})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "1rem",
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: THEME.charcoal,
                  }}
                >
                  {user?.name || "User"}
                </div>
                <div style={{ fontSize: "0.78rem", color: THEME.textMuted }}>
                  {user?.email}
                </div>
              </div>
            </div>

            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 8px",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: THEME.charcoal,
                  fontSize: "0.92rem",
                  fontWeight: 500,
                }}
              >
                <item.icon size={17} style={{ color: THEME.textMuted }} />
                {item.label}
              </Link>
            ))}
            <div
              style={{
                height: 1,
                background: THEME.border,
                margin: "8px 0",
              }}
            />
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 8px",
                borderRadius: 10,
                width: "100%",
                border: "none",
                background: "transparent",
                color: THEME.error,
                fontSize: "0.92rem",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <LogOut size={17} /> Sign out
            </button>
          </div>
        )}
      </nav>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

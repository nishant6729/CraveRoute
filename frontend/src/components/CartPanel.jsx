import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { THEME } from "../theme/colors";

const INK = THEME.charcoal;
const INK_SOFT = THEME.textSoft;
const INK_MUTED = THEME.textMuted;
const INK_HAIR = THEME.border;
const CARD = "#FFFFFF";
const FIELD = THEME.field;
const PRIMARY = THEME.primary;
const PRIMARY_HOVER = THEME.primaryHover;
const PRIMARY_DARK = THEME.primaryDark;
const VEG = THEME.veg;
const NONVEG = THEME.nonveg;

function VegDot({ isVeg }) {
  const c = isVeg ? VEG : NONVEG;
  return (
    <span
      style={{
        width: 11,
        height: 11,
        border: `1.5px solid ${c}`,
        borderRadius: 2,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {isVeg ? (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
      ) : (
        <span
          style={{
            width: 0,
            height: 0,
            borderLeft: "3px solid transparent",
            borderRight: "3px solid transparent",
            borderBottom: `5px solid ${c}`,
          }}
        />
      )}
    </span>
  );
}

export default function CartPanel({ open, onClose }) {
  const navigate = useNavigate();
  const { items, restaurantName, getTotal, getItemCount, updateQuantity, clearCart } = useCartStore();
  const [clearing, setClearing] = useState(false);

  const total = getTotal();
  const itemCount = getItemCount();

  // Fee logic: free delivery above ₹499, else ₹29
  const deliveryFee = total >= 499 ? 0 : 29;
  const grandTotal = total + deliveryFee;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleClear = async () => {
    setClearing(true);
    await clearCart();
    setClearing(false);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(32, 37, 34, 0.4)",
            backdropFilter: "blur(4px)",
            animation: "fade-in 0.2s ease-out",
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 410,
          maxWidth: "100vw",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          background: THEME.secondary,
          boxShadow: "-16px 0 48px rgba(23, 76, 60, 0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 22px 18px",
            background: "#FFFFFF",
            borderBottom: `1px solid ${INK_HAIR}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px rgba(23, 76, 60, 0.2)`,
            }}
          >
            <ShoppingBag size={17} style={{ color: "#FFFFFF" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.18rem",
                fontWeight: 800,
                color: INK,
                letterSpacing: "-0.01em",
              }}
            >
              Your Order
            </h2>
            {restaurantName && (
              <p style={{ fontSize: "0.78rem", color: INK_MUTED, marginTop: 1 }}>
                From {restaurantName}
              </p>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearing}
              style={{
                fontSize: "0.75rem",
                color: THEME.error,
                background: THEME.errorLight,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                padding: "5px 10px",
                borderRadius: 8,
                opacity: clearing ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              background: THEME.secondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} style={{ color: INK_SOFT }} />
          </button>
        </div>

        {/* Free Delivery Banner */}
        {items.length > 0 && (
          <div
            style={{
              margin: "14px 16px 0",
              padding: "10px 14px",
              borderRadius: 10,
              background: deliveryFee === 0 ? THEME.successLight : THEME.primaryLight,
              border: `1px solid ${
                deliveryFee === 0 ? "#BBF7D0" : "rgba(23,76,60,0.18)"
              }`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.8rem",
              color: deliveryFee === 0 ? THEME.success : PRIMARY,
              fontWeight: 700,
            }}
          >
            <Tag size={14} />
            {deliveryFee === 0
              ? "🎉 Free delivery unlocked on this order!"
              : `Add ₹${499 - total} more for FREE delivery`}
          </div>
        )}

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
          {items.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 16,
                paddingBottom: 60,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  border: `1px solid ${INK_HAIR}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag size={32} style={{ color: INK_MUTED }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 800, color: INK, fontSize: "1.05rem", marginBottom: 4 }}>
                  Your cart is empty
                </p>
                <p style={{ fontSize: "0.85rem", color: INK_SOFT }}>
                  Browse menus and add favorite dishes
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "none",
                  background: PRIMARY,
                  color: "#FFFFFF",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  boxShadow: `0 4px 14px rgba(23, 76, 60, 0.25)`,
                }}
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((item, i) => (
                <div
                  key={item.menuItemId}
                  style={{
                    background: CARD,
                    borderRadius: 14,
                    border: `1px solid ${INK_HAIR}`,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    animation: `fade-up 0.25s ease-out ${i * 0.03}s both`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 4,
                      }}
                    >
                      <VegDot isVeg={item.isVeg} />
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: INK,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: PRIMARY,
                        fontFamily: "var(--font-sans)",
                        fontWeight: 800,
                      }}
                    >
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                    {item.quantity > 1 && (
                      <p style={{ fontSize: "0.72rem", color: INK_MUTED, marginTop: 1 }}>
                        ₹{item.price} × {item.quantity}
                      </p>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: THEME.secondary,
                      borderRadius: 10,
                      padding: "4px 6px",
                      border: `1px solid ${INK_HAIR}`,
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        border: "none",
                        background:
                          item.quantity === 1
                            ? THEME.errorLight
                            : THEME.primaryLight,
                        color: item.quantity === 1 ? THEME.error : PRIMARY,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                    >
                      {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                    </button>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 800,
                        color: INK,
                        minWidth: 18,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        border: "none",
                        background: THEME.primaryLight,
                        color: PRIMARY,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div
            style={{
              background: "#FFFFFF",
              borderTop: `1px solid ${INK_HAIR}`,
              padding: "18px 20px 24px",
            }}
          >
            {/* Bill Summary */}
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.86rem",
                  color: INK_SOFT,
                  marginBottom: 8,
                }}
              >
                <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                <span style={{ fontWeight: 700, color: INK }}>₹{total.toFixed(0)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.84rem",
                  color: INK_MUTED,
                  marginBottom: 8,
                }}
              >
                <span>Estimated delivery fee</span>
                <span
                  style={{
                    color: deliveryFee === 0 ? THEME.success : INK,
                    fontWeight: deliveryFee === 0 ? 800 : 600,
                  }}
                >
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div style={{ height: 1, background: INK_HAIR, margin: "10px 0" }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: INK,
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: PRIMARY, fontSize: "1.2rem", fontWeight: 900 }}>
                  ₹{grandTotal.toFixed(0)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: PRIMARY,
                color: "#FFFFFF",
                fontSize: "0.94rem",
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: `0 8px 22px rgba(23, 76, 60, 0.28)`,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = PRIMARY_HOVER;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = PRIMARY;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>Continue to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-up  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in  { from{opacity:0} to{opacity:1} }
      `}</style>
    </>
  );
}

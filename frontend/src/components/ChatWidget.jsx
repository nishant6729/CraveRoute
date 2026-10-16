import { useState, useRef, useEffect } from "react";
import {
  MessageCircle, X, Send, Loader2, Sparkles, Trash2,
  Mic, MicOff, Volume2, VolumeX, AlertCircle, Bot
} from "lucide-react";
import { aiService } from "../services/aiService";
import { useAuthStore } from "../store/authStore";
import { useVoice } from "../hooks/useVoice";
import toast from "react-hot-toast";
import { THEME } from "../theme/colors";

const SUGGESTED_PROMPTS = [
  "Where is my latest order?",
  "How much is in my wallet?",
  "Show me my recent orders",
  "What are the top-rated restaurants?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm CraveRoute AI, your smart delivery assistant. Ask me about your orders, wallet, or restaurants — by typing or by voice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const sentTranscriptRef = useRef("");

  const voice = useVoice({ lang: "en-US" });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open && !voiceMode && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, voiceMode]);

  useEffect(() => {
    if (!voiceMode) return;
    if (!voice.transcript) return;
    if (voice.listening) return;
    if (loading) return;
    if (sentTranscriptRef.current === voice.transcript) return;

    sentTranscriptRef.current = voice.transcript;
    send(voice.transcript);
  }, [voice.transcript, voice.listening, voiceMode, loading]);

  useEffect(() => {
    if (!open) {
      voice.stop();
      voice.cancelSpeech();
    }
  }, [open]);

  useEffect(() => {
    if (!voiceMode) {
      voice.stop();
      voice.cancelSpeech();
    }
  }, [voiceMode]);

  if (!token || (user?.role && user.role !== "CUSTOMER")) {
    return null;
  }

  const send = async (overrideText) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    setLoading(true);

    try {
      const data = await aiService.chat(textToSend, conversationId);
      if (data.conversationId) setConversationId(data.conversationId);

      const reply = data.reply || "Sorry, I couldn't process that.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply,
          tools: data.toolsCalled,
        },
      ]);

      if (voiceMode) {
        voice.speak(reply);
      }
    } catch (err) {
      console.error("AI chat failed:", err);
      const errorMsg =
        err.response?.status === 503 || err.code === "ERR_NETWORK"
          ? "CraveRoute AI service is currently unavailable. Please check if the backend ai-assistant-service is running."
          : err.response?.data?.message || "CraveRoute AI service encountered an error. Please try again shortly.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: errorMsg,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await aiService.clearHistory(conversationId);
      setMessages([
        {
          role: "assistant",
          text: "Conversation cleared. How can CraveRoute AI help you now?",
        },
      ]);
      setConversationId(null);
      toast.success("Chat history cleared");
    } catch {
      toast.error("Couldn't clear history");
    }
  };

  const toggleVoiceMode = () => {
    if (voiceMode) {
      voice.stop();
      voice.cancelSpeech();
      setVoiceMode(false);
    } else {
      if (!voice.supported) {
        toast.error("Voice recognition not supported in this browser");
        return;
      }
      setVoiceMode(true);
      voice.listen();
    }
  };

  const handleMicTap = () => {
    if (voice.listening) {
      voice.stop();
    } else {
      voice.listen();
    }
  };

  return (
    <>
      {/* ── Floating Launcher ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open CraveRoute AI Assistant"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${THEME.primaryHover} 0%, ${THEME.primary} 60%, ${THEME.primaryDark} 100%)`,
            color: "#fff",
            border: "none",
            boxShadow: `0 8px 24px rgba(23, 76, 60, 0.35)`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow = `0 10px 28px rgba(23, 76, 60, 0.45)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(23, 76, 60, 0.35)`;
          }}
        >
          <Bot size={28} strokeWidth={2.1} />
          <span
            style={{
              position: "absolute",
              top: 3,
              right: 3,
              background: THEME.accent,
              color: "#fff",
              fontSize: 9,
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: 10,
              border: "2px solid #FAF7F0",
              letterSpacing: "0.04em",
            }}
          >
            AI
          </span>
        </button>
      )}

      {/* ── Chat panel ──────────────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-label="CraveRoute AI Assistant"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 390,
            maxWidth: "calc(100vw - 32px)",
            height: 590,
            maxHeight: "calc(100vh - 48px)",
            background: "#FFFFFF",
            borderRadius: 20,
            boxShadow: "0 20px 50px rgba(23, 76, 60, 0.22)",
            border: `1px solid ${THEME.border}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
            animation: "fr-slide-up 0.25s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              background: `linear-gradient(135deg, ${THEME.primaryHover} 0%, ${THEME.primary} 70%, ${THEME.primaryDark} 100%)`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <Sparkles size={18} style={{ color: "#FFF" }} />
                {voice.speaking && (
                  <span
                    style={{
                      position: "absolute",
                      inset: -3,
                      border: "2px solid #fff",
                      borderRadius: "50%",
                      animation: "fr-pulse 1.2s ease-out infinite",
                    }}
                  />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: "-0.01em" }}>
                  CraveRoute AI
                </div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>
                  {voiceMode
                    ? voice.listening
                      ? "Listening…"
                      : voice.speaking
                      ? "Speaking…"
                      : "Voice mode • Tap mic to speak"
                    : "Smart Assistant · Powered by Spring AI"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={toggleVoiceMode}
                aria-label={voiceMode ? "Switch to text mode" : "Switch to voice mode"}
                title={voiceMode ? "Switch to text mode" : "Switch to voice mode"}
                style={{
                  ...iconBtn,
                  background: voiceMode ? THEME.accent : "rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
              >
                {voiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={clearHistory}
                aria-label="Clear conversation"
                title="Clear conversation"
                style={iconBtn}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={iconBtn}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              background: THEME.secondary,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m, i) => (
              <Bubble
                key={i}
                role={m.role}
                text={m.text}
                tools={m.tools}
                error={m.error}
              />
            ))}

            {/* Live transcript while user is speaking */}
            {voiceMode && voice.listening && voice.interim && (
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  background: THEME.accentLight,
                  color: THEME.accentDark,
                  borderRadius: 14,
                  fontSize: 13,
                  fontStyle: "italic",
                  border: `1px dashed ${THEME.accent}`,
                }}
              >
                {voice.interim}…
              </div>
            )}

            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: THEME.textMuted,
                  fontSize: 13,
                  padding: "10px 14px",
                  background: "#FFFFFF",
                  borderRadius: 14,
                  border: `1px solid ${THEME.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <Loader2
                  size={15}
                  className="fr-spin"
                  style={{ color: THEME.primary }}
                />
                CraveRoute AI is thinking…
              </div>
            )}
          </div>

          {/* Suggested prompts (only when conversation is fresh and not voice mode) */}
          {messages.length === 1 && !loading && !voiceMode && (
            <div
              style={{
                padding: "8px 14px 10px",
                background: "#FFFFFF",
                borderTop: `1px solid ${THEME.border}`,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                flexShrink: 0,
              }}
            >
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  style={{
                    fontSize: 11.5,
                    padding: "6px 11px",
                    background: THEME.secondary,
                    color: THEME.charcoal,
                    border: `1px solid ${THEME.border}`,
                    borderRadius: 999,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = THEME.primary;
                    e.currentTarget.style.background = THEME.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = THEME.border;
                    e.currentTarget.style.background = THEME.secondary;
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* ── Footer: voice mode shows a big mic; text mode shows input ── */}
          {voiceMode ? (
            <VoiceFooter
              listening={voice.listening}
              speaking={voice.speaking}
              loading={loading}
              onMicTap={handleMicTap}
              onCancelSpeech={voice.cancelSpeech}
            />
          ) : (
            <div
              style={{
                padding: "12px 14px",
                borderTop: `1px solid ${THEME.border}`,
                background: "#FFFFFF",
                display: "flex",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask CraveRoute AI about food, orders, wallet…"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "11px 15px",
                  background: THEME.field,
                  border: `1px solid transparent`,
                  borderRadius: 12,
                  outline: "none",
                  fontSize: 13,
                  color: THEME.charcoal,
                  transition: "border 0.2s, background 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME.primary;
                  e.target.style.background = "#FFFFFF";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "transparent";
                  e.target.style.background = THEME.field;
                }}
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                aria-label="Send message to CraveRoute AI"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background:
                    input.trim() && !loading ? THEME.primary : THEME.hairline,
                  color: "#fff",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fr-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fr-pulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0;   }
        }
        @keyframes fr-mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(240, 120, 85, 0.6); }
          50%      { box-shadow: 0 0 0 14px rgba(240, 120, 85, 0); }
        }
        .fr-spin { animation: fr-spin 1s linear infinite; }
        @keyframes fr-spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

// ── Voice mode footer ─────────────────────────────────────────────────
function VoiceFooter({ listening, speaking, loading, onMicTap, onCancelSpeech }) {
  let label = "Tap mic to speak to CraveRoute AI";
  if (listening) label = "Listening… tap to send";
  else if (speaking) label = "Speaking… tap to interrupt";
  else if (loading) label = "CraveRoute AI is thinking…";

  return (
    <div
      style={{
        padding: "16px 14px 18px",
        borderTop: `1px solid ${THEME.border}`,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
      }}
    >
      <button
        onClick={speaking ? onCancelSpeech : onMicTap}
        disabled={loading}
        aria-label={listening ? "Stop listening" : "Start listening"}
        style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: listening
            ? THEME.accent
            : speaking
            ? THEME.primaryDark
            : `linear-gradient(135deg, ${THEME.primaryHover} 0%, ${THEME.primary} 100%)`,
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: listening ? "fr-mic-pulse 1.4s infinite" : "none",
          transition: "background 0.2s",
          boxShadow: `0 6px 18px rgba(23, 76, 60, 0.25)`,
        }}
      >
        {listening ? (
          <Mic size={26} />
        ) : speaking ? (
          <Volume2 size={26} />
        ) : (
          <MicOff size={26} />
        )}
      </button>
      <div style={{ fontSize: 12, color: THEME.textMuted, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

// ── Single chat bubble ─────────────────────────────────────────────────
function Bubble({ role, text, tools, error }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "85%",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          padding: "11px 15px",
          background: isUser
            ? THEME.primary
            : error
            ? THEME.errorLight
            : "#FFFFFF",
          color: isUser
            ? "#FFFFFF"
            : error
            ? THEME.error
            : THEME.charcoal,
          borderRadius: 14,
          borderBottomRightRadius: isUser ? 3 : 14,
          borderBottomLeftRadius: isUser ? 14 : 3,
          fontSize: 13,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          border: isUser
            ? "none"
            : `1px solid ${error ? THEME.error : THEME.border}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        {text}
      </div>
      {tools && tools.length > 0 && (
        <div
          style={{
            fontSize: 10,
            color: THEME.textMuted,
            paddingLeft: 4,
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          {tools.map((t, i) => (
            <span
              key={i}
              style={{
                background: THEME.primaryLight,
                color: THEME.primary,
                padding: "2px 7px",
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              ⚡ {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const iconBtn = {
  width: 30,
  height: 30,
  borderRadius: 8,
  background: "rgba(255,255,255,0.15)",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.15s",
};

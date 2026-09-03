import { useState, useRef, useEffect } from 'react'
import { askAiAdvisor } from '../services/api.js'

export default function AiChatDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI financial copilot. Ask me anything about your cashflow, budgets, or whether an upcoming purchase fits your savings rate.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userText = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { sender: 'user', text: userText }])
    setLoading(true)

    try {
      const data = await askAiAdvisor(userText)
      setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an issue analyzing that request. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePromptClick = (promptText) => {
    setInput(promptText)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-6px 0 28px rgba(0, 0, 0, 0.16)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eef2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              ✦
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 600 }}>
                Financial Copilot
              </h3>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                  }}
                />
                Live Ledger Analysis
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              color: '#64748b',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            padding: '1.5rem 1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: '#f8fafc',
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '0.9rem 1.2rem',
                borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: m.sender === 'user' ? '#4f46e5' : '#ffffff',
                color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                fontSize: '0.925rem',
                lineHeight: 1.6,
                boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              }}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '0.75rem 1.1rem',
                borderRadius: '16px 16px 16px 4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                color: '#64748b',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ animation: 'spin 1s linear infinite' }}>↻</span> Copilot is calculating...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

   {/* Actionable Prompt Chips */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <span
            style={{
              fontSize: '0.725rem',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Suggested Questions
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handlePromptClick('Can I afford a ₹15,000 purchase this month?')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
              }}
            >
              <span>💡</span>
              <span style={{ color: '#ffffff' }}>Can I afford ₹15,000 purchase?</span>
            </button>

            <button
              type="button"
              onClick={() => handlePromptClick('Where can I cut expenses?')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
              }}
            >
              <span>✂️</span>
              <span style={{ color: '#ffffff' }}>Where can I cut expenses?</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '10px',
            backgroundColor: '#ffffff',
          }}
        >
          <input
            type="text"
            placeholder="Ask about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '11px 15px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
              backgroundColor: '#ffffff',
              color: '#0f172a',
            }}
          />
          <button
            type="submit"
            className="button button-primary"
            disabled={loading || !input.trim()}
            style={{
              padding: '0 20px',
              borderRadius: '10px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { getAiInsights } from '../services/api.js'
import AiChatDrawer from '../components/AiChatDrawer.jsx'

function AiInsights() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)

  const fetchAdvice = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAiInsights()
      setInsights(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch AI insights.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdvice()
  }, [])

  const getRiskBadge = (risk) => {
    const level = risk?.toUpperCase() || 'LOW'
    const badgeStyles = {
      HIGH: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
      MODERATE: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
      LOW: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
    }
    const current = badgeStyles[level] || badgeStyles.LOW

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: '600',
          backgroundColor: current.bg,
          color: current.text,
          border: `1px solid ${current.border}`,
          letterSpacing: '0.025em',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: current.text,
          }}
        />
        {level} RISK
      </span>
    )
  }

  return (
    <section className="page-stack" style={{ gap: '1.75rem' }}>
      {/* Top Banner */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.25rem' }}>🤖</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
              AI Financial Advisor
            </h1>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.925rem' }}>
            Continuous spending analysis and portfolio optimization driven by Gemini.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setIsChatOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
            }}
          >
            <span>💬</span> Ask AI Copilot
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={fetchAdvice}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {loading ? (
              <>
                <svg
                  style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>↻ Refresh Analysis</>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div
          className="card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Evaluating cash flow patterns</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Processing transactions, computing debt-to-savings ratios, and drafting advice...
          </p>
        </div>
      ) : error ? (
        <div className="state-card error-card">{error}</div>
      ) : (
        insights && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Executive Summary Card */}
            <div
              className="card"
              style={{
                position: 'relative',
                padding: '1.75rem 2rem',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                borderLeft: '5px solid #4f46e5',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#eef2ff',
                      color: '#4f46e5',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                    }}
                  >
                    ✦
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 600 }}>
                    Executive Summary
                  </h3>
                </div>
                {getRiskBadge(insights.riskLevel)}
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: '0.975rem',
                  lineHeight: '1.7',
                  color: '#334155',
                  fontWeight: 450,
                }}
              >
                {insights.executiveSummary}
              </p>
            </div>

            {/* Observations & Action Steps Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Spending Observations */}
              <div
                className="card"
                style={{
                  padding: '1.75rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 1.25rem 0',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: '#6366f1' }}>●</span> Key Spending Observations
                </h3>

                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {insights.keyObservations?.map((obs, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#475569',
                      }}
                    >
                      <span style={{ color: '#94a3b8', marginTop: '2px' }}>—</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Next Steps */}
              <div
                className="card"
                style={{
                  padding: '1.75rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 1.25rem 0',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: '#10b981' }}>✓</span> Actionable Recommendations
                </h3>

                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {insights.actionableRecommendations?.map((rec, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#475569',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#ecfdf5',
                          color: '#059669',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      )}

      {/* Slide-over Conversational Copilot */}
      <AiChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </section>
  )
}

export default AiInsights
import React from 'react'

interface ThankYouEmailProps {
  userName?: string
  issuesReported: string[]
  fixesImplemented: string[]
  timeline?: string
}

export const ThankYouEmail = ({ 
  userName = "Valued User",
  issuesReported,
  fixesImplemented,
  timeline = "24-48 hours"
}: ThankYouEmailProps) => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      color: '#333333'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
        padding: '40px 30px',
        textAlign: 'center',
        borderRadius: '12px 12px 0 0'
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '28px',
          margin: '0 0 10px 0',
          fontWeight: '700'
        }}>
          🎉 Thank You for Your Feedback!
        </h1>
        <p style={{
          color: '#f0f9ff',
          fontSize: '16px',
          margin: '0',
          opacity: '0.9'
        }}>
          Your insights help us build a better survey platform
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px 30px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: '#1f2937',
            fontSize: '20px',
            margin: '0 0 15px 0',
            fontWeight: '600'
          }}>
            Hi {userName}! 👋
          </h2>
          <p style={{
            color: '#4b5563',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 20px 0'
          }}>
            We sincerely appreciate you taking the time to report issues and provide feedback on our AI Survey Tool. 
            Your input is invaluable in helping us create the best possible experience for our users.
          </p>
        </div>

        {/* Issues Reported */}
        {issuesReported.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '18px',
              margin: '0 0 15px 0',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center'
            }}>
              🔍 Issues You Reported:
            </h3>
            <ul style={{
              color: '#4b5563',
              fontSize: '15px',
              lineHeight: '1.6',
              margin: '0',
              paddingLeft: '20px'
            }}>
              {issuesReported.map((issue, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fixes Implemented */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#1f2937',
            fontSize: '18px',
            margin: '0 0 15px 0',
            fontWeight: '600'
          }}>
            ✅ Fixes We've Implemented:
          </h3>
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <ul style={{
              color: '#166534',
              fontSize: '15px',
              lineHeight: '1.6',
              margin: '0',
              paddingLeft: '20px'
            }}>
              {fixesImplemented.map((fix, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <strong>{fix}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h4 style={{
            color: '#1e40af',
            fontSize: '16px',
            margin: '0 0 10px 0',
            fontWeight: '600'
          }}>
            ⏰ Implementation Timeline:
          </h4>
          <p style={{
            color: '#1e40af',
            fontSize: '15px',
            margin: '0',
            lineHeight: '1.5'
          }}>
            All these improvements have been deployed and are now live! You should see the changes immediately.
          </p>
        </div>

        {/* Call to Action */}
        <div style={{
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          padding: '25px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h4 style={{
            color: '#1f2937',
            fontSize: '18px',
            margin: '0 0 15px 0',
            fontWeight: '600'
          }}>
            Keep the Feedback Coming! 💭
          </h4>
          <p style={{
            color: '#4b5563',
            fontSize: '15px',
            margin: '0 0 20px 0',
            lineHeight: '1.5'
          }}>
            Your continued feedback helps us prioritize improvements and build features that truly matter to you.
          </p>
          <a 
            href="http://localhost:3000/dashboard" 
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            Try the Improved Dashboard →
          </a>
        </div>

        {/* Closing */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            color: '#4b5563',
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0 0 15px 0'
          }}>
            Thank you again for being such a valuable part of our community. Users like you make our product better every day!
          </p>
          <p style={{
            color: '#4b5563',
            fontSize: '16px',
            margin: '0'
          }}>
            Best regards,<br />
            <strong style={{ color: '#1f2937' }}>The AI Survey Tool Team</strong> 🚀
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '30px',
        textAlign: 'center',
        borderRadius: '0 0 12px 12px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{
          color: '#6b7280',
          fontSize: '13px',
          margin: '0 0 10px 0',
          lineHeight: '1.5'
        }}>
          This email was sent because you reported feedback on our AI Survey Tool.<br />
          If you have any questions, feel free to reach out to our support team.
        </p>
        <div style={{ marginTop: '15px' }}>
          <a 
            href="mailto:support@localhost" 
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '13px',
              marginRight: '15px'
            }}
          >
            Support
          </a>
          <a 
            href="http://localhost:3000" 
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '13px',
              marginRight: '15px'
            }}
          >
            Website
          </a>
          <a 
            href="http://localhost:3000/privacy" 
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '13px'
            }}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}

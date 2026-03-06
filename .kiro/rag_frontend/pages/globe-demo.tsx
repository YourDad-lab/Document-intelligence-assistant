import { InteractiveGlobe } from "../components/ui/interactive-globe";

export default function GlobeDemo() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(15, 23, 42, 0.8)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: '25%',
          width: '384px',
          height: '384px',
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.05)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          minHeight: '500px',
          flexWrap: 'wrap'
        }}>
          {/* Left content */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '3.5rem',
            position: 'relative',
            zIndex: 1,
            minWidth: '300px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '1.5rem',
              width: 'fit-content'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#34d399',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }} />
              All systems operational
            </div>

            <h1 style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '1rem'
            }}>
              Document Intelligence
              <br />
              <span style={{
                background: 'linear-gradient(to right, #60a5fa, #67e8f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Network
              </span>
            </h1>

            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '28rem',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}>
              Powered by advanced RAG technology across multiple data sources.
              Your queries answered from the most relevant documents in milliseconds.
              Drag the globe to explore.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>255</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Documents</p>
              </div>
              <div style={{ width: '1px', height: '2rem', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>&lt;100ms</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Query Time</p>
              </div>
              <div style={{ width: '1px', height: '2rem', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>99.9%</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>Accuracy</p>
              </div>
            </div>
          </div>

          {/* Right — Globe */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            minHeight: '400px',
            minWidth: '300px'
          }}>
            <InteractiveGlobe size={460} />
          </div>
        </div>
      </div>
    </div>
  );
}

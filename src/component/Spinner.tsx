import React from 'react';

const Spinner: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: size }}>
    <div
      style={{
        width: size,
        height: size,
        border: `${size * 0.13}px solid var(--border)`,
        borderTop: `${size * 0.13}px solid var(--accent)`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Spinner; 
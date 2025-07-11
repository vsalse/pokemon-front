import React from 'react';

const icons: Record<string, string> = {
  error: '❌',
  warning: '⚠️',
  success: '✅',
  fatal: '💥',
};

const getColor = (severity: string) => {
  switch (severity) {
    case 'error': return 'linear-gradient(90deg,#ff4f4f 60%,#e2b714 100%)';
    case 'warning': return 'linear-gradient(90deg,#ffe066 60%,#e2b714 100%)';
    case 'success': return 'linear-gradient(90deg,#4fd964 60%,#b7e214 100%)';
    case 'fatal': return 'linear-gradient(90deg,#ff4f4f 60%,#e2b714 100%)';
    default: return 'linear-gradient(90deg,#3b82f6 60%,#8ab4f8 100%)';
  }
};

interface ToastProps {
  message: string;
  severity?: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, severity = 'error', onClose }) => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (!message) return;
    setVisible(true);
    const duration = (severity === 'error' || severity === 'fatal') ? 4000 : 3000;
    const timer = setTimeout(() => setVisible(false), duration - 300);
    const timer2 = setTimeout(onClose, duration);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, [message, onClose, severity]);
  if (!message && !visible) return null;
  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      bottom: 32,
      transform: `translateX(-50%) translateY(${visible ? '0' : '120%'})`,
      opacity: visible ? 1 : 0,
      transition: 'transform 0.4s cubic-bezier(.4,1.3,.6,1), opacity 0.3s',
      background: getColor(severity),
      color: '#fff',
      padding: '16px 36px',
      borderRadius: 14,
      fontWeight: 700,
      fontSize: 18,
      boxShadow: '0 4px 24px #0007',
      zIndex: 9999,
      minWidth: 240,
      textAlign: 'center',
      letterSpacing: 0.5,
      border: '2px solid #fff',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      justifyContent: 'center',
    }}>
      <span style={{ fontSize: 24 }}>{icons[severity] || 'ℹ️'}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast; 
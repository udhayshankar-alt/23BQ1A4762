import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Expose Vite client env vars to browser globals for logger support.
if (typeof window !== 'undefined') {
  const globalAny = window as any;
  const env = (import.meta as any).env ?? {};
  globalAny.VITE_LOG_TOKEN = env.VITE_LOG_TOKEN;
  globalAny.LOG_TOKEN = globalAny.LOG_TOKEN || env.VITE_LOG_TOKEN || env.LOG_TOKEN;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

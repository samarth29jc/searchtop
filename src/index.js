import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Save originals
const _log   = console.log;
const _error = console.error;

// In production, silence console.log
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}

// Always override console.error to filter that one tempusers 404
console.error = (...args) => {
  const msg = args.join(' ');
  const suppressTempUser404 = msg.includes('404') && msg.includes('/api/v1/auth/tempusers');
  if (!suppressTempUser404) {
    _error(...args);
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optionally report vitals
reportWebVitals();

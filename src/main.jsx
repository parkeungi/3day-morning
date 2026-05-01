import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import App from './App.jsx';
import { ThemeProvider } from './store/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

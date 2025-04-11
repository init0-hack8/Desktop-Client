import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const applySystemTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const root = document.documentElement;
  if (prefersDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

applySystemTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const root = document.documentElement;
  if (e.matches) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

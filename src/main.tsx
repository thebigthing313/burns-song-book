import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SongProvider } from './components/song-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SongProvider>
      <App />
    </SongProvider>
  </StrictMode>
);

// Register service worker for basic offline support (production only)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = '/sw.js';
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        console.log('Service worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
  });
}

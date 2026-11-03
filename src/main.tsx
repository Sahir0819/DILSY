import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register and update progressive web app service worker
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onRegisteredSW(_swUrl, registration) {
    if (registration) {
      // Periodically check for updates (every 15 min) and whenever the PWA is focused
      setInterval(() => {
        registration.update().catch(() => {});
      }, 15 * 60 * 1000);
      window.addEventListener('focus', () => {
        registration.update().catch(() => {});
      });
    }
  },
});

createRoot(document.getElementById('root')!).render(<App />);

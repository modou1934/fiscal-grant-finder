import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core'

// Inizializza l'app quando il DOM è pronto
const initApp = () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
};

// Se è un'app nativa, aspetta che Capacitor sia pronto
if (Capacitor.isNativePlatform()) {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // Per il web, inizializza immediatamente
  initApp();
}

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Missing app root element');
}

createRoot(app).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

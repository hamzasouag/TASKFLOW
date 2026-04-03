import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
createRoot(document.getElementById('root')!).render(
 <StrictMode>
 <BrowserRouter>
 <AuthProvider>
 <App />
 </AuthProvider>
 </BrowserRouter>
 </StrictMode>
);

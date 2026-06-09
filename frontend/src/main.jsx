import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './styles/global.css';

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60000, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" toastOptions={{
            style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '10px', background: '#0e1117', color: '#f7f9fc' },
            success: { iconTheme: { primary: '#0bbfa3', secondary: '#f7f9fc' } },
            error:   { iconTheme: { primary: '#e5484d', secondary: '#f7f9fc' } },
          }} />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);

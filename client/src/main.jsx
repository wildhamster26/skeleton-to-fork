import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider } from './context/AuthContext';
import { initGA } from './analytics';
import App from './App';
import './styles/main.scss';

initGA();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);

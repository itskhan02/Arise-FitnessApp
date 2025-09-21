import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react';

const Clerk_Key=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!Clerk_Key) {
  throw new Error('Missing ClerkKey.');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={Clerk_Key}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)

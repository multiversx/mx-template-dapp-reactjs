import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.jsx';
import { environment, walletConnectV2ProjectId } from '@/config';
import { initApp } from '@/lib/sdkDapp/sdkDapp.methods';
import './index.css';

const config = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment,
    transactionTracking: {
      successfulToastLifetime: 5000,
      onSuccess: async (sessionId) => {
        console.log('Transaction session successful', sessionId);
      },
      onFail: async (sessionId) => {
        console.log('Transaction session failed', sessionId);
      }
    },
    providers: {
      walletConnect: {
        walletConnectV2ProjectId
      }
    }
  }
};

initApp(config).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});

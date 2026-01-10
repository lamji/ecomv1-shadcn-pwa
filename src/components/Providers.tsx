'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store';
import ReactProvider from './provider';
import GlobalAlert from '@/components/shared/GlobalAlert';
import GlobalSpinner from '@/components/shared/GlobalSpinner';
// import PwaInstallPromptWrapper from './pwa/PwaInstallPromptWrapper';
import { useNotifications } from '@/lib/hooks/useNotifications';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NotificationInitializer />
        <ReactProvider>
          {children}
          <GlobalAlert />
          <GlobalSpinner />
          {/* <div className="md:hidden">
            <PwaInstallPromptWrapper />
          </div> */}
        </ReactProvider>
      </PersistGate>
    </Provider>
  );
}

function NotificationInitializer() {
  // This component is inside the Redux Provider, so useNotifications will work
  useNotifications();
  return null;
}

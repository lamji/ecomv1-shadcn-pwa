'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store';
import ReactProvider from './provider';
import GlobalAlert from '@/components/shared/GlobalAlert';
import GlobalSpinner from '@/components/shared/GlobalSpinner';
import { SocketGlobalListener } from './SocketGlobalListener';
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';
// import SubscriptionChecker from './test/SubscriptionChecker';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '1ace30b6-3a42-4b09-a77d-b44ecc442175',
        // You can add other initialization options here
        allowLocalhostAsSecureOrigin: true,
        autoPrompt: false, // Disable auto-prompting to prevent permission blocked errors
        externalId: '12345', // Add your user ID here
        // notifyButton: {
        //   enable: false, // Disable default notify button to use our custom modal
        // }
      });
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketGlobalListener />
        <ReactProvider>
          {/* <SubscriptionChecker /> */}
          {children}
          <GlobalAlert />
          <GlobalSpinner />
        </ReactProvider>
      </PersistGate>
    </Provider>
  );
}



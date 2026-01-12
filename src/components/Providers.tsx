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

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '1ace30b6-3a42-4b09-a77d-b44ecc442175',
        // You can add other initialization options here
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true,
          prenotify: true,
          showCredit: false,
          text: {
            'tip.state.unsubscribed': 'Subscribe to notifications',
            'tip.state.subscribed': 'You\'re subscribed to notifications',
            'tip.state.blocked': 'You\'ve blocked notifications',
            'message.prenotify': 'Click to subscribe to notifications',
            'message.action.subscribed': 'Thanks for subscribing!',
            'message.action.resubscribed': 'You\'re subscribed to notifications',
            'message.action.unsubscribed': 'You won\'t receive notifications anymore',
            'message.action.subscribing': 'Subscribing...',
            'dialog.main.title': 'Manage Site Notifications',
            'dialog.main.button.subscribe': 'Subscribe',
            'dialog.main.button.unsubscribe': 'Unsubscribe',
            'dialog.blocked.title': 'Unblock Notifications',
            'dialog.blocked.message': 'Follow these instructions to allow notifications:'
          }
        }
      });
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketGlobalListener />
        <ReactProvider>
          {children}
          <GlobalAlert />
          <GlobalSpinner />
        </ReactProvider>
      </PersistGate>
    </Provider>
  );
}



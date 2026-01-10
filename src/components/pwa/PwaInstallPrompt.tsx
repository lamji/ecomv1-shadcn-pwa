'use client';

import React, { useState, useEffect } from 'react';
import { PwaInstallPromptProps, BeforeInstallPromptEvent } from '@/components/pwa/types';
import { IosInstallPrompt } from '@/components/pwa/IosInstallPrompt';
import { AndroidInstallPrompt } from '@/components/pwa/AndroidInstallPrompt';
import OpenInBrowser from '@/components/pwa/OpenInBrowser';
import { isInAppBrowser as detectInApp } from '@/lib/helper/browser-detection';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { X } from 'lucide-react';

/**
 * A component that shows an install prompt for PWA based on the user's platform
 */
export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({
  appName = 'PWA App',
  appIcon = '/icons/apple-touch-icon.png',
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Detect In-App Browser
    setIsInAppBrowser(detectInApp());

    // Detect iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: unknown }).MSStream;
    setIsIOS(iOS);

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Register Service Worker for Push
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered:', registration);
        });
      });
    }

    // Check if already installed
    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isInStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    // Store the beforeinstallprompt event for later use
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      // Logic to subscribe to push would go here
      console.log('Notification permission granted');
      // For demo purposes, show a test notification
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('Notifications Enabled!', {
          body: 'You will now receive updates from E-hotShop',
          icon: appIcon,
          badge: '/icons/favicon-96x96.png',
        });
      }
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = (permanent = false) => {
    setShowPrompt(false);
    if (permanent) {
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

  // Push Permission UI (Only show if installed or on desktop where we can't install but can notify)
  if (notificationPermission === 'default' && (isInstalled || !isIOS)) {
    return (
      <div className="animate-in slide-in-from-top fixed top-4 left-1/2 z-[60] w-[90%] max-w-sm -translate-x-1/2 rounded-2xl border border-blue-100 bg-white p-4 shadow-2xl duration-500">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <Bell className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">Enable Push Notifications</p>
            <p className="text-xs text-gray-500">Stay updated with your orders</p>
          </div>
          <Button size="sm" onClick={requestNotificationPermission}>
            Enable
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationPermission('denied')}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (isInstalled || !showPrompt) {
    return null;
  }

  if (isInAppBrowser) {
    return <OpenInBrowser onDismiss={() => handleDismiss(false)} />;
  }

  return (
    <>
      {isIOS ? (
        <IosInstallPrompt appName={appName} appIcon={appIcon} onDismiss={handleDismiss} />
      ) : (
        <AndroidInstallPrompt
          appName={appName}
          appIcon={appIcon}
          onInstall={handleInstall}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
};

export default PwaInstallPrompt;

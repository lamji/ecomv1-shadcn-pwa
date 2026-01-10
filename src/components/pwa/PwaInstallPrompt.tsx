'use client';

import React, { useState, useEffect } from 'react';
import { PwaInstallPromptProps, BeforeInstallPromptEvent } from '@/components/pwa/types';
import { IosInstallPrompt } from '@/components/pwa/IosInstallPrompt';
import { AndroidInstallPrompt } from '@/components/pwa/AndroidInstallPrompt';
import OpenInBrowser from '@/components/pwa/OpenInBrowser';
import { isInAppBrowser as detectInApp } from '@/lib/helper/browser-detection';

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

    // If PWA is already installed, don't show prompt
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For testing in development: Force the correct prompt to show immediately
    const timer = setTimeout(() => {
      // Skip the localStorage check for testing purposes
      setShowPrompt(true);

      // Log this so we know it's happening
      console.log('PWA install prompt shown for testing purposes');
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
  };

  const handleDismiss = (permanent = false) => {
    setShowPrompt(false);

    if (permanent) {
      localStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

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

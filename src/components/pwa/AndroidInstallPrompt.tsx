'use client';

import React from 'react';
import Image from 'next/image';
import { AndroidInstallPromptProps } from '@/components/pwa/types';

/**
 * Apple-inspired Android PWA install prompt component
 */
export const AndroidInstallPrompt: React.FC<AndroidInstallPromptProps> = ({
  appName = 'PWA App',
  appIcon = '/icons/apple-touch-icon.png',
  onInstall,
  onDismiss,
}) => {
  return (
    <div className="animate-slide-up fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-white p-4 pb-6 shadow-lg">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => onDismiss(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="mb-4 flex items-center">
        <div className="relative mr-4 h-16 w-16 overflow-hidden rounded-xl shadow-sm">
          <Image
            src={appIcon}
            alt={`${appName} icon`}
            fill
            sizes="64px"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{appName}</h3>
          <p className="text-sm text-gray-600">Add to Home Screen</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-gray-50 p-4">
        <p className="mb-2 text-sm text-gray-600">Install this app on your device:</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Not available in app stores yet</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Works with poor connections</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Uses less storage than traditional apps</span>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => onDismiss(true)} className="text-sm text-gray-600 underline">
          Don&apos;t show again
        </button>
        <button
          onClick={onInstall}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default AndroidInstallPrompt;

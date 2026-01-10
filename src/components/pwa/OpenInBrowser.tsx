'use client';

import React from 'react';
import { Share, ExternalLink, MoreVertical } from 'lucide-react';
import { isIOS } from '@/lib/helper/browser-detection';

interface OpenInBrowserProps {
  onDismiss: () => void;
}

export default function OpenInBrowser({ onDismiss }: OpenInBrowserProps) {
  const isApple = isIOS();

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-300">
      <div className="animate-in zoom-in-95 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        <div className="bg-primary p-6 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <ExternalLink className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Open in Browser</h2>
          <p className="mt-2 text-white/80">
            To install this app, you need to open it in your system browser.
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {isApple ? 'Tap the Share button' : 'Tap the Menu button'}
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  {isApple ? (
                    <>
                      <Share className="h-4 w-4 text-blue-500" />
                      <span>The share icon at the bottom</span>
                    </>
                  ) : (
                    <>
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                      <span>The three dots at the top right</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {isApple
                    ? 'Select &quot;Open in Safari&quot;'
                    : 'Select &quot;Open in Chrome&quot;'}
                </p>
                <p className="mt-1 text-sm text-gray-500 italic">
                  (Or &quot;Open in System Browser&quot;)
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="mt-8 w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}

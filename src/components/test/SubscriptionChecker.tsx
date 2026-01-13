/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { getPlayerId, setExternalUserId } from 'webtonative/OneSignal';

export default function SubscriptionChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'subscribing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [externalId, setExternalId] = useState('');

  const checkAndSubscribe = async () => {
    setIsLoading(true);
    setStatus('checking');
    setMessage('Getting current user...');

    try {
      // Use WebToNative OneSignal getPlayerId
      if (!getPlayerId || !setExternalUserId) {
        alert('❌ WebToNative OneSignal functions not available\n\nPlease ensure:\n1. WebToNative package is installed\n2. OneSignal is configured in your app');
        setIsLoading(false);
        return;
      }
      
      // Generate a random external ID for this user
      const randomExternalId = Math.random().toString(36).substring(2, 15);
      setExternalId(randomExternalId);
      
      // Get current player ID
      getPlayerId().then(function(playerId: string) {
        if (playerId) {
          // Set the external user ID
          setExternalUserId("randomExternalId");
          
          alert(`📱 OneSignal User Info:\n\nPlayer ID: ${playerId}\nExternal ID: ${randomExternalId}\n\nExternal ID has been set for this user.`);
          setStatus('success');
          setMessage('✅ User retrieved and external ID set successfully');
        } else {
          alert('❌ No OneSignal user found');
          setStatus('error');
          setMessage('❌ No user found');
        }
        setIsLoading(false);
      }).catch(function(error: any) {
        alert(`❌ Error: ${error}`);
        setStatus('error');
        setMessage(`❌ Error: ${error}`);
        setIsLoading(false);
      });

    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
      setStatus('error');
      setMessage(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStatus('idle');
    setMessage('');
    setIsLoading(false);
  };

  const closeModal = () => {
    resetModal();
    setIsOpen(false);
  };

  return (
    <>
      
        <button
          onClick={() => {
            // Generate random external ID when modal opens
            const randomExternalId = Math.random().toString(36).substring(2, 15);
            setExternalId(randomExternalId);
            console.log('Generated random external ID:', randomExternalId);
            setIsOpen(true);
          }}
          className="fixed bottom-4 right-4 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        >
          🔔 Enable Notifications
        </button>
    

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Enable Notifications</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${
                status === 'success' ? 'bg-green-100 text-green-800' :
                status === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {message}
              </div>
            )}

            {/* External ID Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Your Device ID:</strong>
              </p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono text-gray-800 break-all">
                  {externalId}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(externalId);
                    setMessage('📋 Device ID copied to clipboard!');
                    setTimeout(() => setMessage(''), 2000);
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  📋 Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This ID identifies your device for notifications
              </p>
            </div>

            {/* Loading Spinner */}
            {isLoading && (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Subscribe Button */}
            <div className="mb-6">
              <button
                onClick={checkAndSubscribe}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
              >
                {isLoading ? 'Setting up...' : '📱 Enable Push Notifications'}
              </button>
            </div>

            {/* Info Section */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="mb-1">💡 <strong>Why enable notifications?</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Receive order updates instantly</li>
                <li>Get important account notifications</li>
                <li>Stay informed about new features</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

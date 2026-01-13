 
"use client";

import { useState } from 'react';
import { useOneSignalNotification } from '@/lib/hooks/useOneSignalNotification';

export default function SubscriptionChecker() {
  const { sendWelcomeNotification } = useOneSignalNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'subscribing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
 

  const checkAndSubscribe = async () => {
    await sendWelcomeNotification("260113070918769", "result.userName" );
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
            // checkAndSubscribeGenerate random external ID when modal opens
            checkAndSubscribe();
            
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
          </div>
        </div>
      )}
    </>
  );
}

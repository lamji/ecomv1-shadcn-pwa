/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';

export default function SubscriptionChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'subscribing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [externalId, setExternalId] = useState('');

  // Generate unique external ID on component mount
  useEffect(() => {
    const generateUniqueId = () => {
      const now = new Date();
      const yy = now.getFullYear().toString().slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      
      return `${yy}${mm}${dd}${hh}${min}${ss}${ms}`;
    };

    // Check if we already have a saved ID
    const savedId = localStorage.getItem('user_external_id');
    if (savedId) {
      setExternalId(savedId);
    } else {
      const newId = generateUniqueId();
      setExternalId(newId);
      localStorage.setItem('user_external_id', newId);
    }
  }, []);

  const checkUserExists = async (externalId: string) => {
    try {
      const response = await fetch('/api/onesignal/check-user-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_id: externalId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User check result:', result);
        
        if (result.exists && result.data?.subscriptions) {
          // Check if any subscription is enabled
          const hasEnabledSubscription = result.data.subscriptions.some(
            (sub: any) => sub.enabled === true
          );
          
          if (hasEnabledSubscription) {
            return { exists: true, subscribed: true, data: result.data };
          } else {
            return { exists: true, subscribed: false, data: result.data };
          }
        }
        
        return { exists: false, subscribed: false, data: null };
      } else {
        const error = await response.json();
        console.error('Error checking user:', error);
        return { exists: false, subscribed: false, error };
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { exists: false, subscribed: false, error };
    }
  };

  const checkAndSubscribe = async () => {
    setIsLoading(true);
    setStatus('checking');
    setMessage('Checking notification permission...');

    try {
      // First check if OneSignal is available
      if (typeof window === 'undefined' || !(window as any).OneSignal) {
        setStatus('error');
        setMessage('OneSignal not available. Please refresh the page and try again.');
        return;
      }

      // Check current notification permission
      const permission = await Notification.requestPermission();
      console.log('Permission result:', permission);

      if (permission === 'denied') {
        // User manually turned off notifications, try to re-trigger the permission prompt
        setStatus('checking');
        setMessage('Re-opening notification permission prompt...');
        
        // Use a small delay and try to re-trigger the permission prompt
        setTimeout(async () => {
          try {
            // Try to request permission again to re-open the prompt
            const retryPermission = await Notification.requestPermission();
            console.log('Retry permission result:', retryPermission);
            
            if (retryPermission === 'granted') {
              // Permission granted on retry, continue with subscription
              await proceedWithSubscription();
            } else if (retryPermission === 'denied') {
              // Still denied, try one more time with a longer delay
              setStatus('checking');
              setMessage('Please check your browser settings or try again...');
              
              setTimeout(async () => {
                const finalRetry = await Notification.requestPermission();
                console.log('Final retry permission result:', finalRetry);
                
                if (finalRetry === 'granted') {
                  await proceedWithSubscription();
                } else {
                  setStatus('error');
                  setMessage('🚫 Notifications are still blocked. To enable notifications:\n\n1. Click the 🔒 icon in your address bar\n2. Change "Notifications" to "Allow"\n3. Refresh this page and try again');
                  setIsLoading(false);
                }
              }, 2000);
            } else {
              setStatus('error');
              setMessage('Notification permission was dismissed. Please click "Allow" when prompted to enable notifications.');
              setIsLoading(false);
            }
          } catch {
            setStatus('error');
            setMessage('🚫 Notifications are blocked in your browser. To enable notifications:\n\n1. Click the 🔒 icon in your address bar\n2. Change "Notifications" to "Allow"\n3. Refresh this page and try again');
            setIsLoading(false);
          }
        }, 1000);
        return;
      } else if (permission === 'default') {
        setStatus('error');
        setMessage('Notification permission was dismissed. Please click "Allow" when prompted to enable notifications.');
        return;
      } else if (permission !== 'granted') {
        setStatus('error');
        setMessage(`Unexpected permission state: ${permission}. Please refresh the page and try again.`);
        return;
      }

      // Permission granted - proceed with subscription
      await proceedWithSubscription();
    } catch (err) {
      console.error('Error in check and subscribe:', err);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const proceedWithSubscription = async () => {
    try {
      // Check if user already exists and is subscribed
      setStatus('checking');
      setMessage('Checking if device is already registered...');

      const userCheck = await checkUserExists(externalId);
      
      if (userCheck.exists && userCheck.subscribed) {
        setStatus('success');
        setMessage('✅ Device is already registered and ready for notifications!');
        setIsLoading(false);
        return;
      } else if (userCheck.exists && !userCheck.subscribed) {
        // User exists but subscription is disabled, need to resubscribe
        setStatus('subscribing');
        setMessage('Re-enabling push notifications...');
      } else {
        // User doesn't exist, proceed with fresh subscription
        setStatus('subscribing');
        setMessage('Setting up fresh subscription...');
      }

      // Force clear any existing OneSignal data and logout current user
      try {
        // Logout current OneSignal user to force fresh subscription
        if ((window as any).OneSignal) {
          console.log('Logging out current OneSignal user...');
          await (window as any).OneSignal.logout();
          
          // Wait a moment for logout
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('Setting external ID:', externalId);

        // Set external ID first, then wait for subscription
        (window as any).OneSignal.push(function() {
          console.log('Setting external ID in OneSignal...');
          (window as any).OneSignal.login(externalId);
        });

        // Wait for external ID to be set
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify external ID was set by checking user again
        const verifyCheck = await checkUserExists(externalId);
        if (verifyCheck.exists && verifyCheck.subscribed) {
          console.log('✅ External ID set successfully and subscription enabled!');
          setStatus('success');
          setMessage('🎉 Successfully subscribed! Your device is now registered in the dashboard.');
        } else {
          console.log('⚠️ External ID set but subscription not enabled, retrying...');
          // Try one more time to enable subscription
          (window as any).OneSignal.push(function() {
            setTimeout(() => {
              try {
                (window as any).OneSignal.login(externalId);
                console.log('✅ Fresh subscription successful! External ID set to:', externalId);
                setStatus('success');
                setMessage('🎉 Successfully subscribed! Your device is now registered in the dashboard.');
              } catch (loginError) {
                console.error('Fresh subscription failed:', loginError);
                setStatus('error');
                setMessage('⚠️ Subscription failed. Please try again or refresh the page.');
              } finally {
                setIsLoading(false);
              }
            }, 1000);
          });
          return;
        }

        setIsLoading(false);

      } catch (cleanupError) {
        console.error('Error during subscription:', cleanupError);
        setStatus('error');
        setMessage('Error preparing subscription. Please refresh the page and try again.');
        setIsLoading(false);
      }

    } catch (err) {
      console.error('Error in check and subscribe:', err);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
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
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
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

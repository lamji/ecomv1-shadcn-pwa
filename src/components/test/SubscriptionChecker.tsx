/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function SubscriptionChecker() {
  const checkAndSubscribe = async (externalId: string) => {
    try {
      // First check subscription status
      const checkResponse = await fetch('/api/onesignal/check-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_id: externalId,
        }),
      });

      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        console.log('Subscription check result:', checkResult);
        
        if (checkResult.subscribed) {
          alert('Device is already subscribed!');
          return;
        }
      }

      // If not subscribed, subscribe the device
      console.log('Device not subscribed, subscribing now...');
      
      // Request notification permission first
      const permission = await Notification.requestPermission();
      console.log('Permission result:', permission);

      if (permission !== 'granted') {
        alert('Notification permission denied. Cannot subscribe without permission.');
        return;
      }

      // Subscribe using OneSignal
      if (typeof window !== 'undefined' && (window as any).OneSignal) {
        (window as any).OneSignal.push([
          'login',
          externalId
        ]);
        console.log('Subscribed to OneSignal with external_id:', externalId);
        alert('Successfully subscribed! You should now receive notifications.');
      } else {
        alert('OneSignal not available. Please refresh the page and try again.');
      }

    } catch (err) {
      console.error('Error in check and subscribe:', err);
      alert('Error: ' + err);
    }
  };

  const checkSubscription = async (externalId: string) => {
    try {
      const response = await fetch('/api/onesignal/check-subscription', {
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
        console.log('Subscription check result:', result);
        alert(JSON.stringify(result, null, 2));
      } else {
        const error = await response.json();
        console.error('Failed to check subscription:', error);
        alert('Failed to check subscription: ' + error.error);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
      alert('Error checking subscription');
    }
  };

  const sendNotification = async (externalId: string) => {
    try {
      const response = await fetch('/api/onesignal/send-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_id: externalId,
          title: 'Test Notification',
          message: 'This is a test push notification!',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Notification sent:', result);
        console.log(JSON.stringify(result, null, 2));
      } else {
        const error = await response.json();
        console.error('Failed to send notification:', error);
        console.log(JSON.stringify(error, null, 2));
        alert('Failed to send notification: ' + error.error);
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      console.log(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="space-x-4 space-y-4 p-4">
      <h3 className="text-lg font-semibold">Auto-Subscribe & Check</h3>
      <div className="space-x-4">
        <button 
          onClick={() => checkAndSubscribe('test-user-123')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Check & Subscribe Device 1 (test-user-123)
        </button>
        <button 
          onClick={() => checkAndSubscribe('25e10ed83352')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Check & Subscribe Device 2 (25e10ed83352)
        </button>
      </div>
      
      <h3 className="text-lg font-semibold">Check Subscription Status</h3>
      <div className="space-x-4">
        <button 
          onClick={() => checkSubscription('test-user-123')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Device 1 (test-user-123)
        </button>
        <button 
          onClick={() => checkSubscription('25e10ed83352')}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Check Device 2 (25e10ed83352)
        </button>
      </div>
      
      <h3 className="text-lg font-semibold">Send Test Notifications</h3>
      <div className="space-x-4">
        <button 
          onClick={() => sendNotification('test-user-123')}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Send to Device 1 (test-user-123)
        </button>
        <button 
          onClick={() => sendNotification('25e10ed83352')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Send to Device 2 (25e10ed83352)
        </button>
      </div>
    </div>
  );
}

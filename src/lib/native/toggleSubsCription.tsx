import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';

export default function ToggleSubscription() {
  const [isWebView, setIsWebView] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if running in WebView
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
    const webViewDetected = /wv|WebView/i.test(userAgent);
    setIsWebView(webViewDetected);

    // Check current subscription status
    if (webViewDetected) {
      checkSubscriptionStatus();
    }
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      // Check if user is subscribed to push notifications
      const permission = await Notification.requestPermission();
      setIsSubscribed(permission === 'granted');
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const handleToggleSubscription = async () => {
    if (!isWebView) return;

    setIsLoading(true);
    try {
      // Get current OneSignal ID from localStorage
      const oneSignalId = localStorage.getItem('last_onesignal_external_id');
      
      if (!oneSignalId) {
        console.error('No OneSignal ID found in localStorage');
        return;
      }

    
    } catch (error) {
      console.error('Error toggling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // Return null if not in WebView
  if (!isWebView) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center space-x-2">
          {isSubscribed ? (
            <Bell className="h-5 w-5 text-green-600" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          <CardTitle className="text-lg">Push Notifications</CardTitle>
        </div>
        <CardDescription>
          {isSubscribed 
            ? "You're receiving push notifications for order updates and promotions."
            : "Enable push notifications to stay updated on your orders and exclusive offers."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id="push-notifications"
            checked={isSubscribed}
            onCheckedChange={handleToggleSubscription}
            disabled={isLoading}
          />
          <Label htmlFor="push-notifications" className="text-sm font-medium">
            {isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
          </Label>
        </div>
        {isLoading && (
          <p className="text-xs text-gray-500 mt-2">Updating preferences...</p>
        )}
      </CardContent>
    </Card>
  );
}

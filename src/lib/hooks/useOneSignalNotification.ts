/* eslint-disable @typescript-eslint/no-explicit-any */
interface NotificationData {
  type: string;
  status?: string;
  orderId?: string;
  amount?: number;
  timestamp?: string;
  data?: any;
}

interface SendNotificationOptions {
  contents: {
    en: string;
  };
  headings: {
    en: string;
  };
  url?: string;
  included_segments?: string[];
  include_aliases?: {
    external_id: string[];
  };
  target_channel?: string;
  data?: NotificationData;
}



/**
 * Hook for sending OneSignal notifications
 * @returns {Function} - Function to send notifications
 */
export function useOneSignalNotification() {
  // const checkSubscription = async () => {
  //   try {
  //     const playerId = await new Promise<string>((resolve, reject) => {
  //       getPlayerId().then(function(playerId: string) {
  //         if (playerId) {
  //           resolve(playerId);
  //         } else {
  //           reject(new Error('No player ID found'));
  //         }
  //       }).catch(reject);
  //     });
      
  //     console.log('Player ID found:', playerId);
  //     // If we have a player ID, the user is subscribed
  //     return !!playerId;
  //   } catch (error) {
  //     console.error('Error checking subscription:', error);
  //     return false;
  //   }
  // };

  const sendNotification = async (options: SendNotificationOptions): Promise<boolean> => {
    try {
      const response = await fetch('/api/onesignal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OneSignal API error:', response.status, errorText);
        return false;
      }

      const result = await response.json();
      console.log('✅ OneSignal notification sent:', result);
      alert(`✅ OneSignal notification sent: ${result}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending OneSignal notification:', error);
      return false;
    }
  };

  // Convenience functions for common notification types
  const sendOrderStatusUpdate = async (
    orderId: string,
    newStatus: string,
    order: any,
    externalId?: string
  ): Promise<boolean> => {
    const notificationData: any = {
      contents: {
        en: `Order ${orderId} status updated to ${newStatus}`,
      },
      headings: {
        en: `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} Alert`,
      },
      url: `${window.location.origin}/notifications`,
      target_channel: 'push',
      data: {
        type: 'order',
        status: newStatus,
        orderId,
        amount: order.total,
        timestamp: Date.now().toString(),
        data: order,
      },
    };

    // Use external_id if provided, otherwise send to all
    if (externalId) {
      notificationData.include_external_user_ids = [externalId];
    } else {
      notificationData.included_segments = ['All'];
    }

    return sendNotification(notificationData);
  };

  const sendWelcomeNotification = async (
    oneSignalUserId: string,
    userName: string
  ): Promise<boolean> => {
    alert('Sending welcome notification...');
    
    return sendNotification({
      contents: {
        en: `Hi ${userName}, your registration is complete. Welcome aboard!`,
      },
      headings: {
        en: 'Welcome to HotShop!',
      },
      include_aliases: {
        external_id: [oneSignalUserId],
      },
      target_channel: 'push',
      data: {
        type: 'promotion',
        status: 'success',
        timestamp: Date.now().toString(),
      },
    });
  };

  return {
    sendNotification,
    sendOrderStatusUpdate,
    sendWelcomeNotification,
  };
}

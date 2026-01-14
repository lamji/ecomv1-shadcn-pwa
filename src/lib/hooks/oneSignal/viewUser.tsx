import { useState } from 'react';

interface UseOneSignalUserProps {
  externalId: string;
}

interface OneSignalUser {
  id: string;
  external_id: string;
  identifier: string;
  session_count: number;
  language: string;
  timezone: number;
  device_type: number;
  device_os: string;
  ad_id: string;
  game_version: string;
  sdk_version: string;
  created_at: string;
  last_active: string;
  playtime: number;
  amount_spent: number;
  purchased_at: string;
  tags: Record<string, unknown>;
  notification_types: number;
  invalid_identifier: boolean;
  rooted: boolean;
  safari_web_push_id: string;
  require_auth: boolean;
  test_type: number;
}

export function useOneSignalUser({ externalId }: UseOneSignalUserProps) {
  const [user, setUser] = useState<OneSignalUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!externalId) {
      setError('External ID is required');
      return;
    }

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
      setError('OneSignal configuration missing');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options = {
        method: 'GET',
        headers: {
          Authorization: apiKey
        }
      };

      const response = await fetch(
        `https://api.onesignal.com/apps/${appId}/users/by/external_id/${externalId}`,
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching OneSignal user:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    fetchUser
  };
}
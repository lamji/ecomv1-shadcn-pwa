import { useGetData, useAppContext } from "plugandplay-react-query-hooks";
import { UserProfile } from "@/types/profile";
import { useEffect } from "react";

interface ProfileApiResponse {
  success: boolean;
  data: UserProfile & { oneSignalUserId?: string };
  cached: boolean;
}

export function useGetProfile() {
  const { token } = useAppContext();
  const { data, isLoading, error, refetch } = useGetData<ProfileApiResponse>({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: "api/profile",
    options: {
      queryKey: ["profile"],
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!token,
    },
  });

  useEffect(() => {
    if (data?.data?.oneSignalUserId && window.OneSignal) {
      window.OneSignal.push(['login', data.data.oneSignalUserId]);
      console.log('OneSignal logged in with External ID:', data.data.oneSignalUserId);
    }
  }, [data]);

  return {
    profile: data?.data,
    isLoading,
    error,
    refetch,
  };
}

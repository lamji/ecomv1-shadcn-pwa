import { useGetData, useAppContext } from "plugandplay-react-query-hooks";
import { UserProfile } from "@/types/profile";

interface ProfileApiResponse {
  success: boolean;
  data: UserProfile;
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

  return {
    profile: data?.data,
    isLoading,
    error,
    refetch,
  };
}

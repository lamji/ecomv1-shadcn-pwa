/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePutData } from "plugandplay-react-query-hooks";
import { useAppDispatch } from '@/lib/store';
import { showAlert } from '@/lib/features/alertSlice';
import { useRouter } from 'next/navigation';
import { UpdateProfileData } from '@/types/profile';
import { useGetProfile } from './useGetProfile';


export const useUpdateProfile = () => {
  const {refetch:refetchProfileData} =useGetProfile()
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { mutateAsync, isPending, error } = usePutData<UpdateProfileData>({
    baseUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
    endpoint: "api/profile/update-profile",
    invalidateQueryKey:["profile"],
    options: {
      retry: 1,
      onSuccess: () => {        
        dispatch(showAlert({
          title: 'Success!',
          message: 'Your profile has been updated successfully.',
          variant: 'success',
        }));

        refetchProfileData();
        router.push('/');
      },
      onError: (error: Error) => {
        
        // Type cast to access response properties
        const axiosError = error as any;
        
        // Handle 401 errors specifically
        if (axiosError?.response?.status === 401) {
          dispatch(showAlert({
            title: 'Session Expired',
            message: 'Your session has expired. Please log in again.',
            variant: 'error',
          }));
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          dispatch(showAlert({
            title: 'Update Failed',
            message: 'Failed to update your profile. Please try again.',
            variant: 'error',
          }));
        }
      },
    },
  });

  const updateProfile = async (data: UpdateProfileData) => {
    return mutateAsync(data);
  };

  return {
    updateProfile,
    isSubmitting: isPending,
    error,
  };
};
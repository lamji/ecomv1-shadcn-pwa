
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types/profile';



interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.lastFetched = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
     
      
      // If state.profile is null, set it to the payload
      // If state.profile exists, merge with payload
      state.profile = state.profile 
        ? { ...state.profile, ...action.payload }
        : action.payload as UserProfile;
        
     
    },
  },
});

export const { clearProfile, updateProfile } = profileSlice.actions;

// Selectors
export const getProfileDataRedux = (state: { profile: ProfileState }) => state.profile.profile;
export const getProfileLoadingRedux = (state: { profile: ProfileState }) => state.profile.isLoading;
export const getProfileErrorRedux = (state: { profile: ProfileState }) => state.profile.error;

export default profileSlice.reducer;

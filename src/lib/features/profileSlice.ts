
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
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { clearProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;

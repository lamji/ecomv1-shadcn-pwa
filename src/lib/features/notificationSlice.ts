import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '../data/notifications';

interface NotificationState {
  items: NotificationItem[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.items = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: state => {
      state.items.forEach(n => {
        n.read = true;
      });
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      // Check if notification already exists to avoid duplicates
      console.log('Redux addNotification called with:', action.payload);
      console.log('Current notifications count:', state.items.length);

      if (!state.items.find(n => n.id === action.payload.id)) {
        state.items = [action.payload, ...state.items];
        console.log('Notification added. New count:', state.items.length);
      } else {
        console.log('Duplicate notification prevented:', action.payload.id);
      }
    },
  },
});

export const { setNotifications, markAsRead, markAllAsRead, deleteNotification, addNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

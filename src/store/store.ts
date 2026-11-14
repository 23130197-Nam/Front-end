import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/auth/userReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    // chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user.type';
import { wsService } from '../../services/websocketService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('chat_token') || null,
    isAuthenticated: !!localStorage.getItem('chat_token'),
    isLoading: false,
    error: null,
};

export const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Bắt đầu quá trình gửi request (Login, Register...)
        authStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        // Đăng nhập/Khôi phục phiên thành công
        authSuccess: (state, action: PayloadAction<{ user: User; token?: string; re_login_code?: string }>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;

            if (action.payload.token) {
                state.token = action.payload.token;
                localStorage.setItem('chat_token', action.payload.token);
            }
            if (action.payload.re_login_code) {
                localStorage.setItem('re_login_code', action.payload.re_login_code);
            }
        },
        // Thất bại
        authFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Đăng xuất
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('chat_token');
            localStorage.removeItem('re_login_code');
            wsService.disconnect();
        },
    },
});

export const { authStart, authSuccess, authFailure, logout } = userReducer.actions;
export default userReducer.reducer;
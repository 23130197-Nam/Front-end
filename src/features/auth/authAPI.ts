import { wsService } from '../../services/websocketService';
import { authStart, authSuccess, authFailure } from './userReducer';
import type { AppDispatch } from '../../store/store';

export const loginWithWebSocket = (credentials: { username: string; password: string }, dispatch: AppDispatch) => {
    dispatch(authStart());

    const payload = {
        action: 'LOGIN',
        data: {
            username: credentials.username,
            password: credentials.password,
        },
    };

    wsService.send(payload);
};

export const registerWithWebSocket = (userInfo: { username: string; password: string; full_name: string; phone_number?: string }, dispatch: AppDispatch, onSuccess: () => void) => {
    dispatch(authStart());

    const payload = {
        action: 'REGISTER',
        data: {
            username: userInfo.username,
            password: userInfo.password,
            full_name: userInfo.full_name,
            phone_number: userInfo.phone_number || '',
        },
    };

    wsService.send(payload);
};
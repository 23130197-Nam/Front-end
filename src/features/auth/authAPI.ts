import { wsService } from '../../services/websocketService';
import { authStart } from './userReducer';
import type { AppDispatch } from '../../store/store';

export const loginWithWebSocket = (credentials: { username: string; password: string }, dispatch: AppDispatch) => {
    dispatch(authStart());
    const payload = {
        action: "onchat",
        data: {
            event: "LOGIN",
            data: {
               user: credentials.username,
               pass: credentials.password,
            }
        }
    };
    wsService.send(payload);
    console.log('[AUTH_API] login');
};

export const registerWithWebSocket = (userInfo: { username: string; password: string }, dispatch: AppDispatch) => {
    dispatch(authStart());
    const payload = {
        action: "onchat",
        data: {
            event: "REGISTER",
            data: {
                user: userInfo.username,
                pass: userInfo.password,
            }
        }
    };
    wsService.send(payload);
    console.log('[AUTH_API] register');
};

export const reLoginWithWebSocket = (username: string, reLoginCode: string, dispatch: AppDispatch) => {
    dispatch(authStart());
    const payload = {
        action: "onchat",
        data: {
            event: "RE_LOGIN",
            data: {
                user: username,
                code: reLoginCode,
            }
        }
    };
    wsService.send(payload);
    console.log('[AUTH_API] relogin');
};

export const logoutWithWebSocket = () => {
    const payload = {
        action: "onchat",
        data: {
            event: "LOGOUT"
        }
    };
    wsService.send(payload);
    console.log('[AUTH_API] logout');
};

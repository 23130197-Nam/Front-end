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
};
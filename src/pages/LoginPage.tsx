import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginWithWebSocket } from "../features/auth/authAPI";
import { wsService } from "../services/websocketService";
import { authSuccess, authFailure } from "../features/auth/userReducer";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.user);

    useEffect(() => {
        wsService.connect();
        const handleLoginResponse = (response: any) => {
            if (response.status === 'success') {
                const currentUsername = username.trim();
                dispatch(authSuccess({user: {id_user: 0, role_id: 0, username: currentUsername, full_name: currentUsername,}, re_login_code: response.data.RE_LOGIN_CODE}));
                navigate('/chat');
            } else dispatch(authFailure(response.message || 'Đăng nhập thất bại!'));
        };
        wsService.on('LOGIN', handleLoginResponse);
        return () => {wsService.off('LOGIN', handleLoginResponse);};
    }, [dispatch, navigate]);

    useEffect(() => {if (isAuthenticated) {navigate('/chat');}}, [isAuthenticated, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        if (!username || !password) {
            setLocalError('Vui lòng nhập đầy đủ tên tài khoản và mật khẩu!');
            return;
        }
        localStorage.setItem('chat_username', username.trim());
        loginWithWebSocket({ username, password }, dispatch);
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg p-4 border-0 rounded-4" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ color: '#7C3AED' }}>Đăng Nhập</h2>
                    <p className="text-muted">Chào mừng bạn quay lại với App Chat</p>
                </div>

                {(localError || error) && (<div className="alert alert-danger py-2 small d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{localError || error}</div></div>)}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên tài khoản</label>
                        <input type="text" className="form-control" placeholder="Nhập username..." value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input type="password" className="form-control" placeholder="Nhập mật khẩu..." value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>

                    <button type="submit" className="btn w-100 py-2 fw-semibold btn-custom-primary shadow-sm" disabled={isLoading}>
                        {isLoading ? (<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>) : (<i className="bi bi-box-arrow-in-right me-2"></i>)}
                        {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-muted">Chưa có tài khoản? </span>
                    <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#7C3AED' }}>Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginWithWebSocket } from "../features/auth/authAPI";
import { wsService } from "../services/websocketService";
import { authSuccess, authFailure } from "../features/auth/userReducer";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.user);

    useEffect(() => {
        wsService.connect();
        const handleLoginResponse = (response: any) => {
            if (response.status === 'success') {
                dispatch(authSuccess({
                    user: response.data.user,
                    token: response.data.token,
                    re_login_code: response.data.re_login_code
                }));
                navigate('/chat');
            } else {
                dispatch(authFailure(response.message || 'Đăng nhập thất bại!'));
            }
        };
        wsService.on('LOGIN', handleLoginResponse);
        return () => {wsService.off('LOGIN', handleLoginResponse);};
    }, [dispatch, navigate]);

    useEffect(() => {if (isAuthenticated) {navigate('/chat');}}, [isAuthenticated, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Vui lòng nhập đầy đủ tài khoản và mật khẩu!');
            return;
        }
        loginWithWebSocket({ username, password }, dispatch);
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg p-4 border-0 rounded-4" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Đăng Nhập</h2>
                    <p className="text-muted">Chào mừng bạn quay lại với App Chat</p>
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên tài khoản</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={isLoading}>
                        {isLoading ? (<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>) : (<i className="bi bi-box-arrow-in-right me-2"></i>)}
                        {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-muted">Chưa có tài khoản? </span>
                    <Link to="/register" className="text-decoration-none fw-semibold">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}
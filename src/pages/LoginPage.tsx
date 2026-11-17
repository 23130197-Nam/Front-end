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
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4" style={{ backgroundColor: '#F7F5FC' }}>
            <div className="row g-0 w-100 overflow-hidden rounded-4 shadow-lg" style={{ maxWidth: '920px', backgroundColor: '#FFFFFF' }} >
                <div className="col-md-5 p-4 p-lg-5 d-flex flex-column justify-content-between position-relative overflow-hidden" style={{ backgroundColor: '#7C3AED', color: '#FFFFFF' }}>
                    <div className="position-absolute rounded-circle" style={{width: '240px', height: '240px', backgroundColor: 'rgba(217, 248, 85, 0.12)',  right: '-120px', bottom: '-100px',  pointerEvents: 'none'}}></div>
                    <div className="d-flex align-items-center gap-2 position-relative">
                        <span className="d-inline-flex align-items-center justify-content-center rounded-3" style={{width: '40px', height: '40px',  backgroundColor: '#D9F855', color: '#211A2E'}}> <i className="bi bi-chat-dots-fill fs-5"></i></span>
                        <span className="fw-bold fs-5">App Chat</span>
                    </div>
                    <div className="position-relative my-4 my-md-5">
                        <span className="badge rounded-pill px-3 py-2 mb-3" style={{backgroundColor: '#D9F855', color: '#211A2E' }}> Kết nối mỗi ngày </span>
                        <h1 className="fw-bold mb-3" style={{fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.15 }}> Một lời chào. <br /> Thêm kết nối.</h1>
                        <p className="mb-0" style={{ color: '#EDE9F4' }}> Gặp gỡ bạn bè, chia sẻ câu chuyện và giữ nhữngcuộc trò chuyện luôn tiếp nối. </p>
                    </div>
                    <div className="d-none d-md-flex align-items-center gap-2 position-relative">
                        <i className="bi bi-stars" style={{ color: '#D9F855' }}></i>
                        <span className="small" style={{ color: '#EDE9F4' }}> Không gian nhỏ, câu chuyện lớn.</span>
                    </div>
                </div>
                <div className="col-md-7 p-4 p-lg-5">
                    <div className="mb-4">
                        <h2 className="fw-bold mb-2" style={{ color: '#211A2E' }}> Đăng nhập</h2>
                        <p className="mb-0" style={{ color: '#71677F' }}> Tiếp tục những cuộc trò chuyện của bạn.</p>
                    </div>

                    {(localError || error) && (<div className="alert alert-danger py-2 small d-flex align-items-center" role="alert"> <i className="bi bi-exclamation-triangle-fill me-2"></i> <div>{localError || error}</div></div>)}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3"> <label htmlFor="loginUsername" className="form-label fw-semibold" > Tên tài khoản</label>
                            <div className="input-group">
                                <span className="input-group-text border-end-0" style={{backgroundColor: '#F7F5FC', color: '#7C3AED', borderColor: '#E5DFF0' }}> <i className="bi bi-person"></i> </span>
                                <input id="loginUsername" type="text" className="form-control py-3 border-start-0" placeholder="Nhập tên tài khoản"  autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="loginPassword" className="form-label fw-semibold"> Mật khẩu</label>
                            <div className="input-group">
                                <span className="input-group-text border-end-0" style={{backgroundColor: '#F7F5FC', color: '#7C3AED', borderColor: '#E5DFF0' }}><i className="bi bi-lock"></i> </span>
                                <input id="loginPassword" type="password" className="form-control py-3 border-start-0" placeholder="Nhập mật khẩu" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </div>

                        <button type="submit" className="btn w-100 py-3 fw-semibold btn-custom-primary rounded-3" disabled={isLoading}>
                            {isLoading ? (<span className="spinner-border spinner-border-sm me-2"aria-hidden="true"></span>) : (<i className="bi bi-arrow-right-circle me-2"></i>)}
                            {isLoading ? 'Đang xử lý...' : 'Bắt đầu trò chuyện'}
                        </button>
                    </form>

                    <div className="text-center mt-4 pt-4 border-top" style={{ borderColor: '#E5DFF0' }}>
                        <span style={{ color: '#71677F' }}> Chưa có tài khoản?{' '} </span>
                        <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#7C3AED' }} >Đăng ký ngay <i className="bi bi-arrow-up-right ms-1"></i></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
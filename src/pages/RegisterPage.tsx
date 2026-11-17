import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerWithWebSocket } from '../features/auth/authAPI';
import { wsService } from '../services/websocketService';
import { authFailure, clearLoading} from '../features/auth/userReducer';

export default function RegisterPage() {
    const [formData, setFormData] = useState({username: '',password: '',});
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.user);

    useEffect(() => {
        wsService.connect();
        const handleRegisterResponse = (response: any) => {
            if (response.status === 'success') {
                dispatch(clearLoading());
                setSuccessMessage('Đăng ký tài khoản thành công! Đang chuyển hướng...');
                setTimeout(() => {navigate('/login');}, 1500);
            } else dispatch(authFailure(response.mes || 'Đăng ký thất bại!'));
        };
        wsService.on('REGISTER', handleRegisterResponse);
        return () => {wsService.off('REGISTER', handleRegisterResponse);};
    }, [dispatch, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {setFormData({ ...formData, [e.target.name]: e.target.value });};
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');
        if (!formData.username || !formData.password) {
            setLocalError('Vui lòng điền đầy đủ tài khoản và mật khẩu!');
            return;
        }
        registerWithWebSocket(formData, dispatch);
    };

    return (
        <div className="container-fluid vh-100 overflow-auto d-flex p-3 p-md-4" style={{ backgroundColor: '#F7F5FC' }}>
            <div className="row g-0 w-100 m-auto overflow-hidden rounded-4 shadow-lg" style={{ maxWidth: '920px', backgroundColor: '#FFFFFF' }}>
                <div className="col-md-7 p-4 p-lg-5">
                    <div className="mb-4">
                        <h2 className="fw-bold mb-2" style={{ color: '#211A2E' }}> Tạo tài khoản</h2>
                        <p className="mb-0" style={{ color: '#71677F' }}> Một bước nhỏ để mở đầu những câu chuyện mới.</p>
                    </div>

                    {(localError || error) && (<div className="alert alert-danger py-2 small d-flex align-items-center" role="alert"> <i className="bi bi-exclamation-triangle-fill me-2"></i><div>{localError || error}</div> </div>)}
                    {successMessage && (<div className="alert alert-success py-2 small d-flex align-items-center" role="status"> <i className="bi bi-check-circle-fill me-2"></i> <div>{successMessage}</div> </div>)}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="registerUsername" className="form-label fw-semibold"> Tên tài khoản</label>
                            <div className="input-group">
                                <span className="input-group-text border-end-0" style={{ backgroundColor: '#F7F5FC', color: '#7C3AED' }}> <i className="bi bi-person"></i> </span>
                                <input id="registerUsername" type="text" name="username" className="form-control py-3 border-start-0" placeholder="Chọn tên tài khoản của bạn" autoComplete="username" value={formData.username} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="registerPassword" className="form-label fw-semibold"> Mật khẩu </label>
                            <div className="input-group">
                                <span className="input-group-text border-end-0" style={{ backgroundColor: '#F7F5FC', color: '#7C3AED' }}><i className="bi bi-lock"></i> </span>
                                <input id="registerPassword" type="password" name="password" className="form-control py-3 border-start-0" placeholder="Tạo mật khẩu của bạn" autoComplete="new-password" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <button type="submit" className="btn w-100 py-3 fw-semibold btn-custom-accent shadow-sm rounded-3" disabled={isLoading}>
                            {isLoading ? (<span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>) : (<i className="bi bi-person-plus-fill me-2"></i>)}
                            {isLoading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <span style={{ color: '#71677F' }}> Đã có tài khoản?{' '}</span>
                        <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#7C3AED' }}> Đăng nhập ngay <i className="bi bi-arrow-up-right ms-1"></i></Link>
                    </div>
                </div>

                <div className="col-md-5 p-4 p-lg-5 d-flex flex-column justify-content-between position-relative overflow-hidden" style={{ backgroundColor: '#7C3AED', color: '#FFFFFF' }}>
                    <div className="position-absolute rounded-circle" style={{ width: '240px', height: '240px', backgroundColor: 'rgba(217, 248, 85, 0.12)', right: '-120px', bottom: '-100px', pointerEvents: 'none' }}></div>
                    <div className="d-flex align-items-center gap-2 position-relative">
                        <span className="d-inline-flex align-items-center justify-content-center rounded-3" style={{ width: '40px', height: '40px', backgroundColor: '#D9F855', color: '#211A2E' }}> <i className="bi bi-chat-dots-fill"></i> </span>
                        <span className="fw-bold">App Chat</span>
                    </div>

                    <div className="position-relative my-4 my-md-5">
                        <h2 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.15 }}> Bạn mới. <br /> Chuyện mới.<br /><span style={{ color: '#D9F855' }}> Kết nối mới. </span> </h2>
                        <p className="mb-0" style={{ color: '#EDE9F4' }}>Tạo không gian trò chuyện của riêng bạn, gặp gỡ bạn bè và chia sẻ những điều thú vị mỗi ngày.</p>
                    </div>

                    <div className="d-none d-md-flex align-items-center gap-2 position-relative">
                        <i className="bi bi-stars" style={{ color: '#D9F855' }}></i>
                        <span className="small" style={{ color: '#EDE9F4' }}> Câu chuyện tiếp theo bắt đầu từ bạn. </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
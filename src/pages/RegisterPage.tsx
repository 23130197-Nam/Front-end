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
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg p-4 border-0 rounded-4" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ color: '#7C3AED' }}>Đăng Ký Tài Khoản</h2>
                    <p className="text-muted">Tham gia cùng cộng đồng trò chuyện ngay hôm nay</p>
                </div>

                {(localError || error) && (<div className="alert alert-danger py-2 small d-flex align-items-center" role="alert">
                     <i className="bi bi-exclamation-triangle-fill me-2"></i>
                     <div>{localError || error}</div></div>)}

                {successMessage && (<div className="alert alert-success py-2 small d-flex align-items-center" role="alert">
                     <i className="bi bi-check-circle-fill me-2"></i>
                     <div>{successMessage}</div></div>)}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên tài khoản (Username)</label>
                        <input type="text" name="username" className="form-control" placeholder="Nhập username..." value={formData.username} onChange={handleChange} required/>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input type="password" name="password" className="form-control" placeholder="Nhập mật khẩu..." value={formData.password} onChange={handleChange} required/>
                    </div>

                    <button type="submit" className="btn w-100 py-2 fw-semibold btn-custom-accent shadow-sm" disabled={isLoading}>
                        {isLoading ? (<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>) : (<i className="bi bi-person-plus-fill me-2"></i>)}
                        {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-muted">Đã có tài khoản? </span>
                    <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#7C3AED' }}>Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
}
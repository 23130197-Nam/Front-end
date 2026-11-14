import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerWithWebSocket } from "../features/auth/authAPI";
import { wsService } from "../services/websocketService";
import { authFailure } from "../features/auth/userReducer";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        phone_number: '',
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.user);

    useEffect(() => {
        wsService.connect();

        const handleRegisterResponse = (response: any) => {
            if (response.status === 'success') {
                alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
                navigate('/login');
            } else {
                dispatch(authFailure(response.message || 'Đăng ký thất bại!'));
            }
        };

        wsService.on('REGISTER', handleRegisterResponse);

        return () => {
            wsService.off('REGISTER', handleRegisterResponse);
        };
    }, [dispatch, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password || !formData.full_name) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc!');
            return;
        }
        registerWithWebSocket(formData, dispatch, () => {});
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg p-4 border-0 rounded-4" style={{ width: '100%', maxWidth: '450px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-success">Đăng Ký Tài Khoản</h2>
                    <p className="text-muted">Tham gia cùng cộng đồng trò chuyện ngay hôm nay</p>
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Họ và tên</label>
                        <input
                            type="text"
                            name="full_name"
                            className="form-control"
                            placeholder="Nhập họ tên của bạn..."
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên tài khoản (Username)</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Chọn username..."
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Nhập mật khẩu..."
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Số điện thoại (Tùy chọn)</label>
                        <input
                            type="text"
                            name="phone_number"
                            className="form-control"
                            placeholder="Nhập số điện thoại..."
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 py-2 fw-semibold" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : (
                            <i className="bi bi-person-plus-fill me-2"></i>
                        )}
                        {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-muted">Đã có tài khoản? </span>
                    <Link to="/login" className="text-decoration-none fw-semibold">Đăng nhập ngay</Link>
                </div>
            </div>
        </div>
    );
}
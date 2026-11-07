import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'

const usernamePattern = /^[A-Za-z0-9_]+$/

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState<
        'idle' | 'error' | 'success'
    >('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const normalizedUsername = username.trim()

        if (!normalizedUsername || !password || !confirmPassword) {
            setStatus('error')
            setMessage('Vui lòng nhập đầy đủ thông tin.')
            return
        }

        if (!usernamePattern.test(normalizedUsername)) {
            setStatus('error')
            setMessage(
                'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.',
            )
            return
        }

        if (password !== confirmPassword) {
            setStatus('error')
            setMessage('Mật khẩu xác nhận không trùng khớp.')
            return
        }

        setStatus('success')
        setMessage(
            'Dữ liệu hợp lệ. Chức năng đăng ký sẽ được kết nối sau.',
        )
    }

    return (
        <div className="auth-page">
            <section className="auth-card">
                <h1 className="auth-title">Đăng ký</h1>

                <p className="auth-description">
                    Tạo tài khoản để bắt đầu trò chuyện.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="register-username">
                            Tên đăng nhập
                        </label>

                        <input
                            id="register-username"
                            className="auth-input"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                            placeholder="Ví dụ: sinhvien_01"
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="register-password">
                            Mật khẩu
                        </label>

                        <input
                            id="register-password"
                            className="auth-input"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <div className="auth-field">
                        <label
                            className="auth-label"
                            htmlFor="register-confirm-password"
                        >
                            Xác nhận mật khẩu
                        </label>

                        <input
                            id="register-confirm-password"
                            className="auth-input"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>

                    {status !== 'idle' && (
                        <p
                            className={`auth-message ${
                                status === 'error'
                                    ? 'auth-message--error'
                                    : 'auth-message--success'
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    <button className="auth-button" type="submit">
                        Đăng ký
                    </button>
                </form>

                <p className="auth-switch">
                    Đã có tài khoản?{' '}
                    <Link className="auth-link" to="/login">
                        Đăng nhập
                    </Link>
                </p>
            </section>
        </div>
    )
}
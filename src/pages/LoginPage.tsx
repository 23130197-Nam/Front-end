import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState<
        'idle' | 'error' | 'success'
    >('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!username.trim() || !password) {
            setStatus('error')
            setMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.')
            return
        }

        setStatus('success')
        setMessage(
            'Dữ liệu hợp lệ. Chức năng đăng nhập sẽ được kết nối sau.',
        )
    }

    return (
        <div className="auth-page">
            <section className="auth-card">
                <h1 className="auth-title">Đăng nhập</h1>

                <p className="auth-description">
                    Đăng nhập để sử dụng ứng dụng chat.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="login-username">
                            Tên đăng nhập
                        </label>

                        <input
                            id="login-username"
                            className="auth-input"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                            placeholder="Nhập tên đăng nhập"
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="login-password">
                            Mật khẩu
                        </label>

                        <input
                            id="login-password"
                            className="auth-input"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            placeholder="Nhập mật khẩu"
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
                        Đăng nhập
                    </button>
                </form>

                <p className="auth-switch">
                    Chưa có tài khoản?{' '}
                    <Link className="auth-link" to="/register">
                        Đăng ký
                    </Link>
                </p>
            </section>
        </div>
    )
}
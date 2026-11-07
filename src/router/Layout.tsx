import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div>
            <header>
                <nav>
                    <Link to="/login">Đăng nhập</Link>
                    {' | '}
                    <Link to="/register">Đăng ký</Link>
                    {' | '}
                    <Link to="/chat">Chat</Link>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    )
}
import { Link } from 'react-router-dom'

export default function ErrorPage() {
    return (
        <section>
            <h1>Không tìm thấy trang</h1>
            <p>Đường dẫn bạn truy cập không tồn tại.</p>
            <Link to="/login">Quay về trang đăng nhập</Link>
        </section>
    )
}
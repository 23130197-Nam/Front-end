import ConversationList from '../features/chat/components/ConversationList'
import MainLayout from '../layouts/MainLayout'

export default function ChatPage() {
    return (
        <MainLayout sidebar={<ConversationList conversations={[]} />}>
            <header className="chat-content__header">
                <h1 id="chat-page-title">Ứng dụng Chat</h1>
                <p>Kết nối và trò chuyện cùng mọi người.</p>
            </header>

            <div className="chat-content__empty">
                <h2>Chào mừng bạn đến với Chat</h2>
                <p>
                    Chọn một cuộc trò chuyện để xem nội dung và bắt đầu nhắn tin.
                </p>
            </div>
        </MainLayout>
    )
}

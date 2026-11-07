import ConversationList from '../features/chat/components/ConversationList'
import MessageList from '../features/chat/components/MessageList'
import { mockConversations } from '../features/chat/mockConversations'
import { mockMessages } from '../features/chat/mockMessages'
import type { User } from '../features/users/types'
import MainLayout from '../layouts/MainLayout'

const currentUser: User = {
    id: 1,
    name: 'sinh_vien',
}

export default function ChatPage() {
    return (
        <MainLayout
            sidebar={<ConversationList conversations={mockConversations} />}
        >
            <header className="chat-content__header">
                <h1 id="chat-page-title">Ứng dụng Chat</h1>
                <p>Cuộc trò chuyện mẫu: Nhóm học React</p>
            </header>

            <MessageList
                messages={mockMessages}
                currentUserName={currentUser.name}
            />
        </MainLayout>
    )
}
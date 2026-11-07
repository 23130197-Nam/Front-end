import { useState } from 'react'
import ConversationList from '../features/chat/components/ConversationList'
import MessageInput from '../features/chat/components/MessageInput'
import MessageList from '../features/chat/components/MessageList'
import { mockConversations } from '../features/chat/mockConversations'
import { mockMessages } from '../features/chat/mockMessages'
import type { Message } from '../features/chat/types'
import type { User } from '../features/users/types'
import MainLayout from '../layouts/MainLayout'

const currentUser: User = {
    id: 1,
    name: 'sinh_vien',
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(mockMessages)

    const handleSendMessage = (content: string) => {
        const trimmedContent = content.trim()

        if (!trimmedContent) {
            return
        }

        const createdAt = new Date().toISOString()

        setMessages((previousMessages) => {
            const nextId = previousMessages.reduce(
                (maxId, message) => Math.max(maxId, message.id),
                0,
            ) + 1

            return [
                ...previousMessages,
                {
                    id: nextId,
                    sender: currentUser.name,
                    content: trimmedContent,
                    createdAt,
                },
            ]
        })
    }

    return (
        <MainLayout
            sidebar={<ConversationList conversations={mockConversations} />}
        >
            <header className="chat-content__header">
                <h1 id="chat-page-title">Ứng dụng Chat</h1>
                <p>Cuộc trò chuyện mẫu: Nhóm học React</p>
            </header>

            <MessageList
                messages={messages}
                currentUserName={currentUser.name}
            />

            <MessageInput onSend={handleSendMessage} />
        </MainLayout>
    )
}
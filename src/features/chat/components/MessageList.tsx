import type { Message } from '../types'
import MessageItem from './MessageItem'
import './MessageList.css'

type MessageListProps = {
    messages: Message[]
    currentUserName: string
}

export default function MessageList({ messages, currentUserName }: MessageListProps) {
    if (messages.length === 0) {
        return (
            <p className="message-list__empty">
                Chưa có tin nhắn nào trong cuộc trò chuyện này.
            </p>
        )
    }

    return (
        <ol className="message-list" aria-label="Danh sách tin nhắn">
            {messages.map((message) => (
                <MessageItem
                    key={message.id}
                    message={message}
                    isOwn={message.sender === currentUserName}
                />
            ))}
        </ol>
    )
}

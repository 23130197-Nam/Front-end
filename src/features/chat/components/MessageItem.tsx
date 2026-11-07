import type { Message } from '../types'

type MessageItemProps = {
    message: Message
    isOwn: boolean
}

export default function MessageItem({ message, isOwn }: MessageItemProps) {
    const createdAt = new Date(message.createdAt)
    const displayTime = createdAt.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <li className={`message-item${isOwn ? ' message-item--own' : ''}`}>
            <p className="message-item__sender">
                {isOwn ? 'Bạn' : message.sender}
            </p>

            <div className="message-item__bubble">
                <p className="message-item__content">{message.content}</p>
                <time
                    className="message-item__time"
                    dateTime={message.createdAt}
                    title={createdAt.toLocaleString('vi-VN')}
                >
                    {displayTime}
                </time>
            </div>
        </li>
    )
}

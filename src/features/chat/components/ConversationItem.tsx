export type Conversation = {
    name: string
    type: 0 | 1
    actionTime?: string
}

type ConversationItemProps = {
    conversation: Conversation
}

export default function ConversationItem({ conversation }: ConversationItemProps) {
    const isRoom = conversation.type === 1
    const avatarText = isRoom
        ? '#'
        : conversation.name.trim().charAt(0).toUpperCase()

    return (
        <li className="conversation-item">
            <span
                className={`conversation-item__avatar${
                    isRoom ? ' conversation-item__avatar--room' : ''
                }`}
                aria-hidden="true"
            >
                {avatarText}
            </span>

            <div className="conversation-item__content">
                <p className="conversation-item__name">{conversation.name}</p>
                <p className="conversation-item__type">
                    {isRoom ? 'Phòng chat' : 'Trò chuyện cá nhân'}
                </p>

                {conversation.actionTime && (
                    <time
                        className="conversation-item__time"
                        dateTime={conversation.actionTime.replace(' ', 'T')}
                    >
                        {conversation.actionTime}
                    </time>
                )}
            </div>
        </li>
    )
}

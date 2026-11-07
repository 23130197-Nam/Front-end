import ConversationItem, { type Conversation } from './ConversationItem'
import './ConversationList.css'

type ConversationListProps = {
    conversations: Conversation[]
}

export default function ConversationList({ conversations }: ConversationListProps) {
    if (conversations.length === 0) {
        return (
            <p className="conversation-list__empty">
                Chưa có cuộc trò chuyện nào.
            </p>
        )
    }

    return (
        <ul className="conversation-list" aria-label="Danh sách cuộc trò chuyện">
            {conversations.map((conversation) => (
                <ConversationItem
                    key={`${conversation.type}:${conversation.name}`}
                    conversation={conversation}
                />
            ))}
        </ul>
    )
}

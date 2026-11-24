import { usePeopleChatMessages } from '../hooks/usePeopleChatMessages';
import './PeopleMessageHistory.scss';

interface PeopleMessageHistoryProps {
  name: string;
  currentUsername: string;
  enabled: boolean;
}

export default function PeopleMessageHistory({
  name,
  currentUsername,
  enabled,
}: PeopleMessageHistoryProps) {
  const { messages, isLoading, error, retry } = usePeopleChatMessages(name, currentUsername, enabled);

  return (
      <div className="people-message-history" aria-busy={isLoading}>
        {(!enabled || !currentUsername || isLoading) ? (
            <div className="people-message-history__status text-center py-4" role="status">
              <span className="spinner-border spinner-border-sm me-2 text-custom-primary" aria-hidden="true"></span>
              {enabled && currentUsername ? 'Đang tải lịch sử tin nhắn...' : 'Đang khôi phục phiên đăng nhập...'}
            </div>
        ) : error ? (
            <div className="people-message-history__error alert" role="alert">
              <p className="mb-2">{error}</p>
              <button className="btn btn-custom-primary btn-sm" type="button" onClick={retry}>
                <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
                Thử lại
              </button>
            </div>
        ) : messages.length === 0 ? (
            <div className="people-message-history__status text-center py-4">
              <i className="bi bi-chat-left-text fs-3 d-block mb-2" aria-hidden="true"></i>
              <p className="mb-0">Chưa có tin nhắn với {name}.</p>
            </div>
        ) : (
            <ol className="list-unstyled d-flex flex-column gap-3 mb-0" aria-label={`Lịch sử tin nhắn với ${name}`}>
              {messages.map((message) => {
                const isOwn = message.name === currentUsername;
                const date = new Date(message.createAt.replace(' ', 'T'));
                const hasValidDate = !Number.isNaN(date.getTime());

                return (
                    <li
                        key={message.id}
                        className={`people-message-history__item d-flex flex-column ${isOwn ? 'align-self-end align-items-end' : 'align-self-start align-items-start'}`}
                    >
                      <span className="people-message-history__sender small mb-1">
                        {isOwn ? 'Bạn' : message.name}
                      </span>
                      <div className={`people-message-history__bubble rounded-3 px-3 py-2${isOwn ? ' people-message-history__bubble--own' : ''}`}>
                        <p className="people-message-history__text mb-1">{message.mes}</p>
                        <time
                            className="people-message-history__time small d-block text-end"
                            dateTime={hasValidDate ? message.createAt.replace(' ', 'T') : undefined}
                            title={message.createAt}
                        >
                          {hasValidDate
                              ? date.toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                              : message.createAt}
                        </time>
                      </div>
                    </li>
                );
              })}
            </ol>
        )}
      </div>
  );
}

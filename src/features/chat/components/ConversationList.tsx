import { useMemo, useState } from 'react';
import type { ConversationSummary } from '../../../types/chat.type';

interface ConversationListProps {
  conversations: ConversationSummary[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function ConversationList({
  conversations,
  isLoading,
  error,
  onRefresh,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase('vi');
    if (!normalizedSearchTerm) return conversations;

    return conversations.filter((conversation) =>
      conversation.name.toLocaleLowerCase('vi').includes(normalizedSearchTerm),
    );
  }, [conversations, searchTerm]);

  return (
    <>
      <div className="input-group mb-3">
        <input
          type="search"
          className="form-control"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tìm trong danh sách trò chuyện..."
          aria-label="Tìm cuộc trò chuyện"
        />
        <span className="input-group-text bg-white text-secondary">
          <i className="bi bi-search" aria-hidden="true"></i>
        </span>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="small text-muted">Cuộc trò chuyện gần đây</span>
        <button
          className="btn btn-sm text-custom-primary"
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Tải lại danh sách"
          title="Tải lại danh sách"
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </div>

      <div className="overflow-auto flex-grow-1">
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        {isLoading && conversations.length === 0 && (
          <div className="text-center text-muted py-4" role="status">
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Đang tải danh sách...
          </div>
        )}

        {!isLoading && !error && filteredConversations.length === 0 && (
          <p className="text-muted text-center py-4 mb-0">
            {searchTerm.trim()
              ? 'Không tìm thấy cuộc trò chuyện phù hợp.'
              : 'Chưa có cuộc trò chuyện nào.'}
          </p>
        )}

        {filteredConversations.length > 0 && (
          <div className="list-group list-group-flush">
            {filteredConversations.map((conversation) => (
              <button
                key={`${conversation.type}-${conversation.name}`}
                className="list-group-item list-group-item-action d-flex align-items-center gap-3 px-2"
                type="button"
              >
                <span
                  className="rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                    backgroundColor: '#EDE9F4',
                    color: '#7C3AED',
                  }}
                >
                  <i className={`bi ${conversation.type === 1 ? 'bi-people-fill' : 'bi-person-fill'}`}></i>
                </span>
                <span className="flex-grow-1 overflow-hidden text-start">
                  <span className="fw-semibold d-block text-truncate">
                    {conversation.name}
                  </span>
                  <span className="small text-muted d-block text-truncate">
                    {conversation.type === 1 ? 'Phòng chat' : 'Trò chuyện cá nhân'}
                  </span>
                </span>
                <time className="small text-muted flex-shrink-0" dateTime={conversation.actionTime}>
                  {conversation.actionTime}
                </time>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

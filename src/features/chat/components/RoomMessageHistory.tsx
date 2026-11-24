import { useLayoutEffect, useRef } from 'react';
import { useRoomChatMessages } from '../hooks/useRoomChatMessages';
import './RoomMessageHistory.scss';

interface RoomMessageHistoryProps {
  name: string;
  currentUsername: string;
  enabled: boolean;
}

export default function RoomMessageHistory({
  name,
  currentUsername,
  enabled,
}: RoomMessageHistoryProps) {
  const {
    messages,
    isLoading,
    error,
    retry,
    hasMore,
    isLoadingOlder,
    olderError,
    loadOlder,
  } = useRoomChatMessages(name, currentUsername, enabled);
  const historyRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<{
    element: HTMLElement;
    height: number;
    top: number;
  } | null>(null);

  const handleLoadOlder = () => {
    if (!hasMore || isLoading || isLoadingOlder || scrollPosition.current) return;

    const element = historyRef.current?.parentElement;
    if (element) {
      scrollPosition.current = { element, height: element.scrollHeight, top: element.scrollTop };
    }

    if (!loadOlder()) scrollPosition.current = null;
  };

  useLayoutEffect(() => {
    if (isLoadingOlder || !scrollPosition.current) return;

    const { element, height, top } = scrollPosition.current;
    element.scrollTop = top + element.scrollHeight - height;
    scrollPosition.current = null;
  }, [messages, isLoadingOlder, olderError, hasMore]);

  return (
      <div ref={historyRef} className="room-message-history" aria-busy={isLoading || isLoadingOlder}>
        {(!enabled || !currentUsername || isLoading) ? (
            <div className="room-message-history__status text-center py-4" role="status">
              <span className="spinner-border spinner-border-sm me-2 text-custom-primary" aria-hidden="true"></span>
              {enabled && currentUsername ? 'Đang tải lịch sử tin nhắn phòng...' : 'Đang khôi phục phiên đăng nhập...'}
            </div>
        ) : error ? (
            <div className="room-message-history__error alert" role="alert">
              <p className="mb-2">{error}</p>
              <button className="btn btn-custom-primary btn-sm" type="button" onClick={retry}>
                <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
                Thử lại
              </button>
            </div>
        ) : messages.length === 0 ? (
            <div className="room-message-history__status text-center py-4">
              <i className="bi bi-chat-left-text fs-3 d-block mb-2" aria-hidden="true"></i>
              <p className="mb-0">Phòng {name} chưa có tin nhắn.</p>
            </div>
        ) : (
            <>
              <div className="text-center mb-3">
                {hasMore ? (
                    <button
                        className="room-message-history__load-older btn btn-sm"
                        type="button"
                        onClick={handleLoadOlder}
                        disabled={isLoadingOlder}
                    >
                      {isLoadingOlder && (
                          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                      )}
                      {isLoadingOlder ? 'Đang tải tin nhắn cũ...' : olderError ? 'Thử tải lại tin nhắn cũ' : 'Tải tin nhắn cũ'}
                    </button>
                ) : (
                    <p className="room-message-history__status small mb-0">
                      Đã hiển thị toàn bộ tin nhắn phòng.
                    </p>
                )}
              </div>
              {olderError && (
                  <div className="room-message-history__error alert py-2 small" role="alert">
                    {olderError}
                  </div>
              )}
              <ol className="list-unstyled d-flex flex-column gap-3 mb-0" aria-label={`Lịch sử tin nhắn phòng ${name}`}>
              {messages.map((message) => {
                const isOwn = message.name === currentUsername;
                const date = new Date(message.createAt.replace(' ', 'T'));
                const hasValidDate = !Number.isNaN(date.getTime());

                return (
                    <li
                        key={message.id}
                        className={`room-message-history__item d-flex flex-column ${isOwn ? 'align-self-end align-items-end' : 'align-self-start align-items-start'}`}
                    >
                      <span className="room-message-history__sender small mb-1">
                        {isOwn ? 'Bạn' : message.name}
                      </span>
                      <div className={`room-message-history__bubble rounded-3 px-3 py-2${isOwn ? ' room-message-history__bubble--own' : ''}`}>
                        <p className="room-message-history__text mb-1">{message.mes}</p>
                        <time
                            className="room-message-history__time small d-block text-end"
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
            </>
        )}
      </div>
  );
}

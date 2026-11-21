import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { wsService } from '../../../services/websocketService';
import type { JoinRoomResponse } from '../../../types/chat.type';
import { joinRoomWithWebSocket } from '../roomAPI';

interface JoinRoomModalProps {
  onJoined: () => void;
}

interface Feedback {
  type: 'success' | 'danger';
  message: string;
}

export default function JoinRoomModal({ onJoined }: JoinRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const handleJoinRoom = (response: JoinRoomResponse) => {
      console.log('[JOIN_ROOM] Response:', response);
      setIsSubmitting(false);

      if (response.status === 'success') {
        setRoomName('');
        setFeedback({
          type: 'success',
          message: `Đã tham gia phòng “${response.data.name}” thành công.`,
        });
        onJoined();
        return;
      }

      setFeedback({
        type: 'danger',
        message: response.mes || 'Không thể tham gia phòng chat.',
      });
    };

    wsService.on('JOIN_ROOM', handleJoinRoom);
    return () => {
      wsService.off('JOIN_ROOM', handleJoinRoom);
    };
  }, [onJoined]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedRoomName = roomName.trim();

    if (!normalizedRoomName) {
      setFeedback({ type: 'danger', message: 'Vui lòng nhập tên phòng.' });
      return;
    }

    setFeedback(null);
    setIsSubmitting(true);
    joinRoomWithWebSocket(normalizedRoomName);
  };

  return (
    <div
      className="modal fade"
      id="joinRoomModal"
      tabIndex={-1}
      aria-labelledby="joinRoomModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <form className="modal-content border-0 rounded-4" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title fw-bold" id="joinRoomModalLabel">
              Tham gia phòng
            </h5>
            <button
              className="btn-close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Đóng"
            ></button>
          </div>
          <div className="modal-body">
            <label htmlFor="joinRoomName" className="form-label fw-semibold">
              Tên phòng
            </label>
            <input
              id="joinRoomName"
              type="text"
              className="form-control"
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              placeholder="Nhập chính xác tên phòng..."
              disabled={isSubmitting}
              autoComplete="off"
            />
            {feedback && (
              <div className={`alert alert-${feedback.type} py-2 mt-3 mb-0`} role="alert">
                {feedback.message}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              type="button"
              data-bs-dismiss="modal"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button className="btn btn-custom-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              )}
              Tham gia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

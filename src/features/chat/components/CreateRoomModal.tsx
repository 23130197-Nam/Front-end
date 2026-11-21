import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { wsService } from '../../../services/websocketService';
import type { CreateRoomResponse } from '../../../types/chat.type';
import { createRoomWithWebSocket } from '../roomAPI';

interface CreateRoomModalProps {
  onCreated: () => void;
}

interface Feedback {
  type: 'success' | 'danger';
  message: string;
}

export default function CreateRoomModal({ onCreated }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const handleCreateRoom = (response: CreateRoomResponse) => {
      console.log('[CREATE_ROOM] Response:', response);
      setIsSubmitting(false);

      if (response.status === 'success') {
        setRoomName('');
        setFeedback({
          type: 'success',
          message: `Đã tạo phòng “${response.data.name}” thành công.`,
        });
        onCreated();
        return;
      }

      setFeedback({
        type: 'danger',
        message: response.mes || 'Không thể tạo phòng chat.',
      });
    };

    wsService.on('CREATE_ROOM', handleCreateRoom);
    return () => {
      wsService.off('CREATE_ROOM', handleCreateRoom);
    };
  }, [onCreated]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedRoomName = roomName.trim();

    if (!normalizedRoomName) {
      setFeedback({ type: 'danger', message: 'Vui lòng nhập tên phòng.' });
      return;
    }

    setFeedback(null);
    setIsSubmitting(true);
    createRoomWithWebSocket(normalizedRoomName);
  };

  return (
    <div
      className="modal fade"
      id="createRoomModal"
      tabIndex={-1}
      aria-labelledby="createRoomModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <form className="modal-content border-0 rounded-4" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title fw-bold" id="createRoomModalLabel">
              Tạo phòng chat
            </h5>
            <button
              className="btn-close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Đóng"
            ></button>
          </div>
          <div className="modal-body">
            <label htmlFor="createRoomName" className="form-label fw-semibold">
              Tên phòng
            </label>
            <input
              id="createRoomName"
              type="text"
              className="form-control"
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              placeholder="Nhập tên phòng mới..."
              disabled={isSubmitting}
              autoComplete="off"
            />
            <div className="form-text">
              Bạn sẽ là chủ phòng sau khi tạo thành công.
            </div>
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
              Tạo phòng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

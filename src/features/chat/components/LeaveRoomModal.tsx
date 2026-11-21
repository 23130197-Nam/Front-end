import { useEffect, useState } from 'react';
import { wsService } from '../../../services/websocketService';
import type { OutRoomResponse } from '../../../types/chat.type';
import { outRoomWithWebSocket } from '../roomAPI';

interface LeaveRoomModalProps {
  roomName: string | null;
  onLeft: () => void;
}

interface Feedback {
  type: 'success' | 'danger';
  message: string;
}

export default function LeaveRoomModal({ roomName, onLeft }: LeaveRoomModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const handleOutRoom = (response: OutRoomResponse) => {
      console.log('[OUT_ROOM] Response:', response);
      setIsSubmitting(false);

      if (response.status === 'success') {
        setFeedback({
          type: 'success',
          message: response.data.mes || 'Đã rời phòng thành công.',
        });
        onLeft();
        return;
      }

      setFeedback({
        type: 'danger',
        message: response.mes || 'Không thể rời phòng chat.',
      });
    };

    wsService.on('OUT_ROOM', handleOutRoom);
    return () => {
      wsService.off('OUT_ROOM', handleOutRoom);
    };
  }, [onLeft]);

  const handleLeaveRoom = () => {
    if (!roomName) {
      setFeedback({ type: 'danger', message: 'Vui lòng chọn phòng muốn rời.' });
      return;
    }

    setFeedback(null);
    setIsSubmitting(true);
    outRoomWithWebSocket(roomName);
  };

  return (
    <div
      className="modal fade"
      id="leaveRoomModal"
      tabIndex={-1}
      aria-labelledby="leaveRoomModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header">
            <h5 className="modal-title fw-bold" id="leaveRoomModalLabel">
              Rời phòng chat
            </h5>
            <button
              className="btn-close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Đóng"
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Bạn có chắc muốn rời phòng <strong>{roomName || ''}</strong> không?
            </p>
            <div className="form-text mt-2">
              Chủ phòng không thể tự rời phòng.
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
            <button
              className="btn btn-danger"
              type="button"
              onClick={handleLeaveRoom}
              disabled={isSubmitting || !roomName}
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              )}
              Rời phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

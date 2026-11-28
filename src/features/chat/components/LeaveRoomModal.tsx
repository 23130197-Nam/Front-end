import type { RoomOperationState } from '../chatReducer';

interface LeaveRoomModalProps {
  roomName: string | null;
  operation: RoomOperationState;
  onLeave: (roomName: string) => void;
}

export default function LeaveRoomModal({
  roomName,
  operation,
  onLeave,
}: LeaveRoomModalProps) {
  const isSubmitting = operation.status === 'loading';

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
            {operation.message && (
              <div
                className={`alert alert-${operation.status === 'succeeded' ? 'success' : 'danger'} py-2 mt-3 mb-0`}
                role="alert"
              >
                {operation.message}
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
              onClick={() => roomName && onLeave(roomName)}
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

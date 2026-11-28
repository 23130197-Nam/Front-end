import { useState } from 'react';
import type { FormEvent } from 'react';
import type { RoomOperationState } from '../chatReducer';

interface JoinRoomModalProps {
  operation: RoomOperationState;
  onJoin: (roomName: string) => void;
  onReset: () => void;
}

export default function JoinRoomModal({
  operation,
  onJoin,
  onReset,
}: JoinRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const isSubmitting = operation.status === 'loading';
  const displayedRoomName = operation.status === 'succeeded' ? '' : roomName;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onJoin(displayedRoomName);
  };

  const handleRoomNameChange = (value: string) => {
    setRoomName(value);
    if (operation.status !== 'idle') onReset();
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
              value={displayedRoomName}
              onChange={(event) => handleRoomNameChange(event.target.value)}
              placeholder="Nhập chính xác tên phòng..."
              disabled={isSubmitting}
              autoComplete="off"
            />
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

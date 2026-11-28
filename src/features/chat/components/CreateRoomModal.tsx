import { useState } from 'react';
import type { FormEvent } from 'react';
import type { RoomOperationState } from '../chatReducer';

interface CreateRoomModalProps {
  operation: RoomOperationState;
  onCreate: (roomName: string) => void;
  onReset: () => void;
}

export default function CreateRoomModal({
  operation,
  onCreate,
  onReset,
}: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const isSubmitting = operation.status === 'loading';
  const displayedRoomName = operation.status === 'succeeded' ? '' : roomName;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreate(displayedRoomName);
  };

  const handleRoomNameChange = (value: string) => {
    setRoomName(value);
    if (operation.status !== 'idle') onReset();
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
              value={displayedRoomName}
              onChange={(event) => handleRoomNameChange(event.target.value)}
              placeholder="Nhập tên phòng mới..."
              disabled={isSubmitting}
              autoComplete="off"
            />
            <div className="form-text">
              Bạn sẽ là chủ phòng sau khi tạo thành công.
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

import { useCallback, useEffect } from 'react';
import { wsService } from '../../../services/websocketService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type {
  CreateRoomResponse,
  JoinRoomResponse,
  OutRoomResponse,
} from '../../../types/chat.type';
import {
  createRoomWithWebSocket,
  joinRoomWithWebSocket,
  outRoomWithWebSocket,
} from '../roomAPI';
import {
  roomOperationFailed,
  roomOperationReset,
  roomOperationStarted,
  roomOperationSucceeded,
} from '../chatReducer';
import type { RoomOperation } from '../chatReducer';

const emptyRoomNameMessage: Record<RoomOperation, string> = {
  create: 'Vui lòng nhập tên phòng.',
  join: 'Vui lòng nhập tên phòng.',
  leave: 'Vui lòng chọn phòng muốn rời.',
};

export const useRoomManagement = (onRoomsChanged: () => void) => {
  const dispatch = useAppDispatch();
  const operations = useAppSelector((state) => state.chat.roomOperations);

  useEffect(() => {
    const handleCreateRoom = (response: CreateRoomResponse) => {
      console.log('[CREATE_ROOM] Response:', response);

      if (response.status === 'success') {
        dispatch(roomOperationSucceeded({
          operation: 'create',
          message: `Đã tạo phòng “${response.data.name}” thành công.`,
        }));
        onRoomsChanged();
        return;
      }

      dispatch(roomOperationFailed({
        operation: 'create',
        message: response.mes || 'Không thể tạo phòng chat.',
      }));
    };

    const handleJoinRoom = (response: JoinRoomResponse) => {
      console.log('[JOIN_ROOM] Response:', response);

      if (response.status === 'success') {
        dispatch(roomOperationSucceeded({
          operation: 'join',
          message: `Đã tham gia phòng “${response.data.name}” thành công.`,
        }));
        onRoomsChanged();
        return;
      }

      dispatch(roomOperationFailed({
        operation: 'join',
        message: response.mes || 'Không thể tham gia phòng chat.',
      }));
    };

    const handleOutRoom = (response: OutRoomResponse) => {
      console.log('[OUT_ROOM] Response:', response);

      if (response.status === 'success') {
        dispatch(roomOperationSucceeded({
          operation: 'leave',
          message: response.data.mes || 'Đã rời phòng thành công.',
        }));
        onRoomsChanged();
        return;
      }

      dispatch(roomOperationFailed({
        operation: 'leave',
        message: response.mes || 'Không thể rời phòng chat.',
      }));
    };

    wsService.on('CREATE_ROOM', handleCreateRoom);
    wsService.on('JOIN_ROOM', handleJoinRoom);
    wsService.on('OUT_ROOM', handleOutRoom);

    return () => {
      wsService.off('CREATE_ROOM', handleCreateRoom);
      wsService.off('JOIN_ROOM', handleJoinRoom);
      wsService.off('OUT_ROOM', handleOutRoom);
    };
  }, [dispatch, onRoomsChanged]);

  const runOperation = useCallback((operation: RoomOperation, name: string) => {
    const roomName = name.trim();

    if (!roomName) {
      dispatch(roomOperationFailed({
        operation,
        roomName,
        message: emptyRoomNameMessage[operation],
      }));
      return;
    }

    dispatch(roomOperationStarted({ operation, roomName }));

    try {
      if (operation === 'create') createRoomWithWebSocket(roomName);
      else if (operation === 'join') joinRoomWithWebSocket(roomName);
      else outRoomWithWebSocket(roomName);
    } catch (error) {
      dispatch(roomOperationFailed({
        operation,
        roomName,
        message: error instanceof Error
          ? error.message
          : 'Không thể gửi yêu cầu đến máy chủ.',
      }));
    }
  }, [dispatch]);

  const resetOperation = useCallback((operation: RoomOperation) => {
    dispatch(roomOperationReset(operation));
  }, [dispatch]);

  return {
    operations,
    createRoom: (name: string) => runOperation('create', name),
    joinRoom: (name: string) => runOperation('join', name),
    leaveRoom: (name: string) => runOperation('leave', name),
    resetOperation,
  };
};

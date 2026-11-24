import { wsService } from '../../services/websocketService';
import type { GetRoomChatMessagesRequest } from '../../types/chat.type';

export const ROOM_CHAT_HISTORY_EVENT = 'CHAT_PEOPLE_GET_MES';
export const ROOM_CHAT_HISTORY_ERROR_EVENT = 'GET_ROOM_CHAT_MES';

export const joinRoomWithWebSocket = (name: string): void => {
  wsService.send({
    action: 'onchat',
    data: {
      event: 'JOIN_ROOM',
      data: {
        name,
      },
    },
  });

  console.log('[ROOM_API] Đã gửi yêu cầu JOIN_ROOM:', { name });
};

export const createRoomWithWebSocket = (name: string): void => {
  wsService.send({
    action: 'onchat',
    data: {
      event: 'CREATE_ROOM',
      data: {
        name,
      },
    },
  });

  console.log('[ROOM_API] Đã gửi yêu cầu CREATE_ROOM:', { name });
};

export const outRoomWithWebSocket = (name: string): void => {
  wsService.send({
    action: 'onchat',
    data: {
      event: 'OUT_ROOM',
      data: {
        name,
      },
    },
  });

  console.log('[ROOM_API] Đã gửi yêu cầu OUT_ROOM:', { name });
};

export const getRoomChatMessagesWithWebSocket = (
    name: string,
    page: number = 1,
): void => {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error('Vui lòng cung cấp tên phòng cần lấy lịch sử tin nhắn.');
  }

  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('Số trang phải là số nguyên lớn hơn hoặc bằng 1.');
  }

  const data: GetRoomChatMessagesRequest = {
    name: normalizedName,
    page,
  };

  wsService.send({
    action: 'onchat',
    data: {
      event: ROOM_CHAT_HISTORY_EVENT,
      data,
    },
  });

  console.log('[ROOM_API] Yêu cầu lịch sử tin nhắn phòng:', data);
};

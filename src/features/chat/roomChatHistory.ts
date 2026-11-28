import { wsService } from '../../services/websocketService';
import type {
  GetRoomChatMessagesResponse,
  Message,
  RoomChatHistoryData,
  RoomMember,
} from '../../types/chat.type';
import {
  getRoomChatMessagesWithWebSocket,
  ROOM_CHAT_HISTORY_EVENT,
  ROOM_CHAT_HISTORY_ERROR_EVENT,
} from './roomAPI';

const HISTORY_TIMEOUT_MS = 15000;
export const ROOM_CHAT_PAGE_SIZE = 50;
let requestQueue: Promise<void> = Promise.resolve();

const compareMessages = (first: Message, second: Message): number =>
    first.createAt.localeCompare(second.createAt) || first.id - second.id;

const isRoomMember = (value: unknown): value is RoomMember => {
  if (typeof value !== 'object' || value === null) return false;
  const member = value as Record<string, unknown>;
  return Number.isInteger(member.id) &&
      (member.name === undefined || typeof member.name === 'string');
};

const isRoomMessage = (value: unknown, roomName: string): value is Message => {
  if (typeof value !== 'object' || value === null) return false;
  const message = value as Record<string, unknown>;
  return Number.isInteger(message.id) &&
      typeof message.name === 'string' &&
      message.to === roomName &&
      typeof message.mes === 'string' &&
      typeof message.createAt === 'string' &&
      message.type === 1;
};

export const getRoomChatHistory = (
  name: string,
  signal: AbortSignal,
  page: number = 1,
): Promise<RoomChatHistoryData> => {
  const roomName = name.trim();
  const request = requestQueue.then(() => {
    signal.throwIfAborted();

    return new Promise<RoomChatHistoryData>((resolve, reject) => {
      const finish = (error: Error | null, data?: RoomChatHistoryData) => {
        clearTimeout(timeoutId);
        wsService.off(ROOM_CHAT_HISTORY_EVENT, handleSuccess);
        wsService.off(ROOM_CHAT_HISTORY_ERROR_EVENT, handleError);

        if (signal.aborted) {
          reject(new DOMException('Yêu cầu đã bị hủy.', 'AbortError'));
        } else if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        }
      };

      const handleSuccess = (response: GetRoomChatMessagesResponse) => {
        if (response.status !== 'success' || typeof response.data !== 'object' ||
            response.data === null || Array.isArray(response.data)) return;

        const data = response.data;
        if (data.name !== roomName) return;

        if (!Array.isArray(data.user) || !data.user.every(isRoomMember) ||
            !Array.isArray(data.chatMess) ||
            !data.chatMess.every((message) => isRoomMessage(message, roomName))) {
          finish(new Error('Dữ liệu lịch sử tin nhắn phòng không hợp lệ.'));
          return;
        }

        const chatMess = [...data.chatMess].sort(compareMessages);
        finish(null, { ...data, chatMess });
      };

      const handleError = (response: GetRoomChatMessagesResponse) => {
        if (response.status === 'error') {
          finish(new Error(response.mes || 'Không thể tải lịch sử tin nhắn phòng.'));
        }
      };

      const timeoutId = setTimeout(() => {
        finish(new Error('Máy chủ chưa phản hồi lịch sử phòng. Vui lòng thử lại.'));
      }, HISTORY_TIMEOUT_MS);

      wsService.on(ROOM_CHAT_HISTORY_EVENT, handleSuccess);
      wsService.on(ROOM_CHAT_HISTORY_ERROR_EVENT, handleError);

      try {
        getRoomChatMessagesWithWebSocket(roomName, page);
      } catch (error) {
        finish(error instanceof Error ? error : new Error('Không thể gửi yêu cầu tin nhắn phòng.'));
      }
    });
  });

  requestQueue = request.then(() => undefined, () => undefined);
  return request;
};

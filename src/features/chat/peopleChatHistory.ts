import { wsService } from '../../services/websocketService';
import type { GetPeopleChatMessagesResponse, Message } from '../../types/chat.type';
import { getPeopleChatMessagesWithWebSocket, PEOPLE_CHAT_HISTORY_EVENT } from './chatAPI';

const HISTORY_TIMEOUT_MS = 15000;
export const PEOPLE_CHAT_PAGE_SIZE = 50;
let requestQueue: Promise<void> = Promise.resolve();

const compareMessages = (first: Message, second: Message): number =>
    first.createAt.localeCompare(second.createAt) || first.id - second.id;

const isMessage = (value: unknown): value is Message => {
  if (typeof value !== 'object' || value === null) return false;

  const message = value as Record<string, unknown>;
  return Number.isInteger(message.id) &&
      typeof message.name === 'string' &&
      typeof message.to === 'string' &&
      typeof message.mes === 'string' &&
      typeof message.createAt === 'string' &&
      (message.type === 0 || message.type === 1);
};

export const getPeopleChatHistory = (
  name: string,
  currentUsername: string,
  signal: AbortSignal,
  page: number = 1,
): Promise<Message[]> => {
  const request = requestQueue.then(() => {
    signal.throwIfAborted();

    return new Promise<Message[]>((resolve, reject) => {
      const finish = (error: Error | null, messages: Message[] = []) => {
        clearTimeout(timeoutId);
        wsService.off(PEOPLE_CHAT_HISTORY_EVENT, handleResponse);

        if (signal.aborted) {
          reject(new DOMException('Yêu cầu đã bị hủy.', 'AbortError'));
        } else if (error) {
          reject(error);
        } else {
          resolve(messages);
        }
      };

      const handleResponse = (response: GetPeopleChatMessagesResponse) => {
        if (response.status === 'error') {
          finish(new Error(response.mes || 'Không thể tải lịch sử tin nhắn.'));
          return;
        }

        // Phản hồi lịch sử phòng dùng chung event nhưng data là object.
        if (response.status !== 'success' || !Array.isArray(response.data)) return;

        if (!response.data.every(isMessage)) {
          finish(new Error('Dữ liệu lịch sử tin nhắn không hợp lệ.'));
          return;
        }

        const belongsToConversation = response.data.every((message) =>
            message.type === 0 && (
              (message.name === name && message.to === currentUsername) ||
              (message.name === currentUsername && message.to === name)
            ),
        );
        if (!belongsToConversation) return;

        const messages = [...response.data].sort(compareMessages);
        finish(null, messages);
      };

      const timeoutId = setTimeout(() => {
        finish(new Error('Máy chủ chưa phản hồi. Vui lòng thử lại.'));
      }, HISTORY_TIMEOUT_MS);

      wsService.on(PEOPLE_CHAT_HISTORY_EVENT, handleResponse);

      try {
        getPeopleChatMessagesWithWebSocket(name, page);
      } catch (error) {
        finish(error instanceof Error ? error : new Error('Không thể gửi yêu cầu tin nhắn.'));
      }
    });
  });

  requestQueue = request.then(() => undefined, () => undefined);
  return request;
};

import { wsService } from '../../services/websocketService';
import type { GetPeopleChatMessagesRequest } from '../../types/chat.type';

export const PEOPLE_CHAT_HISTORY_EVENT = 'CHAT_PEOPLE_GET_MES';

export const getUserListWithWebSocket = (): void => {
  wsService.send({
    action: 'onchat',
    data: {
      event: 'GET_USER_LIST',
      data: {},
    },
  });

  console.log('[CHAT_API] Đã gửi yêu cầu GET_USER_LIST');
};

export const getPeopleChatMessagesWithWebSocket = (
  name: string,
  page: number = 1,
): void => {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error('Vui lòng cung cấp tên người dùng cần lấy lịch sử tin nhắn.');
  }

  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError('Số trang phải là số nguyên lớn hơn hoặc bằng 1.');
  }

  const data: GetPeopleChatMessagesRequest = {
    name: normalizedName,
    page,
  };

  wsService.send({
    action: 'onchat',
    data: {
      event: PEOPLE_CHAT_HISTORY_EVENT,
      data,
    },
  });

  console.log('[CHAT_API] Yêu cầu lịch sử tin nhắn cá nhân:', data);
};

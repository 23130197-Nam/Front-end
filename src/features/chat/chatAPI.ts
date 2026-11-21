import { wsService } from '../../services/websocketService';

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

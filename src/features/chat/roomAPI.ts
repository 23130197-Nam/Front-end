import { wsService } from '../../services/websocketService';

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

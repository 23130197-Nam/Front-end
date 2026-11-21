import { wsService } from '../../services/websocketService';

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

export interface Message {
  id_message?: number;
  sender_id: number;
  receiver_id?: number;
  room_id?: number;
  content: string;
  created_at?: string;
  sender_name?: string;
}

export interface ChatRoom {
  id_room: number;
  room_name?: string;
  is_group: boolean;
  last_message?: string;
  updated_at?: string;
}

export interface ChatPayload {
  action: 'SEND_MESSAGE' | 'GET_ROOMS' | 'GET_MESSAGES' | 'JOIN_ROOM';
  data: {
    room_id?: number;
    receiver_id?: number;
    content?: string;
    [key: string]: any;
  };
}
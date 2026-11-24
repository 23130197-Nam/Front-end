export type ConversationType = 0 | 1;

export interface ConversationSummary {
  name: string;
  type: ConversationType;
  actionTime: string;
}

export interface RoomMember {
  id: number;
  name?: string;
}

export interface RoomData {
  name: string;
  user: RoomMember[];
}

export interface WebSocketSuccessResponse<TData> {
  status: 'success';
  event: string;
  data: TData;
}

export interface WebSocketErrorResponse {
  status: 'error';
  event: string;
  mes: string;
}

export type WebSocketResponse<TData> =
    | WebSocketSuccessResponse<TData>
    | WebSocketErrorResponse;

export type GetUserListResponse = WebSocketResponse<ConversationSummary[]>;
export type CreateRoomResponse = WebSocketResponse<RoomData>;
export type JoinRoomResponse = WebSocketResponse<RoomData>;
export type OutRoomResponse = WebSocketResponse<{ mes: string }>;

export interface Message {
  id: number;
  name: string;
  to: string;
  mes: string;
  createAt: string;
  type: ConversationType;
}

export interface GetPeopleChatMessagesRequest {
  name: string;
  page: number;
}

export type GetPeopleChatMessagesResponse = WebSocketResponse<Message[]>;

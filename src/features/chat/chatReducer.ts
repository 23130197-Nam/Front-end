import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ConversationSummary,
  ConversationType,
  Message,
} from '../../types/chat.type';

export type RoomOperation = 'create' | 'join' | 'leave';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ChatHistoryState {
  name: string;
  type: ConversationType;
  messages: Message[];
  status: RequestStatus;
  error: string | null;
  page: number;
  hasMore: boolean;
  isLoadingOlder: boolean;
  olderError: string | null;
}

export interface RoomOperationState {
  status: RequestStatus;
  roomName: string | null;
  message: string | null;
}

interface ChatState {
  conversations: ConversationSummary[];
  selectedConversation: ConversationSummary | null;
  conversationStatus: RequestStatus;
  conversationError: string | null;
  histories: Record<string, ChatHistoryState>;
  roomOperations: Record<RoomOperation, RoomOperationState>;
}

const createRoomOperationState = (): RoomOperationState => ({
  status: 'idle',
  roomName: null,
  message: null,
});

const initialState: ChatState = {
  conversations: [],
  selectedConversation: null,
  conversationStatus: 'idle',
  conversationError: null,
  histories: {},
  roomOperations: {
    create: createRoomOperationState(),
    join: createRoomOperationState(),
    leave: createRoomOperationState(),
  },
};

export const getConversationKey = (
  type: ConversationType,
  name: string,
): string => `${type}:${name}`;

const compareMessages = (first: Message, second: Message): number =>
  first.createAt.localeCompare(second.createAt) || first.id - second.id;

const mergeMessages = (current: Message[], incoming: Message[]): Message[] => {
  const messagesById = new Map<number, Message>();
  incoming.forEach((message) => messagesById.set(message.id, message));
  current.forEach((message) => messagesById.set(message.id, message));
  return [...messagesById.values()].sort(compareMessages);
};

export const chatReducer = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    conversationListStarted: (state) => {
      state.conversationStatus = 'loading';
      state.conversationError = null;
    },
    conversationListSucceeded: (
      state,
      action: PayloadAction<ConversationSummary[]>,
    ) => {
      state.conversations = action.payload;
      state.conversationStatus = 'succeeded';
      state.conversationError = null;
    },
    conversationListFailed: (state, action: PayloadAction<string>) => {
      state.conversationStatus = 'failed';
      state.conversationError = action.payload;
    },
    conversationSelected: (state, action: PayloadAction<ConversationSummary | null>,) => {
      state.selectedConversation = action.payload;
    },
    historyLoadStarted: (
      state,
      action: PayloadAction<{
        key: string;
        name: string;
        type: ConversationType;
      }>,
    ) => {
      const { key, name, type } = action.payload;
      state.histories[key] = {
        name,
        type,
        messages: [],
        status: 'loading',
        error: null,
        page: 0,
        hasMore: false,
        isLoadingOlder: false,
        olderError: null,
      };
    },
    historyLoadSucceeded: (
      state,
      action: PayloadAction<{
        key: string;
        messages: Message[];
        pageSize: number;
      }>,
    ) => {
      const history = state.histories[action.payload.key];
      if (!history) return;

      history.messages = mergeMessages([], action.payload.messages);
      history.status = 'succeeded';
      history.error = null;
      history.page = 1;
      history.hasMore = action.payload.messages.length >= action.payload.pageSize;
      history.isLoadingOlder = false;
      history.olderError = null;
    },
    historyLoadFailed: (
      state,
      action: PayloadAction<{ key: string; error: string }>,
    ) => {
      const history = state.histories[action.payload.key];
      if (!history) return;

      history.status = 'failed';
      history.error = action.payload.error;
      history.messages = [];
      history.page = 0;
      history.hasMore = false;
      history.isLoadingOlder = false;
      history.olderError = null;
    },
    olderHistoryLoadStarted: (state, action: PayloadAction<string>) => {
      const history = state.histories[action.payload];
      if (!history) return;

      history.isLoadingOlder = true;
      history.olderError = null;
    },
    olderHistoryLoadSucceeded: (
      state,
      action: PayloadAction<{
        key: string;
        messages: Message[];
        page: number;
        pageSize: number;
      }>,
    ) => {
      const history = state.histories[action.payload.key];
      if (!history) return;

      history.messages = mergeMessages(history.messages, action.payload.messages);
      history.page = action.payload.page;
      history.hasMore = action.payload.messages.length >= action.payload.pageSize;
      history.isLoadingOlder = false;
      history.olderError = null;
    },
    olderHistoryLoadFailed: (
      state,
      action: PayloadAction<{ key: string; error: string }>,
    ) => {
      const history = state.histories[action.payload.key];
      if (!history) return;

      history.isLoadingOlder = false;
      history.olderError = action.payload.error;
    },
    roomOperationStarted: (
      state,
      action: PayloadAction<{ operation: RoomOperation; roomName: string }>,
    ) => {
      state.roomOperations[action.payload.operation] = {
        status: 'loading',
        roomName: action.payload.roomName,
        message: null,
      };
    },
    roomOperationSucceeded: (
      state,
      action: PayloadAction<{ operation: RoomOperation; message: string }>,
    ) => {
      const operation = state.roomOperations[action.payload.operation];
      operation.status = 'succeeded';
      operation.message = action.payload.message;

      if (action.payload.operation === 'leave' && state.selectedConversation?.type === 1 && state.selectedConversation.name === operation.roomName) {
        state.selectedConversation = null;
      }
    },
    roomOperationFailed: (
      state,
      action: PayloadAction<{
        operation: RoomOperation;
        roomName?: string;
        message: string;
      }>,
    ) => {
      const operation = state.roomOperations[action.payload.operation];
      operation.status = 'failed';
      operation.roomName = action.payload.roomName ?? operation.roomName;
      operation.message = action.payload.message;
    },
    roomOperationReset: (state, action: PayloadAction<RoomOperation>) => {
      state.roomOperations[action.payload] = createRoomOperationState();
    },
    chatCleared: () => initialState,
  },
});

export const {
  conversationListStarted,
  conversationListSucceeded,
  conversationListFailed,
  conversationSelected,
  historyLoadStarted,
  historyLoadSucceeded,
  historyLoadFailed,
  olderHistoryLoadStarted,
  olderHistoryLoadSucceeded,
  olderHistoryLoadFailed,
  roomOperationStarted,
  roomOperationSucceeded,
  roomOperationFailed,
  roomOperationReset,
  chatCleared,
} = chatReducer.actions;

export default chatReducer.reducer;

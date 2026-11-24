import { useCallback, useEffect, useRef, useState } from 'react';
import type { Message } from '../../../types/chat.type';
import {
  getRoomChatHistory,
  mergeRoomChatMessages,
  ROOM_CHAT_PAGE_SIZE,
} from '../roomChatHistory';

interface RoomHistoryState {
  name: string | null;
  username: string;
  requestVersion: number;
  messages: Message[];
  error: string | null;
  page: number;
  hasMore: boolean;
  isLoadingOlder: boolean;
  olderError: string | null;
}

export const useRoomChatMessages = (
  name: string,
  currentUsername: string,
  enabled: boolean,
) => {
  const [retryCount, setRetryCount] = useState(0);
  const olderRequest = useRef<AbortController | null>(null);
  const [state, setState] = useState<RoomHistoryState>({
    name: null,
    username: '',
    requestVersion: -1,
    messages: [],
    error: null,
    page: 0,
    hasMore: false,
    isLoadingOlder: false,
    olderError: null,
  });
  const canLoad = enabled && name !== '' && currentUsername !== '';

  useEffect(() => {
    if (!canLoad) return;

    const controller = new AbortController();
    const requestState = { name, username: currentUsername, requestVersion: retryCount };

    getRoomChatHistory(name, controller.signal).then(
        (data) => {
          if (controller.signal.aborted) return;
          setState({
            ...requestState,
            messages: mergeRoomChatMessages([], data.chatMess),
            error: null,
            page: 1,
            hasMore: data.chatMess.length >= ROOM_CHAT_PAGE_SIZE,
            isLoadingOlder: false,
            olderError: null,
          });
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;
          setState({
            ...requestState,
            messages: [],
            error: error instanceof Error ? error.message : 'Không thể tải lịch sử tin nhắn phòng.',
            page: 0,
            hasMore: false,
            isLoadingOlder: false,
            olderError: null,
          });
        },
    );

    return () => {
      controller.abort();
      olderRequest.current?.abort();
      olderRequest.current = null;
    };
  }, [canLoad, name, currentUsername, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);
  const isCurrent = canLoad && state.name === name &&
      state.username === currentUsername && state.requestVersion === retryCount;

  const loadOlder = useCallback(() => {
    if (!isCurrent || state.error || !state.hasMore || olderRequest.current) return false;

    const controller = new AbortController();
    olderRequest.current = controller;
    const nextPage = state.page + 1;
    setState((previous) => ({ ...previous, isLoadingOlder: true, olderError: null }));

    getRoomChatHistory(name, controller.signal, nextPage).then(
        (data) => {
          if (controller.signal.aborted) return;

          setState((previous) => {
            if (previous.name !== name || previous.username !== currentUsername ||
                previous.requestVersion !== retryCount) return previous;

            return {
              ...previous,
              messages: mergeRoomChatMessages(previous.messages, data.chatMess),
              page: nextPage,
              hasMore: data.chatMess.length >= ROOM_CHAT_PAGE_SIZE,
              isLoadingOlder: false,
              olderError: null,
            };
          });
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;

          setState((previous) => {
            if (previous.name !== name || previous.username !== currentUsername ||
                previous.requestVersion !== retryCount) return previous;

            return {
              ...previous,
              isLoadingOlder: false,
              olderError: error instanceof Error ? error.message : 'Không thể tải tin nhắn cũ trong phòng.',
            };
          });
        },
    ).finally(() => {
      if (olderRequest.current === controller) olderRequest.current = null;
    });

    return true;
  }, [isCurrent, state.error, state.hasMore, state.page, name, currentUsername, retryCount]);

  return {
    messages: isCurrent ? state.messages : [],
    isLoading: canLoad && !isCurrent,
    error: isCurrent ? state.error : null,
    retry,
    hasMore: isCurrent && state.hasMore,
    isLoadingOlder: isCurrent && state.isLoadingOlder,
    olderError: isCurrent ? state.olderError : null,
    loadOlder,
  };
};

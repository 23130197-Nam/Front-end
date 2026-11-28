import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  getRoomChatHistory,
  ROOM_CHAT_PAGE_SIZE,
} from '../roomChatHistory';
import {
  getConversationKey,
  historyLoadFailed,
  historyLoadStarted,
  historyLoadSucceeded,
  olderHistoryLoadFailed,
  olderHistoryLoadStarted,
  olderHistoryLoadSucceeded,
} from '../chatReducer';

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const useRoomChatMessages = (
  name: string,
  currentUsername: string,
  enabled: boolean,
) => {
  const dispatch = useAppDispatch();
  const key = getConversationKey(1, name);
  const history = useAppSelector((state) => state.chat.histories[key]);
  const initialRequest = useRef<AbortController | null>(null);
  const olderRequest = useRef<AbortController | null>(null);
  const canLoad = enabled && name !== '' && currentUsername !== '';

  const loadInitial = useCallback(() => {
    if (!canLoad) return;

    initialRequest.current?.abort();
    olderRequest.current?.abort();
    olderRequest.current = null;

    const controller = new AbortController();
    initialRequest.current = controller;
    dispatch(historyLoadStarted({ key, name, type: 1 }));

    getRoomChatHistory(name, controller.signal).then(
      (data) => {
        if (controller.signal.aborted) return;
        dispatch(historyLoadSucceeded({
          key,
          messages: data.chatMess,
          pageSize: ROOM_CHAT_PAGE_SIZE,
        }));
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        dispatch(historyLoadFailed({
          key,
          error: getErrorMessage(error, 'Không thể tải lịch sử tin nhắn phòng.'),
        }));
      },
    ).finally(() => {
      if (initialRequest.current === controller) initialRequest.current = null;
    });
  }, [canLoad, dispatch, key, name]);

  useEffect(() => {
    loadInitial();

    return () => {
      initialRequest.current?.abort();
      initialRequest.current = null;
      olderRequest.current?.abort();
      olderRequest.current = null;
    };
  }, [loadInitial]);

  const loadOlder = useCallback(() => {
    if (
      !canLoad ||
      !history ||
      history.status !== 'succeeded' ||
      !history.hasMore ||
      olderRequest.current
    ) return false;

    const controller = new AbortController();
    const nextPage = history.page + 1;
    olderRequest.current = controller;
    dispatch(olderHistoryLoadStarted(key));

    getRoomChatHistory(name, controller.signal, nextPage).then(
      (data) => {
        if (controller.signal.aborted) return;
        dispatch(olderHistoryLoadSucceeded({
          key,
          messages: data.chatMess,
          page: nextPage,
          pageSize: ROOM_CHAT_PAGE_SIZE,
        }));
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        dispatch(olderHistoryLoadFailed({
          key,
          error: getErrorMessage(error, 'Không thể tải tin nhắn cũ trong phòng.'),
        }));
      },
    ).finally(() => {
      if (olderRequest.current === controller) olderRequest.current = null;
    });

    return true;
  }, [canLoad, dispatch, history, key, name]);

  return {
    messages: history?.messages ?? [],
    isLoading: canLoad && (!history || history.status === 'loading'),
    error: history?.error ?? null,
    retry: loadInitial,
    hasMore: history?.hasMore ?? false,
    isLoadingOlder: history?.isLoadingOlder ?? false,
    olderError: history?.olderError ?? null,
    loadOlder,
  };
};

import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  getPeopleChatHistory,
  PEOPLE_CHAT_PAGE_SIZE,
} from '../peopleChatHistory';
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

export const usePeopleChatMessages = (
  name: string,
  currentUsername: string,
  enabled: boolean,
) => {
  const dispatch = useAppDispatch();
  const key = getConversationKey(0, name);
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
    dispatch(historyLoadStarted({ key, name, type: 0 }));

    getPeopleChatHistory(name, currentUsername, controller.signal).then(
      (messages) => {
        if (controller.signal.aborted) return;
        dispatch(historyLoadSucceeded({
          key,
          messages,
          pageSize: PEOPLE_CHAT_PAGE_SIZE,
        }));
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        dispatch(historyLoadFailed({
          key,
          error: getErrorMessage(error, 'Không thể tải lịch sử tin nhắn.'),
        }));
      },
    ).finally(() => {
      if (initialRequest.current === controller) initialRequest.current = null;
    });
  }, [canLoad, currentUsername, dispatch, key, name]);

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

    getPeopleChatHistory(name, currentUsername, controller.signal, nextPage).then(
      (messages) => {
        if (controller.signal.aborted) return;
        dispatch(olderHistoryLoadSucceeded({
          key,
          messages,
          page: nextPage,
          pageSize: PEOPLE_CHAT_PAGE_SIZE,
        }));
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        dispatch(olderHistoryLoadFailed({
          key,
          error: getErrorMessage(error, 'Không thể tải tin nhắn cũ.'),
        }));
      },
    ).finally(() => {
      if (olderRequest.current === controller) olderRequest.current = null;
    });

    return true;
  }, [canLoad, currentUsername, dispatch, history, key, name]);

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

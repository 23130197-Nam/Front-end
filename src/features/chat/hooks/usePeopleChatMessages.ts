import { useCallback, useEffect, useState } from 'react';
import type { Message } from '../../../types/chat.type';
import { getPeopleChatHistory } from '../peopleChatHistory';

interface HistoryState {
  name: string | null;
  username: string;
  requestVersion: number;
  messages: Message[];
  error: string | null;
}

export const usePeopleChatMessages = (
  name: string,
  currentUsername: string,
  enabled: boolean,
) => {
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<HistoryState>({
    name: null,
    username: '',
    requestVersion: -1,
    messages: [],
    error: null,
  });
  const canLoad = enabled && name !== '' && currentUsername !== '';

  useEffect(() => {
    if (!canLoad) return;

    const controller = new AbortController();
    const requestState = {
      name,
      username: currentUsername,
      requestVersion: retryCount,
    };

    getPeopleChatHistory(name, currentUsername, controller.signal).then(
        (messages) => {
          if (controller.signal.aborted) return;
          setState({ ...requestState, messages, error: null });
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;
          setState({
            ...requestState,
            messages: [],
            error: error instanceof Error ? error.message : 'Không thể tải lịch sử tin nhắn.',
          });
        },
    );

    return () => controller.abort();
  }, [canLoad, name, currentUsername, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);
  const isCurrent = canLoad && state.name === name &&
      state.username === currentUsername && state.requestVersion === retryCount;

  return {
    messages: isCurrent ? state.messages : [],
    isLoading: canLoad && !isCurrent,
    error: isCurrent ? state.error : null,
    retry,
  };
};

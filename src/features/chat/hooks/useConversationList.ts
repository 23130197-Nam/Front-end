import { useCallback, useEffect, useState } from 'react';
import { wsService } from '../../../services/websocketService';
import type {
  ConversationSummary,
  GetUserListResponse,
} from '../../../types/chat.type';
import { getUserListWithWebSocket } from '../chatAPI';

export const useConversationList = (enabled: boolean) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshConversations = useCallback(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    getUserListWithWebSocket();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleGetUserList = (response: GetUserListResponse) => {
      console.log('[GET_USER_LIST] Response:', response);
      setIsLoading(false);

      if (response.status === 'success') {
        setConversations(response.data);
        setError(null);
        return;
      }

      setError(response.mes || 'Không thể tải danh sách trò chuyện.');
    };

    wsService.on('GET_USER_LIST', handleGetUserList);
    getUserListWithWebSocket();

    return () => {
      wsService.off('GET_USER_LIST', handleGetUserList);
    };
  }, [enabled]);

  return {
    conversations,
    isLoading,
    error,
    refreshConversations,
  };
};

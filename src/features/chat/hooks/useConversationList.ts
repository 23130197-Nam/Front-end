import { useCallback, useEffect } from 'react';
import { wsService } from '../../../services/websocketService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { GetUserListResponse } from '../../../types/chat.type';
import { getUserListWithWebSocket } from '../chatAPI';
import {
  conversationListFailed,
  conversationListStarted,
  conversationListSucceeded,
} from '../chatReducer';

export const useConversationList = (enabled: boolean) => {
  const dispatch = useAppDispatch();
  const {
    conversations,
    conversationStatus,
    conversationError,
  } = useAppSelector((state) => state.chat);

  const refreshConversations = useCallback(() => {
    if (!enabled) return;

    dispatch(conversationListStarted());
    getUserListWithWebSocket();
  }, [dispatch, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleGetUserList = (response: GetUserListResponse) => {
      console.log('[GET_USER_LIST] Response:', response);

      if (response.status === 'success') {
        dispatch(conversationListSucceeded(response.data));
        return;
      }

      dispatch(conversationListFailed(
        response.mes || 'Không thể tải danh sách trò chuyện.',
      ));
    };

    wsService.on('GET_USER_LIST', handleGetUserList);
    refreshConversations();

    return () => {
      wsService.off('GET_USER_LIST', handleGetUserList);
    };
  }, [dispatch, enabled, refreshConversations]);

  return {
    conversations,
    isLoading: conversationStatus === 'loading',
    error: conversationError,
    refreshConversations,
  };
};

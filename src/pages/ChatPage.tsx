import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout, authSuccess } from '../features/auth/userReducer';
import { wsService } from '../services/websocketService';
import { reLoginWithWebSocket, logoutWithWebSocket } from '../features/auth/authAPI';
import { useConversationList } from '../features/chat/hooks/useConversationList';
import { useRoomManagement } from '../features/chat/hooks/useRoomManagement';
import {
  chatCleared,
  conversationSelected,
} from '../features/chat/chatReducer';
import ConversationList from '../features/chat/components/ConversationList';
import CreateRoomModal from '../features/chat/components/CreateRoomModal';
import JoinRoomModal from '../features/chat/components/JoinRoomModal';
import LeaveRoomModal from '../features/chat/components/LeaveRoomModal';
import PeopleMessageHistory from '../features/chat/components/PeopleMessageHistory';
import RoomMessageHistory from '../features/chat/components/RoomMessageHistory';

export default function ChatPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const selectedConversation = useAppSelector((state) => state.chat.selectedConversation,);
  const {
    conversations,
    isLoading: isLoadingConversations,
    error: conversationError,
    refreshConversations,
  } = useConversationList(isAuthenticated);
  const {
    operations,
    createRoom,
    joinRoom,
    leaveRoom,
    resetOperation,
  } = useRoomManagement(refreshConversations);

  useEffect(() => {
    wsService.connect();
    const savedUsername = localStorage.getItem('chat_username');
    const reLoginCode = localStorage.getItem('re_login_code');
    if (!isAuthenticated && savedUsername && reLoginCode) reLoginWithWebSocket(savedUsername, reLoginCode, dispatch);
    const handleReLoginResponse = (response: any) => {
      if (response.status === 'success') {
        if (response.data && response.data.RE_LOGIN_CODE) localStorage.setItem('re_login_code', response.data.RE_LOGIN_CODE);
        const currentUsername = localStorage.getItem('chat_username') || 'User';
        dispatch(authSuccess({user: {id_user: 0,role_id: 0,username: currentUsername,full_name: currentUsername,},re_login_code: response.data?.RE_LOGIN_CODE}));
        console.log('[RE_LOGIN] Khôi phục phiên thành công!');
      } else {
        console.warn('[RE_LOGIN] Phiên đăng nhập hết hạn:', response.mes);
        localStorage.clear();
        dispatch(chatCleared());
        dispatch(logout());
        navigate('/login');
      }
    };
    wsService.on('RE_LOGIN', handleReLoginResponse);
    return () => {wsService.off('RE_LOGIN', handleReLoginResponse);};
  }, [isAuthenticated, dispatch, navigate]);

  const handleLogout = () => {
    logoutWithWebSocket();
    dispatch(chatCleared());
    dispatch(logout());
    localStorage.clear();
    navigate('/login');
  };

  return (
      <div className="container-fluid vh-100 d-flex flex-column bg-light p-0">
        <nav className="navbar navbar-expand-lg navbar-dark px-4 shadow-sm" style={{ backgroundColor: '#7C3AED' }}>
          <a className="navbar-brand fw-bold" href="#"><i className="bi bi-chat-dots-fill me-2"></i> App Chat WebSocket </a>
          <div className="ms-auto d-flex align-items-center">
            <span className="text-white me-3">Xin chào, <strong>{user?.full_name || user?.username || localStorage.getItem('chat_username') || 'Người dùng'}</strong></span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1"></i> Đăng xuất</button>
          </div>
        </nav>

        <div className="container-fluid flex-grow-1 p-4 overflow-hidden">
          <div className="row h-100 bg-white rounded-4 shadow-sm overflow-hidden">
            <div className="col-md-4 border-end p-3 d-flex flex-column" style={{ height: 'calc(100vh - 100px)' }}>
              <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#211A2E' }}>Trò chuyện</h5>
                <div className="d-flex gap-2">
                  <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#joinRoomModal"
                      onClick={() => resetOperation('join')}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Tham gia
                  </button>
                  <button
                      className="btn btn-custom-primary btn-sm"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#createRoomModal"
                      onClick={() => resetOperation('create')}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Tạo phòng
                  </button>
                </div>
              </div>
              <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  isLoading={isLoadingConversations}
                  error={conversationError}
                  onSelect={(conversation) => dispatch(conversationSelected(conversation))}
                  onRefresh={refreshConversations}
              />
            </div>

            <div className="col-md-8 d-flex flex-column p-0" style={{ height: 'calc(100vh - 100px)' }}>
              <div className="p-3 border-bottom bg-white d-flex align-items-center justify-content-between gap-3">
              <span className="fw-bold text-truncate" style={{ color: '#7C3AED' }}>
                <i className={`bi ${selectedConversation?.type === 0 ? 'bi-person-fill' : 'bi-hash'} me-1`}></i>
                {selectedConversation?.name || 'Chọn một cuộc trò chuyện'}
              </span>
                {selectedConversation?.type === 1 && (
                    <button
                        className="btn btn-outline-danger btn-sm flex-shrink-0"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#leaveRoomModal"
                        onClick={() => resetOperation('leave')}
                    >
                      <i className="bi bi-box-arrow-right me-1"></i>
                      Rời phòng
                    </button>
                )}
              </div>
              <div className="flex-grow-1 p-3 overflow-auto bg-light">
                {selectedConversation?.type === 0 ? (
                    <PeopleMessageHistory
                        key={selectedConversation.name}
                        name={selectedConversation.name}
                        currentUsername={user?.username || localStorage.getItem('chat_username') || ''}
                        enabled={isAuthenticated}
                    />
                ) : selectedConversation?.type === 1 ? (
                    <RoomMessageHistory
                        key={selectedConversation.name}
                        name={selectedConversation.name}
                        currentUsername={user?.username || localStorage.getItem('chat_username') || ''}
                        enabled={isAuthenticated}
                    />
                ) : (
                    <div className="text-center text-muted my-auto"><p>Chọn một đoạn chat để bắt đầu nhắn tin qua WebSocket.</p></div>
                )}
              </div>

              <div className="p-3 bg-white border-top">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Nhập tin nhắn..." disabled />
                  <button className="btn text-white" style={{backgroundColor: '#7C3AED', borderColor: '#7C3AED'}} type="button" disabled><i className="bi bi-send-fill"></i> Gửi</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CreateRoomModal
            operation={operations.create}
            onCreate={createRoom}
            onReset={() => resetOperation('create')}
        />
        <JoinRoomModal
            operation={operations.join}
            onJoin={joinRoom}
            onReset={() => resetOperation('join')}
        />
        <LeaveRoomModal
            roomName={selectedConversation?.type === 1 ? selectedConversation.name : null}
            operation={operations.leave}
            onLeave={leaveRoom}
        />
      </div>
  );
}

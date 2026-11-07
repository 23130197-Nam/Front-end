import type { Message } from './types'

export const mockMessages: Message[] = [
    {
        id: 1,
        sender: 'minh_anh',
        content: 'Chào mọi người! Hôm nay nhóm mình cùng làm giao diện chat nhé.',
        createdAt: '2026-11-07T10:00:00+07:00',
    },
    {
        id: 2,
        sender: 'sinh_vien',
        content: 'Mình đã hoàn thành bố cục và danh sách cuộc trò chuyện rồi.',
        createdAt: '2026-11-07T10:05:00+07:00',
    },
    {
        id: 3,
        sender: 'hoang_nam',
        content: 'Tiếp theo là hiển thị người gửi, nội dung và thời gian của từng tin nhắn.',
        createdAt: '2026-11-07T10:10:00+07:00',
    },
    {
        id: 4,
        sender: 'sinh_vien',
        content: 'Mình sẽ tách thành hai component:\nMessageList và MessageItem.',
        createdAt: '2026-11-07T10:15:00+07:00',
    },
    {
        id: 5,
        sender: 'minh_anh',
        content: 'Được nhé, mình cùng kiểm tra giao diện trên màn hình nhỏ nữa.',
        createdAt: '2026-11-07T10:30:00+07:00',
    },
]
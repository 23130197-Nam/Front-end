class WebSocketService {
    private socket: WebSocket | null = null;
    private url: string = 'https://chat.longapp.io.vn';
    private reconnectInterval: number = 3000;
    private listeners: Map<string, Function[]> = new Map();

    constructor() {
        // Có thể khởi tạo sẵn hoặc kết nối khi người dùng đăng nhập
    }

    public connect(): void {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }
        this.socket = new WebSocket(this.url);
//     Kết nối đã mở
        this.socket.onopen = () => {console.log('[WEBSOCKET] Kết nối WebSocket thành công!');};
//      Nhận dữ liệu từ server
        this.socket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                const { action } = response;

                if (action && this.listeners.has(action)) {
                    this.listeners.get(action)?.forEach((callback) => callback(response));
                }
                // Lắng nghe một kênh sự kiện chung 'message' nếu có
                if (this.listeners.has('global_message')) {
                    this.listeners.get('global_message')?.forEach((callback) => callback(response));
                }
            } catch (error) {
                console.error('[WEBSOCKET] [ERORR] Lỗi hàm onmessage():', error);
            }
        };

        this.socket.onerror = (error) => {
            console.error('[WEBSOCKET] [ERROR] Lỗi hàm onerror():', error);
        };

        this.socket.onclose = () => {
            console.warn('[WEBSOCKET] [WARNING] Đang có gắng kết nối lại');
            this.socket = null;
            setTimeout(() => {this.connect();}, this.reconnectInterval);
        };
    }

    public send(payload: object): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(payload));
        } else {
            console.error('[WEBSOCKET] WebSocket chưa sẵn sàng để gửi request');
        }
    }
// Lắng nghe sự kiện
    public on(action: string, callback: Function): void {
        if (!this.listeners.has(action)) {
            this.listeners.set(action, []);
        }
        this.listeners.get(action)?.push(callback);
    }

// Hủy lắng nghe sự kiện
    public off(action: string, callback: Function): void {
        if (this.listeners.has(action)) {
            const arr = this.listeners.get(action);
            if (arr) {
                this.listeners.set(action,arr.filter((cb) => cb !== callback));
            }
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export const wsService = new WebSocketService();
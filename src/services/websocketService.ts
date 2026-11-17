class WebSocketService {
    private socket: WebSocket | null = null;
    private url: string = 'wss://chat.longapp.io.vn/chat/chat';
    private reconnectInterval: number = 3000;
    private listeners: Map<string, Function[]> = new Map();
    private messageQueue: string[] = [];

    constructor() {
    }

    public connect(): void {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) return;
        this.socket = new WebSocket(this.url);
//     Kết nối đã mở
        this.socket.onopen = () => {
            console.log('[WEBSOCKET] Kết nối WebSocket thành công!');
            if (this.messageQueue.length > 0) {
                console.log(`[WEBSOCKET] [QUEUE] Đang gửi ${this.messageQueue.length} message`);
                while (this.messageQueue.length > 0) {
                    const msg = this.messageQueue.shift();
                    if (msg && this.socket) this.socket.send(msg);
                }
            }
        };
//      Nhận dữ liệu từ server
        this.socket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                console.log('[WEBSOCKET] Nhận dữ liệu:', response);
                const messageEvent = response.event || response.action;
                if (messageEvent && this.listeners.has(messageEvent)) this.listeners.get(messageEvent)?.forEach((callback) => callback(response));
                if (this.listeners.has('global_message')) this.listeners.get('global_message')?.forEach((callback) => callback(response));
            } catch (error) {
                console.error('[WEBSOCKET] [ERROR] Lỗi hàm onmessage():', error);
            }
        };
        this.socket.onerror = (error) => {console.error('[WEBSOCKET] [ERROR] Lỗi hàm onerror():', error);};
        this.socket.onclose = () => {
            console.warn('[WEBSOCKET] [WARNING] Đang có gắng kết nối lại');
            this.socket = null;
            setTimeout(() => {this.connect();}, this.reconnectInterval);
        };
    }

    public send(payload: object): void {
        const jsonString = JSON.stringify(payload);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(jsonString);
        else {
            if (!this.messageQueue.includes(jsonString)) {
                console.warn('[WEBSOCKET] WebSocket chưa sẵn sàng -> Thêm QUEUE');
                this.messageQueue.push(jsonString);
            } else console.warn('[WEBSOCKET] Request đã có trong QUEUE');
            if (!this.socket || this.socket.readyState === WebSocket.CLOSED) this.connect();
        }
    }
// Lắng nghe sự kiện
    public on(action: string, callback: Function): void {
        if (!this.listeners.has(action)) this.listeners.set(action, []);
        this.listeners.get(action)?.push(callback);
    }

// Hủy lắng nghe sự kiện
    public off(action: string, callback: Function): void {
        if (this.listeners.has(action)) {
            const arr = this.listeners.get(action);
            if (arr) this.listeners.set(action,arr.filter((cb) => cb !== callback));
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
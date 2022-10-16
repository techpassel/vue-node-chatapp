import { io } from 'socket.io-client';

//In Vue + Vite projects 'process.env' is replaced by 'import.meta.env'
const serverUrl = import.meta.env.VITE_BACKEND_ENDPOINT

class SocketioService {
    socket: any;
    constructor() { }

    setupSocketConnection() {
        this.socket = io(serverUrl);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default new SocketioService();
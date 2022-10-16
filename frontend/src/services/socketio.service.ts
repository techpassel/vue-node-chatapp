import { io } from 'socket.io-client';
import { useUserStore } from '@/stores/userStore';
import type User from '@/models/UserModel';

//In Vue + Vite projects 'process.env' is replaced by 'import.meta.env'
const serverUrl = import.meta.env.VITE_BACKEND_ENDPOINT


class SocketioService {
    socket: any;
    constructor() { }

    setupSocketConnection() {
        const userStore = useUserStore();
        if (!userStore.user?.id) {
            this.disconnect();
        }

        if (userStore.user?.id) {
            // this.socket = io(serverUrl, { query: { user: userStore.user.id } });
            this.socket = io(serverUrl, { auth: { token: userStore.user.token } })

            this.socket.on('my broadcast', (data: any) => {
                console.log(data);
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    // To send message
    sendMessage({ message, roomName }: any, cb: any) {
        if (this.socket) this.socket.emit('message', { message, roomName }, cb);
    }

    // Handle message receive event
    subscribeToMessages(cb: any) {
        if (!this.socket) return (true);
        this.socket.on('message', (msg: any) => {
            console.log('Room event received!');
            return cb(null, msg);
        });
    }

}

export default new SocketioService();
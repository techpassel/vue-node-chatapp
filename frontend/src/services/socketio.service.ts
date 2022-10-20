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
            this.socket = io(serverUrl, { auth: { token: userStore.user.token } })

            /*Test methods*/

            this.joinGroup("Myroom123", (cb: any) => {
                console.log(cb.status, "You joined group 123");
            })

            this.handleUserJoinedGroup("Myroom123", (cb: any) => {
                console.log(cb.name + " Joined group 123");
            })

            setTimeout(() => {
                this.joinGroup("Myroom456", (cb: any) => {
                    console.log(cb.status, "You joined group 456");
                })

                this.handleUserJoinedGroup("Myroom456", (cb: any) => {
                    console.log(cb.name + " Joined group 456");
                })
            }, 5000);

            setTimeout(() => {
                this.sendMessageInGroup({ message: "My rooom message", roomName: "Myroom123" }, (cb: any) => {
                    console.log("My room message send status :" + cb.status);
                })
            }, 20000)

            this.subscribeToMessages("Myroom123", (cb: any) => {
                console.log(cb.message + " -> from user - " + cb.user.name);
            })
            /*Test methods*/
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    // To join group
    joinGroup = (roomName: string, cb: any) => {
        if (this.socket) this.socket.emit("join", roomName, cb);
    }

    // To leave group
    leaveGroup = (roomName: string, cb: any) => {
        if (this.socket) this.socket.emit("leave", roomName, cb);
    }

    // Handle other user joined group event
    handleUserJoinedGroup = (roomName: string, cb: any) => {
        if (this.socket) this.socket.on(`user joined ${roomName}`, cb);
    }

    // Handle other user left group event
    handleUserLeftGroup = (roomName: string, cb: any) => {
        if (this.socket) this.socket.on(`user left ${roomName}` + roomName, cb);
    }

    // To send message to self(No practical use currently - just for demo)
    sendMessageToSelf = (message: string, cb: any) => {
        if (this.socket) this.socket.emit("self-message", message, cb)
    }

    // To send message to all others i.e except you(the sender)
    sendMessageToOthers = (message: string, cb: any) => {
        if (this.socket) this.socket.emit("others-message", message, cb)
    }

    // To send message to all users i.e including you(the sender)
    sendMessageToAll = (message: string, cb: any) => {
        if (this.socket) this.socket.emit("all-users-message", message, cb)
    }

    // Handle self message recieve event
    subscribeToSelfMessages = (cb: any) => {
        if (this.socket) this.socket.on('for self', cb);
    }

    // Handle other users message recieve event
    subscribeToOtherUsersMessages = (cb: any) => {
        if (this.socket) this.socket.on('for others', cb);
    }

    // Handle all users message recieve event
    subscribeToAllUsersMessages = (cb: any) => {
        if (this.socket) this.socket.on('for all', cb);
    }

    // To send message in group
    sendMessageInGroup = ({ message, roomName }: any, cb: any) => {
        this.socket.emit('group-message', { message, roomName }, cb);
    }

    // Handle group message receive event
    subscribeToMessages = (roomName: string, cb: any) => {
        // if (!this.socket) return true;
        this.socket.on(`message ${roomName}`, (msg: any) => {
            return cb(msg);
        });
    }
}

export default new SocketioService();
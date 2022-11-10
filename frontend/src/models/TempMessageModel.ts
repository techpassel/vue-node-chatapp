class TempMessage {
    type: string;
    action: string;
    message: string;
    userName: string;
    userImageUrl: string;

    constructor(){
        this.type = "temp";
        this.action = "";
        this.message = "";
        this.userName = "";
        this.userImageUrl = "";
    }
}

export default TempMessage;
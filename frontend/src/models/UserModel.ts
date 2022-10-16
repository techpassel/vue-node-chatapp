class User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    imageUrl: string;
    token: string;


    constructor() {
        this.id = "",
        this.name = "",
        this.email = "",
        this.isAdmin = false,
        this.imageUrl = "",
        this.token = ""
    }
}

export default User;
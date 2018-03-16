export class User {
    id: number;
    email: string;
    password: string;
    salt: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

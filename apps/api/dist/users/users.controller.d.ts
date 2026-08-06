import { UsersService } from './users.service';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    getProfile(req: any): any;
    updateProfile(req: any, body: {
        displayName?: string;
    }): Promise<import("./user.entity").User>;
}

import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findById(id: string): Promise<User>;
    updateProfile(id: string, data: {
        displayName?: string;
    }): Promise<User>;
}

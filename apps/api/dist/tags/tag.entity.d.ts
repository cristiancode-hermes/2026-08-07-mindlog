import { User } from '../users/user.entity';
import { Entry } from '../entries/entry.entity';
export declare class Tag {
    id: string;
    name: string;
    color: string;
    userId: string;
    user: User;
    entries: Entry[];
    createdAt: Date;
}

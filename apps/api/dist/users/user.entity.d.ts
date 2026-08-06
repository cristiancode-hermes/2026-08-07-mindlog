import { Entry } from '../entries/entry.entity';
import { Tag } from '../tags/tag.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    displayName: string;
    createdAt: Date;
    updatedAt: Date;
    entries: Entry[];
    tags: Tag[];
}

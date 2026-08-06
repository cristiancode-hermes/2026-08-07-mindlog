import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';
export declare class Entry {
    id: string;
    userId: string;
    user: User;
    date: string;
    content: string;
    mood: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
}

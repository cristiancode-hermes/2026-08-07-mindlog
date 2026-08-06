import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
export declare class TagsService {
    private repo;
    constructor(repo: Repository<Tag>);
    findByUser(userId: string): Promise<Tag[]>;
    create(userId: string, name: string, color?: string): Promise<Tag[]>;
    delete(userId: string, tagId: string): Promise<void>;
}

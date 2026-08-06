import { Repository } from 'typeorm';
import { Entry } from './entry.entity';
import { Tag } from '../tags/tag.entity';
import { CreateEntryDto, UpdateEntryDto } from './entry.dto';
export declare class EntriesService {
    private repo;
    private tagRepo;
    constructor(repo: Repository<Entry>, tagRepo: Repository<Tag>);
    findByUser(userId: string, page?: number, limit?: number, tag?: string, mood?: number, search?: string): Promise<{
        entries: Entry[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByDate(userId: string, date: string): Promise<Entry | null>;
    findById(userId: string, id: string): Promise<Entry>;
    create(userId: string, dto: CreateEntryDto): Promise<Entry[]>;
    update(userId: string, id: string, dto: UpdateEntryDto): Promise<Entry>;
    delete(userId: string, id: string): Promise<void>;
}

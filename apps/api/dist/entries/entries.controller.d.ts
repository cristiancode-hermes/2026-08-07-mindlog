import { EntriesService } from './entries.service';
import { CreateEntryDto, UpdateEntryDto } from './entry.dto';
export declare class EntriesController {
    private entries;
    constructor(entries: EntriesService);
    findAll(req: any, page?: number, limit?: number, tag?: string, mood?: number, search?: string): Promise<{
        entries: import("./entry.entity").Entry[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByDate(req: any, date: string): Promise<import("./entry.entity").Entry | null>;
    findOne(req: any, id: string): Promise<import("./entry.entity").Entry>;
    create(req: any, dto: CreateEntryDto): Promise<import("./entry.entity").Entry[]>;
    update(req: any, id: string, dto: UpdateEntryDto): Promise<import("./entry.entity").Entry>;
    remove(req: any, id: string): Promise<void>;
}

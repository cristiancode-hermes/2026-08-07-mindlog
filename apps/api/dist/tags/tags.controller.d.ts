import { TagsService } from './tags.service';
export declare class TagsController {
    private tags;
    constructor(tags: TagsService);
    findAll(req: any): Promise<import("./tag.entity").Tag[]>;
    create(req: any, body: {
        name: string;
        color?: string;
    }): Promise<import("./tag.entity").Tag[]>;
    remove(req: any, id: string): Promise<void>;
}

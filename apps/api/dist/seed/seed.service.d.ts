import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Entry } from '../entries/entry.entity';
import { Tag } from '../tags/tag.entity';
export declare class SeedService implements OnModuleInit {
    private userRepo;
    private entryRepo;
    private tagRepo;
    constructor(userRepo: Repository<User>, entryRepo: Repository<Entry>, tagRepo: Repository<Tag>);
    onModuleInit(): Promise<void>;
}

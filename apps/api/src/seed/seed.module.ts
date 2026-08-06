import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/user.entity';
import { Entry } from '../entries/entry.entity';
import { Tag } from '../tags/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Entry, Tag])],
  providers: [SeedService],
})
export class SeedModule {}

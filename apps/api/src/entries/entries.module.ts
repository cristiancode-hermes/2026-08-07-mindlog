import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { Entry } from './entry.entity';
import { Tag } from '../tags/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entry, Tag])],
  controllers: [EntriesController],
  providers: [EntriesService],
  exports: [EntriesService],
})
export class EntriesModule {}

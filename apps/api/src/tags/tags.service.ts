import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

  async findByUser(userId: string) {
    return this.repo.find({ where: { userId }, order: { name: 'ASC' } });
  }

  async create(userId: string, name: string, color?: string) {
    const existing = await this.repo.findOne({ where: { userId, name } });
    if (existing) throw new ConflictException('Tag already exists');
    const tag = this.repo.create({ userId, name, color } as any);
    return this.repo.save(tag);
  }

  async delete(userId: string, tagId: string) {
    await this.repo.delete({ id: tagId, userId });
  }
}

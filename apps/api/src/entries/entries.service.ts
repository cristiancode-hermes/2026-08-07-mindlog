import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Entry } from './entry.entity';
import { Tag } from '../tags/tag.entity';
import { CreateEntryDto, UpdateEntryDto } from './entry.dto';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry) private repo: Repository<Entry>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) {}

  async findByUser(userId: string, page = 1, limit = 20, tag?: string, mood?: number, search?: string) {
    const qb = this.repo.createQueryBuilder('e')
      .leftJoinAndSelect('e.tags', 't')
      .where('e.userId = :userId', { userId })
      .orderBy('e.date', 'DESC')
      .addOrderBy('e.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (tag) {
      qb.andWhere('t.name = :tag', { tag });
    }
    if (mood !== undefined) {
      qb.andWhere('e.mood = :mood', { mood });
    }
    if (search) {
      qb.andWhere('e.content LIKE :search OR e.title LIKE :search', { search: `%${search}%` });
    }

    const [entries, total] = await qb.getManyAndCount();
    return { entries, total, page, limit };
  }

  async findByDate(userId: string, date: string) {
    return this.repo.findOne({
      where: { userId, date },
      relations: { tags: true },
    });
  }

  async findById(userId: string, id: string) {
    const entry = await this.repo.findOne({
      where: { id, userId },
      relations: { tags: true },
    });
    if (!entry) throw new NotFoundException('Entry not found');
    return entry;
  }

  async create(userId: string, dto: CreateEntryDto) {
    let tags: Tag[] = [];
    if (dto.tagIds?.length) {
      tags = await this.tagRepo.findBy({ id: In(dto.tagIds) });
    }
    const entry = this.repo.create({
      userId,
      date: dto.date,
      content: dto.content,
      mood: dto.mood ?? 3,
      title: dto.title,
      tags,
    } as any);
    return this.repo.save(entry);
  }

  async update(userId: string, id: string, dto: UpdateEntryDto) {
    const entry = await this.repo.findOne({ where: { id, userId }, relations: { tags: true } });
    if (!entry) throw new NotFoundException('Entry not found');

    if (dto.content !== undefined) entry.content = dto.content;
    if (dto.mood !== undefined) entry.mood = dto.mood;
    if (dto.title !== undefined) entry.title = dto.title;

    if (dto.tagIds !== undefined) {
      entry.tags = dto.tagIds?.length ? await this.tagRepo.findBy({ id: In(dto.tagIds) }) : [];
    }

    return this.repo.save(entry);
  }

  async delete(userId: string, id: string) {
    const result = await this.repo.delete({ id, userId });
    if (result.affected === 0) throw new NotFoundException('Entry not found');
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entry_entity_1 = require("./entry.entity");
const tag_entity_1 = require("../tags/tag.entity");
let EntriesService = class EntriesService {
    repo;
    tagRepo;
    constructor(repo, tagRepo) {
        this.repo = repo;
        this.tagRepo = tagRepo;
    }
    async findByUser(userId, page = 1, limit = 20, tag, mood, search) {
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
    async findByDate(userId, date) {
        return this.repo.findOne({
            where: { userId, date },
            relations: { tags: true },
        });
    }
    async findById(userId, id) {
        const entry = await this.repo.findOne({
            where: { id, userId },
            relations: { tags: true },
        });
        if (!entry)
            throw new common_1.NotFoundException('Entry not found');
        return entry;
    }
    async create(userId, dto) {
        let tags = [];
        if (dto.tagIds?.length) {
            tags = await this.tagRepo.findBy({ id: (0, typeorm_2.In)(dto.tagIds) });
        }
        const entry = this.repo.create({
            userId,
            date: dto.date,
            content: dto.content,
            mood: dto.mood ?? 3,
            title: dto.title,
            tags,
        });
        return this.repo.save(entry);
    }
    async update(userId, id, dto) {
        const entry = await this.repo.findOne({ where: { id, userId }, relations: { tags: true } });
        if (!entry)
            throw new common_1.NotFoundException('Entry not found');
        if (dto.content !== undefined)
            entry.content = dto.content;
        if (dto.mood !== undefined)
            entry.mood = dto.mood;
        if (dto.title !== undefined)
            entry.title = dto.title;
        if (dto.tagIds !== undefined) {
            entry.tags = dto.tagIds?.length ? await this.tagRepo.findBy({ id: (0, typeorm_2.In)(dto.tagIds) }) : [];
        }
        return this.repo.save(entry);
    }
    async delete(userId, id) {
        const result = await this.repo.delete({ id, userId });
        if (result.affected === 0)
            throw new common_1.NotFoundException('Entry not found');
    }
};
exports.EntriesService = EntriesService;
exports.EntriesService = EntriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entry_entity_1.Entry)),
    __param(1, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EntriesService);
//# sourceMappingURL=entries.service.js.map
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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entry_entity_1 = require("../entries/entry.entity");
let AnalyticsService = class AnalyticsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getMoodTrends(userId, months = 3) {
        const since = new Date();
        since.setMonth(since.getMonth() - months);
        const sinceStr = since.toISOString().split('T')[0];
        const entries = await this.repo.find({
            where: { userId },
            order: { date: 'ASC' },
        });
        const filtered = entries.filter(e => e.date >= sinceStr);
        const monthly = {};
        for (const e of filtered) {
            const month = e.date.substring(0, 7);
            if (!monthly[month])
                monthly[month] = { count: 0, total: 0, entries: 0 };
            monthly[month].total += e.mood;
            monthly[month].entries++;
        }
        const trends = Object.entries(monthly).map(([month, data]) => ({
            month,
            avgMood: +(data.total / data.entries).toFixed(2),
            entries: data.entries,
        }));
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        for (const e of filtered) {
            distribution[e.mood] = (distribution[e.mood] || 0) + 1;
        }
        const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        let checkDate = new Date(today);
        const dateSet = new Set(sorted.map(e => e.date));
        while (dateSet.has(checkDate.toISOString().split('T')[0])) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
        const tagFreq = {};
        for (const e of filtered) {
            if (e.tags) {
                for (const t of e.tags) {
                    tagFreq[t.name || t] = (tagFreq[t.name || t] || 0) + 1;
                }
            }
        }
        const entriesWithTags = await this.repo.find({
            where: { userId },
            relations: { tags: true },
        });
        const tagCounts = {};
        for (const e of entriesWithTags.filter(e => e.date >= sinceStr)) {
            for (const t of e.tags || []) {
                tagCounts[t.name] = (tagCounts[t.name] || 0) + 1;
            }
        }
        const topTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));
        return {
            totalEntries: entries.length,
            recentEntries: filtered.length,
            avgMood: entries.length ? +(filtered.reduce((s, e) => s + e.mood, 0) / filtered.length).toFixed(2) : 0,
            streak,
            trends,
            distribution: Object.entries(distribution).map(([mood, count]) => ({ mood: +mood, count })),
            topTags,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entry_entity_1.Entry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map
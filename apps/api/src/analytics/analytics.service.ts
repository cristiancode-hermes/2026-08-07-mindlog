import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from '../entries/entry.entity';

@Injectable()
export class AnalyticsService {
  constructor(@InjectRepository(Entry) private repo: Repository<Entry>) {}

  async getMoodTrends(userId: string, months = 3) {
    const since = new Date();
    since.setMonth(since.getMonth() - months);
    const sinceStr = since.toISOString().split('T')[0];

    const entries = await this.repo.find({
      where: { userId },
      order: { date: 'ASC' },
    });

    const filtered = entries.filter(e => e.date >= sinceStr);

    // Aggregate by month
    const monthly: Record<string, { count: number; total: number; entries: number }> = {};
    for (const e of filtered) {
      const month = e.date.substring(0, 7);
      if (!monthly[month]) monthly[month] = { count: 0, total: 0, entries: 0 };
      monthly[month].total += e.mood;
      monthly[month].entries++;
    }

    const trends = Object.entries(monthly).map(([month, data]) => ({
      month,
      avgMood: +(data.total / data.entries).toFixed(2),
      entries: data.entries,
    }));

    // Mood distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const e of filtered) {
      distribution[e.mood] = (distribution[e.mood] || 0) + 1;
    }

    // Streak
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    const dateSet = new Set(sorted.map(e => e.date));

    while (dateSet.has(checkDate.toISOString().split('T')[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Tag frequency
    const tagFreq: Record<string, number> = {};
    for (const e of filtered) {
      if ((e as any).tags) {
        for (const t of (e as any).tags) {
          tagFreq[t.name || t] = (tagFreq[t.name || t] || 0) + 1;
        }
      }
    }

    // We need to get tags separately
    const entriesWithTags = await this.repo.find({
      where: { userId },
      relations: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
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
}

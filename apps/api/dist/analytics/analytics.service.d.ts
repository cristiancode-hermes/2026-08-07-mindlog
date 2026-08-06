import { Repository } from 'typeorm';
import { Entry } from '../entries/entry.entity';
export declare class AnalyticsService {
    private repo;
    constructor(repo: Repository<Entry>);
    getMoodTrends(userId: string, months?: number): Promise<{
        totalEntries: number;
        recentEntries: number;
        avgMood: number;
        streak: number;
        trends: {
            month: string;
            avgMood: number;
            entries: number;
        }[];
        distribution: {
            mood: number;
            count: number;
        }[];
        topTags: {
            name: string;
            count: number;
        }[];
    }>;
}

import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analytics;
    constructor(analytics: AnalyticsService);
    getMoodTrends(req: any, months?: number): Promise<{
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

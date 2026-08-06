import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';
import { Analytics } from '../../shared/models/models';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css',
})
export class InsightsComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly analytics = signal<Analytics | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly moodColors: Record<number, string> = {
    1: 'var(--mood-1)',
    2: 'var(--mood-2)',
    3: 'var(--mood-3)',
    4: 'var(--mood-4)',
    5: 'var(--mood-5)',
  };

  readonly moodEmojis: Record<number, string> = {
    1: '😢',
    2: '😟',
    3: '😐',
    4: '😊',
    5: '😄',
  };

  readonly moodLabels: Record<number, string> = {
    1: 'Terrible',
    2: 'Bad',
    3: 'Okay',
    4: 'Good',
    5: 'Great',
  };

  // Line chart dimensions
  readonly chartWidth = 600;
  readonly chartHeight = 200;

  readonly linePath = computed(() => {
    const trends = this.analytics()?.trends || [];
    if (trends.length < 2) return '';
    const w = this.chartWidth;
    const h = this.chartHeight;
    const padding = 30;
    const innerW = w - padding * 2;
    const innerH = h - padding * 2;
    const stepX = innerW / Math.max(trends.length - 1, 1);

    return trends
      .map((t, i) => {
        const x = padding + i * stepX;
        const y = padding + innerH - ((t.mood - 1) / 4) * innerH;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  });

  readonly lineDots = computed(() => {
    const trends = this.analytics()?.trends || [];
    if (trends.length < 1) return [];
    const w = this.chartWidth;
    const h = this.chartHeight;
    const padding = 30;
    const innerW = w - padding * 2;
    const innerH = h - padding * 2;
    const stepX = innerW / Math.max(trends.length - 1, 1);

    return trends.map((t, i) => ({
      cx: padding + i * stepX,
      cy: padding + innerH - ((t.mood - 1) / 4) * innerH,
      mood: t.mood,
      date: t.date,
    }));
  });

  readonly yLabels = computed(() => {
    return [5, 4, 3, 2, 1].map((v) => ({
      y: 30 + (this.chartHeight - 60) - ((v - 1) / 4) * (this.chartHeight - 60),
      label: this.moodEmojis[v],
    }));
  });

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAnalytics(6).subscribe({
      next: (a) => {
        this.analytics.set(a);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load analytics');
      },
    });
  }

  get maxDistribution(): number {
    const dist = this.analytics()?.distribution || [];
    return Math.max(...dist.map((d) => d.count), 1);
  }

  get maxTagCount(): number {
    const tags = this.analytics()?.topTags || [];
    return Math.max(...tags.map((t) => t.count), 1);
  }
}

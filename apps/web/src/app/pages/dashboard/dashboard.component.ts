import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import { Analytics, Entry } from '../../shared/models/models';
import { DecimalPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, SlicePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly analytics = signal<Analytics | null>(null);
  readonly todayEntry = signal<Entry | null | undefined>(undefined);
  readonly loading = signal(true);

  readonly moodEmojis = ['', '😢', '😟', '😐', '😊', '😄'];

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.api.getAnalytics(3).subscribe({
      next: (a) => this.analytics.set(a),
    });

    this.api.getEntryByDate(today).subscribe({
      next: (e) => {
        this.todayEntry.set(e);
        this.loading.set(false);
      },
      error: () => {
        this.todayEntry.set(null);
        this.loading.set(false);
      },
    });
  }

  navigateToEditor(date?: string): void {
    if (date) {
      this.router.navigate(['/editor'], { queryParams: { date } });
    } else {
      this.router.navigate(['/editor']);
    }
  }

  getStreakLabel(streak: number): string {
    if (streak === 0) return 'No active streak';
    if (streak === 1) return '1 day';
    return `${streak} days`;
  }
}

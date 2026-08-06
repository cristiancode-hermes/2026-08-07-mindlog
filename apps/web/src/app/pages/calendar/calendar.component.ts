import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Entry } from '../../shared/models/models';

interface DayInfo {
  day: number;
  date: string; // YYYY-MM-DD
  mood: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
  entryId: number | null;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly currentMonth = signal(new Date().getMonth());
  readonly currentYear = signal(new Date().getFullYear());
  readonly entries = signal<Entry[]>([]);
  readonly loading = signal(true);

  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  readonly dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly moodColors: Record<number, string> = {
    1: 'var(--mood-1)',
    2: 'var(--mood-2)',
    3: 'var(--mood-3)',
    4: 'var(--mood-4)',
    5: 'var(--mood-5)',
  };

  readonly days = computed<DayInfo[]>(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const today = new Date().toISOString().split('T')[0];
    const entriesMap = new Map<string, Entry>();
    for (const e of this.entries()) {
      entriesMap.set(e.date, e);
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const result: DayInfo[] = [];

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      result.push({
        day,
        date,
        mood: null,
        isToday: false,
        isCurrentMonth: false,
        entryId: null,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const entry = entriesMap.get(date);
      result.push({
        day: d,
        date,
        mood: entry?.mood ?? null,
        isToday: date === today,
        isCurrentMonth: true,
        entryId: entry?.id ?? null,
      });
    }

    // Next month padding
    const remaining = 42 - result.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month + 1 > 11 ? 0 : month + 1;
      const nextYear = month + 1 > 11 ? year + 1 : year;
      const date = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      result.push({
        day: d,
        date,
        mood: null,
        isToday: false,
        isCurrentMonth: false,
        entryId: null,
      });
    }

    return result;
  });

  ngOnInit(): void {
    this.loadMonth();
  }

  loadMonth(): void {
    this.loading.set(true);
    // Load entries for this month (fetch recent entries, filter client-side)
    this.api.getEntries({ limit: 100 }).subscribe({
      next: (res) => {
        const year = this.currentYear();
        const month = this.currentMonth();
        const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
        this.entries.set(
          res.entries.filter((e) => e.date.startsWith(prefix)),
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  prevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
    this.loadMonth();
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
    this.loadMonth();
  }

  goToToday(): void {
    const now = new Date();
    this.currentMonth.set(now.getMonth());
    this.currentYear.set(now.getFullYear());
    this.loadMonth();
  }

  openDay(date: string, entryId: number | null): void {
    if (entryId) {
      this.router.navigate(['/editor', entryId]);
    } else {
      this.router.navigate(['/editor'], { queryParams: { date } });
    }
  }
}

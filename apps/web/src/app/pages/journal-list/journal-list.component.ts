import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DatePipe, SlicePipe } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';
import { Entry, Tag } from '../../shared/models/models';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe, SlicePipe],
  templateUrl: './journal-list.component.html',
  styleUrl: './journal-list.component.css',
})
export class JournalListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly entries = signal<Entry[]>([]);
  readonly tags = signal<Tag[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = signal(20);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly moodEmojis: Record<number, string> = { 1: '😢', 2: '😟', 3: '😐', 4: '😊', 5: '😄' };
  readonly moods = [1, 2, 3, 4, 5];

  filterForm = this.fb.group({
    search: [''],
    mood: [''],
    tag: [''],
  });

  ngOnInit(): void {
    this.loadTags();
    this.loadEntries();

    this.filterForm.valueChanges.subscribe(() => {
      this.page.set(1);
      this.loadEntries();
    });
  }

  loadTags(): void {
    this.api.getTags().subscribe({
      next: (t) => this.tags.set(t),
    });
  }

  loadEntries(): void {
    this.loading.set(true);
    this.error.set(null);

    const f = this.filterForm.value;
    this.api
      .getEntries({
        page: this.page(),
        limit: this.limit(),
        search: f.search || undefined,
        mood: f.mood ? Number(f.mood) : undefined,
        tag: f.tag || undefined,
      })
      .subscribe({
        next: (res) => {
          this.entries.set(res.entries);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Failed to load entries');
        },
      });
  }

  get totalPages(): number {
    return Math.ceil(this.total() / this.limit());
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page.set(p);
    this.loadEntries();
  }

  editEntry(id: number): void {
    this.router.navigate(['/editor', id]);
  }

  deleteEntry(id: number, event: MouseEvent): void {
    event.stopPropagation();
    if (!confirm('Delete this entry?')) return;
    this.api.deleteEntry(id).subscribe({
      next: () => this.loadEntries(),
    });
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', mood: '', tag: '' });
  }
}

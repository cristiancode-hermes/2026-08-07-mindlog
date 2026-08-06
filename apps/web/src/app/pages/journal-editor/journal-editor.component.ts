import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Entry, Tag } from '../../shared/models/models';

@Component({
  selector: 'app-journal-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './journal-editor.component.html',
  styleUrl: './journal-editor.component.css',
})
export class JournalEditorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isEditing = signal(false);
  readonly entryId = signal<number | null>(null);
  readonly tags = signal<Tag[]>([]);
  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly moodEmojis = [
    { value: 1, emoji: '😢', label: 'Terrible' },
    { value: 2, emoji: '😟', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '😄', label: 'Great' },
  ];

  form = this.fb.nonNullable.group({
    date: ['', Validators.required],
    title: [''],
    content: ['', Validators.required],
    mood: [3 as number],
    tagIds: [[] as number[]],
  });

  ngOnInit(): void {
    this.loadTags();

    const idParam = this.route.snapshot.paramMap.get('id');
    const dateParam = this.route.snapshot.queryParamMap.get('date');

    if (idParam) {
      this.isEditing.set(true);
      this.entryId.set(Number(idParam));
      this.loadEntry(Number(idParam));
    } else if (dateParam) {
      this.form.patchValue({ date: dateParam });
      this.checkExistingEntry(dateParam);
    } else {
      this.form.patchValue({ date: new Date().toISOString().split('T')[0] });
    }
  }

  loadTags(): void {
    this.api.getTags().subscribe({
      next: (t) => this.tags.set(t),
    });
  }

  loadEntry(id: number): void {
    this.loading.set(true);
    this.api.getEntry(id).subscribe({
      next: (entry) => {
        this.form.patchValue({
          date: entry.date,
          title: entry.title || '',
          content: entry.content,
          mood: entry.mood || 3,
          tagIds: entry.tags.map((t) => t.id),
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load entry');
      },
    });
  }

  checkExistingEntry(date: string): void {
    this.api.getEntryByDate(date).subscribe({
      next: (entry) => {
        if (entry) {
          this.isEditing.set(true);
          this.entryId.set(entry.id);
          this.form.patchValue({
            title: entry.title || '',
            content: entry.content,
            mood: entry.mood || 3,
            tagIds: entry.tags.map((t) => t.id),
          });
        }
      },
    });
  }

  toggleTag(tagId: number): void {
    const current = this.form.value.tagIds || [];
    const idx = current.indexOf(tagId);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(tagId);
    }
    this.form.patchValue({ tagIds: [...current] });
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.error.set(null);

    const data = this.form.getRawValue();

    if (this.isEditing() && this.entryId()) {
      this.api.updateEntry(this.entryId()!, data).subscribe({
        next: () => this.router.navigate(['/journal']),
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.message || 'Failed to save entry');
        },
      });
    } else {
      this.api.createEntry(data).subscribe({
        next: () => this.router.navigate(['/journal']),
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.message || 'Failed to create entry');
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/journal']);
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { Tag } from '../../shared/models/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  readonly tags = signal<Tag[]>([]);
  readonly saving = signal(false);
  readonly message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  profileForm = this.fb.nonNullable.group({
    displayName: [''],
  });

  newTagForm = this.fb.nonNullable.group({
    name: [''],
    color: ['#6366f1'],
  });

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user?.displayName) {
      this.profileForm.patchValue({ displayName: user.displayName });
    }
    this.loadTags();
  }

  loadTags(): void {
    this.api.getTags().subscribe({
      next: (t) => this.tags.set(t),
    });
  }

  saveProfile(): void {
    this.saving.set(true);
    this.message.set(null);
    this.auth.updateProfile(this.profileForm.value as { displayName?: string }).subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set({ type: 'success', text: 'Profile updated!' });
        setTimeout(() => this.message.set(null), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.message.set({ type: 'error', text: err.error?.message || 'Failed to update profile' });
      },
    });
  }

  addTag(): void {
    if (!this.newTagForm.value.name?.trim()) return;
    this.api.createTag(this.newTagForm.value as { name: string; color?: string }).subscribe({
      next: (tag) => {
        this.tags.update((t) => [...t, tag]);
        this.newTagForm.reset({ name: '', color: '#6366f1' });
      },
    });
  }

  deleteTag(id: number): void {
    if (!confirm('Delete this tag?')) return;
    this.api.deleteTag(id).subscribe({
      next: () => this.tags.update((t) => t.filter((tag) => tag.id !== id)),
    });
  }

  exportData(format: 'json' | 'csv'): void {
    this.api.getEntries({ limit: 1000 }).subscribe({
      next: (res) => {
        let content: string;
        let mime: string;
        let ext: string;

        if (format === 'json') {
          content = JSON.stringify(res.entries, null, 2);
          mime = 'application/json';
          ext = 'json';
        } else {
          const header = 'date,title,content,mood,tags';
          const rows = res.entries.map((e) => {
            const escapedContent = `"${(e.content || '').replace(/"/g, '""')}"`;
            const escapedTitle = `"${(e.title || '').replace(/"/g, '""')}"`;
            const tags = (e.tags || []).map((t) => t.name).join(';');
            return `${e.date},${escapedTitle},${escapedContent},${e.mood ?? ''},"${tags}"`;
          });
          content = header + '\n' + rows.join('\n');
          mime = 'text/csv';
          ext = 'csv';
        }

        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindlog-export.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }
}

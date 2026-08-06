import { Component, inject, signal, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly darkMode = signal(localStorage.getItem('mindlog_theme') === 'dark');

  constructor() {
    this.applyTheme();

    effect(() => {
      localStorage.setItem('mindlog_theme', this.darkMode() ? 'dark' : 'light');
      this.applyTheme();
    });
  }

  toggleTheme(): void {
    this.darkMode.update((v) => !v);
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.darkMode() ? 'dark' : 'light');
  }

  logout(): void {
    this.auth.logout();
  }
}

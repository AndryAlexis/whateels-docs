import { Component, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  imports: [],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar implements OnInit {
  activeSectionId = signal<string | null>(null);

  ngOnInit() {
    const options = {
      root: null,
      rootMargin: '-100px 0px -66% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSectionId.set(entry.target.id);
        }
      });
    }, options);

    // Observe all sections with ids
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });
  }

  isActive(fragmentId: string): boolean {
    return this.activeSectionId() === fragmentId;
  }
}

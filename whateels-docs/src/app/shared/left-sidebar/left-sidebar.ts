import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostBinding, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Section } from './section/section';
import { Logo } from '../logo/logo';
import { LeftSidebarService } from '../services/leftsidebar.service';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [Section, Logo],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css',
})
export class LeftSidebar {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scrollStorageKey = 'left-sidebar-scroll-top';
  @ViewChild('sidebarScrollContainer') private readonly sidebarScrollContainer?: ElementRef<HTMLElement>;

  constructor(public leftSidebarService: LeftSidebarService) {}


  @HostBinding('class.active')
  get isActive(): boolean {
    return this.leftSidebarService.isOpen();
  }

  ngAfterViewInit(): void {
    this.restoreScrollPosition();
  }

  private restoreScrollPosition(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const container = this.sidebarScrollContainer?.nativeElement;
    if (!container) {
      return;
    }

    const saved = sessionStorage.getItem(this.scrollStorageKey);
    if (!saved) {
      return;
    }

    requestAnimationFrame(() => {
      container.scrollTop = Number(saved) || 0;
    });
  }
}
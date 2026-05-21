import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostBinding, inject, Input, OnChanges, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Section } from './section/section';
import { Logo } from '../logo/logo';
import { LeftSidebarService } from '../services/leftsidebar.service';
import { DocCategory } from '../../doc/doc-category.service';
import { DEFAULT_DOC_SLUG } from '../../doc/doc-page.service';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [Section, Logo],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css',
})
export class LeftSidebar implements AfterViewInit, OnChanges {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scrollStorageKey = 'left-sidebar-scroll-top';
  @ViewChild('sidebarScrollContainer') private readonly sidebarScrollContainer?: ElementRef<HTMLElement>;

  constructor(public leftSidebarService: LeftSidebarService) {}

  private get currentSlug(): string {
    const tree = this.router.parseUrl(this.router.url);
    const urlSlug = tree.root.children['primary']?.segments[0]?.path;
    return urlSlug || DEFAULT_DOC_SLUG;
  }

  @HostBinding('class.active')
  get isActive(): boolean {
    return this.leftSidebarService.isOpen();
  }

  @Input() categories: DocCategory[] | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  ngAfterViewInit(): void {
    this.restoreScrollPosition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] && !this.loading) {
      this.restoreScrollPosition();
    }
  }

  onSidebarScroll(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (target) {
      sessionStorage.setItem(this.scrollStorageKey, String(target.scrollTop));
    }
  }

  pageItems(category: DocCategory): { name: string; href: string; isActive?: boolean }[] {
    const active = this.currentSlug;
    return category.pages.map((page) => ({
      name: page.title,
      href: `./${page.slug}`,
      isActive: page.slug === active,
    }));
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
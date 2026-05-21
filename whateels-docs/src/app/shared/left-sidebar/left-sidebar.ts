import { Component, HostBinding, inject, Input } from '@angular/core';
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
export class LeftSidebar {
  private readonly router = inject(Router);

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

  pageItems(category: DocCategory): { name: string; href: string; isActive?: boolean }[] {
    const active = this.currentSlug;
    return category.pages.map((page) => ({
      name: page.title,
      href: `./${page.slug}`,
      isActive: page.slug === active,
    }));
  }
}
import { Component, HostBinding, Input } from '@angular/core';
import { Section } from './section/section';
import { Logo } from '../logo/logo';
import { LeftSidebarService } from '../services/leftsidebar.service';
import { DocCategory } from '../../doc/doc-category.service';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [Section, Logo],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css',
})
export class LeftSidebar {
  constructor(public leftSidebarService: LeftSidebarService) {}

  @HostBinding('class.active')
  get isActive(): boolean {
    return this.leftSidebarService.isOpen();
  }

  @Input() categories: DocCategory[] | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  pageItems(category: DocCategory): { name: string; href: string; isActive?: boolean }[] {
    return category.pages.map((page) => ({
      name: page.title,
      href: `./${page.slug}`,
    }));
  }
}
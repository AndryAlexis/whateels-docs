import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Logo } from '../logo/logo';
import { SearchButton } from './search-button/search-button';
import { LeftSidebarService } from '../services/leftsidebar.service';
import { FloatingMenu } from '../services/floating-menu.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, Logo, SearchButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public leftSidebarService: LeftSidebarService, public floatingMenu: FloatingMenu) {}
}
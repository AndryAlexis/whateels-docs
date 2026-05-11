import { Component } from '@angular/core';
import { Logo } from '../logo/logo';
import { SearchButton } from './search-button/search-button';
import { LeftSidebarService } from '../services/leftsidebar.service';

@Component({
  selector: 'app-header',
  imports: [Logo, SearchButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public leftSidebarService: LeftSidebarService) {}
}
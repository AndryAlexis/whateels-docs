import { Component } from '@angular/core';
import { Logo } from '../logo/logo';
import { SearchInput } from './search-input/search-input';

@Component({
  selector: 'app-header',
  imports: [Logo, SearchInput],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
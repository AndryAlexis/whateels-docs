import { Component } from '@angular/core';
import { Header } from '../shared/header/header';
import { Main } from '../shared/main/main';
import { LeftSidebar } from '../shared/left-sidebar/left-sidebar';
import { SearchModal } from '../shared/search-modal/search-modal';

@Component({
  selector: 'app-homepage',
  imports: [Header, Main, LeftSidebar, SearchModal],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}

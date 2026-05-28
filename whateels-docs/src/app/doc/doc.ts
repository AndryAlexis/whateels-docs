import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { Header } from '../shared/header/header';
import { Main } from '../shared/main/main';
import { LeftSidebar } from '../shared/left-sidebar/left-sidebar';
import { SearchModal } from '../shared/search-modal/search-modal';

@Component({
  selector: 'app-doc',
  standalone: true,
  imports: [AsyncPipe, Header, Main, LeftSidebar, SearchModal],
  templateUrl: './doc.html',
  styleUrl: './doc.css',
})
export class Doc {
 
}

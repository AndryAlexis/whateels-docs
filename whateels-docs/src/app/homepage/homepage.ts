import { Component } from '@angular/core';
import { Header } from '../shared/header/header';
import { Main } from '../shared/main/main';
import { LeftSidebar } from '../shared/left-sidebar/left-sidebar';
import { RightSidebar } from '../shared/right-sidebar/right-sidebar';

@Component({
  selector: 'app-homepage',
  imports: [Header, Main, LeftSidebar],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {}

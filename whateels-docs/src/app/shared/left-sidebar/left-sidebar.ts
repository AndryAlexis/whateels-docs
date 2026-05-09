import { Component } from '@angular/core';
import { Section } from './section/section';

@Component({
  selector: 'app-left-sidebar',
  imports: [Section],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css',
})
export class LeftSidebar {}

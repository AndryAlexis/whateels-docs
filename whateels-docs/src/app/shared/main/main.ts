import { Component } from '@angular/core';
import { RightSidebar } from '../right-sidebar/right-sidebar';

@Component({
  selector: 'app-main',
  imports: [RightSidebar],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}

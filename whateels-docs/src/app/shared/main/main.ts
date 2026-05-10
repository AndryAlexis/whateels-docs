import { Component } from '@angular/core';
import { RightSidebar } from '../right-sidebar/right-sidebar';
import { Footer } from '../footer/footer';
import { Divider } from '../divider/divider';

@Component({
  selector: 'app-main',
  imports: [RightSidebar, Footer, Divider],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}

import { Component } from '@angular/core';
import { RightSidebar } from '../right-sidebar/right-sidebar';
import { Footer } from '../footer/footer';
import { Divider } from '../divider/divider';
import { PaginationComponent } from '../pagination/pagination';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-main',
  imports: [RightSidebar, Footer, Divider, PaginationComponent, MarkdownComponent],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
}

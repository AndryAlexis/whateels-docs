import { Component } from '@angular/core';
import { RightSidebar } from '../right-sidebar/right-sidebar';
import { Footer } from '../footer/footer';
import { Divider } from '../divider/divider';
import { PaginationComponent } from '../pagination/pagination';
import { ObservableSectionDirective } from '../directives/observable-section.directive';
import { SlugifyPipe } from '../pipes/slugify.pipe';

@Component({
  selector: 'app-main',
  imports: [RightSidebar, Footer, Divider, PaginationComponent, ObservableSectionDirective, SlugifyPipe],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
}

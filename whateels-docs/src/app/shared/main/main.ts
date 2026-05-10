import { Component } from '@angular/core';
import { RightSidebar } from '../right-sidebar/right-sidebar';
import { Footer } from '../footer/footer';
import { Divider } from '../divider/divider';
import { ObservableSectionDirective } from '../directives/observable-section.directive';

@Component({
  selector: 'app-main',
  imports: [RightSidebar, Footer, Divider, ObservableSectionDirective],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}

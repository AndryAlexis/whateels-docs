import { Component, input } from '@angular/core';
import { RightSidebar } from '../right-sidebar/right-sidebar';
import { Footer } from '../footer/footer';
import { Divider } from '../divider/divider';
import { ObservableSectionDirective } from '../directives/observable-section.directive';
import { DocPage } from '../../doc/doc-page.service';

@Component({
  selector: 'app-main',
  imports: [RightSidebar, Footer, Divider, ObservableSectionDirective],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  readonly page = input<DocPage | null>(null);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
}

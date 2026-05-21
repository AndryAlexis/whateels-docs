import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ObservableSectionService } from '../services/observable-section.service';
import { SlugifyPipe } from '../pipes/slugify.pipe';
import { DocSection } from '../../doc/doc-page.service';

@Component({
  selector: 'app-right-sidebar',
  imports: [SlugifyPipe, RouterLink],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar {
  private observableService = inject(ObservableSectionService);
  readonly sections = input<DocSection[]>([]);
  activeSectionId = this.observableService.activeSectionId;

  isActive(slug: string): boolean {
    return this.activeSectionId() === slug;
  }
}

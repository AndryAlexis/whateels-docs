import { Component, inject, input } from '@angular/core';
import { ObservableSectionService } from '../services/observable-section.service';
import { DocSection } from '../../doc/doc-page.service';

@Component({
  selector: 'app-right-sidebar',
  imports: [],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar {
  private observableService = inject(ObservableSectionService);
  readonly sections = input<DocSection[]>([]);
  activeSectionId = this.observableService.activeSectionId;

  isActive(fragmentId: string): boolean {
    return this.activeSectionId() === fragmentId;
  }
}

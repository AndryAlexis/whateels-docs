import { Component, inject } from '@angular/core';
import { ObservableSectionService } from '../services/observable-section.service';

@Component({
  selector: 'app-right-sidebar',
  imports: [],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar {
  private observableService = inject(ObservableSectionService);
  activeSectionId = this.observableService.activeSectionId;

  isActive(fragmentId: string): boolean {
    return this.activeSectionId() === fragmentId;
  }
}

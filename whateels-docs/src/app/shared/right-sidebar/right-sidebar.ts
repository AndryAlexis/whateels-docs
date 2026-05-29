import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ObservableSectionService } from '../services/observable-section.service';

@Component({
  selector: 'app-right-sidebar',
  imports: [RouterLink],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar {
  private observableService = inject(ObservableSectionService);
  activeSectionId = this.observableService.activeSectionId;

  isActive(slug: string): boolean {
    return this.activeSectionId() === slug;
  }
}

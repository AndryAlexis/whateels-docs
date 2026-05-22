import { Component, inject, HostBinding } from '@angular/core';
import { ManagementSidebarService } from '../services/management-sidebar.service';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-management-sidebar',
  imports: [Logo],
  templateUrl: './management-sidebar.html',
  styleUrl: './management-sidebar.css',
})
export class ManagementSidebar {
  managementSidebarService = inject(ManagementSidebarService);

  @HostBinding('class.active')
  get isActive(): boolean {
    return this.managementSidebarService.isOpen();
  }
}
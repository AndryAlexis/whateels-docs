import { Component, inject } from '@angular/core';
import { ManagementSidebarService } from '../services/management-sidebar.service';
import { ManagementFloatingMenuService } from '../services/management-floating-menu.service';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-management-header',
  imports: [Logo],
  templateUrl: './management-header.html',
  styleUrl: './management-header.css',
})
export class ManagementHeader {
  managementSidebarService = inject(ManagementSidebarService);
  managementFloatingMenuService = inject(ManagementFloatingMenuService);
}

import { Component } from '@angular/core';
import { ManagementMain } from '../shared/management-main/management-main';
import { ManagementSidebar } from '../shared/management-sidebar/management-sidebar';
import { ManagementHeader } from '../shared/management-header/management-header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ManagementMain, ManagementSidebar, ManagementHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}

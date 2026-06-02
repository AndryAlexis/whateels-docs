import { Component, inject } from '@angular/core';
import { EmailAdminService } from '../../services/email-admin.service';
import { EmailStatusService } from '../../services/email-status.service';
import { WhateelbotService } from '../../services/whateelbot.service';

@Component({
  selector: 'app-email-status',
  imports: [],
  templateUrl: './email-status.html',
  styleUrl: './email-status.css',
})
export class EmailStatus {
  private readonly whateelbotService = inject(WhateelbotService);
  private readonly emailAdminService = inject(EmailAdminService);
  readonly emailStatusService = inject(EmailStatusService);

  goBackToChat(): void {
    this.emailStatusService.close();
    this.whateelbotService.open();
  }

  sendAnotherEmail(): void {
    this.emailStatusService.close();
    this.emailAdminService.open();
  }
}

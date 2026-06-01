import { Component, inject } from '@angular/core';
import { WhateelbotService } from '../../services/whateelbot.service';
import { EmailAdminService } from '../../services/email-admin.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-mywhateelbot',
  imports: [],
  templateUrl: './mywhateelbot.html',
  styleUrl: './mywhateelbot.css',
})
export class Mywhateelbot {
  private readonly chatService = inject(ChatService);
  private readonly whateelbotService = inject(WhateelbotService);
  private readonly emailAdminService = inject(EmailAdminService);

  openEmailAdmin(): void {
    this.whateelbotService.close();
    this.emailAdminService.open();
  }
  
  closeChat(): void {
    this.chatService.close();
  }
}

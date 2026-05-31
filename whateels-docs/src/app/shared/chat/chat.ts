import { Component, inject } from '@angular/core';
import { Mywhateelbot } from './mywhateelbot/mywhateelbot';
import { EmailAdmin } from './email-admin/email-admin';
import { ChatService } from '../services/chat.service';
import { WhateelbotService } from '../services/whateelbot.service';
import { EmailAdminService } from '../services/email-admin.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [Mywhateelbot, EmailAdmin],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  private readonly chatService = inject(ChatService);
  private readonly whateelbotService = inject(WhateelbotService);
  private readonly emailAdminService = inject(EmailAdminService);

  isChatOpen(): boolean {
    return this.chatService.isOpen();
  }

  toggleChat(): void {
    this.chatService.toggle();
  }

  isWhateelbotOpen(): boolean {
    return this.whateelbotService.isOpen();
  }

  toggleWhateelbot(): void {
    this.whateelbotService.toggle();
  }

  isEmailAdminOpen(): boolean {
    return this.emailAdminService.isOpen();
  }

  toggleEmailAdmin(): void {
    this.emailAdminService.toggle();
  }
}

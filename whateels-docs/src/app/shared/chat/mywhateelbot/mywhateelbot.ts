import { Component, inject, OnDestroy, signal } from '@angular/core';
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
  readonly messages = this.whateelbotService.messages;
  readonly draftMessage = signal('');
  private readonly pendingReplyTimers = new Set<number>();

  onDraftMessageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.draftMessage.set(input.value);
  }

  sendMessage(event: SubmitEvent): void {
    event.preventDefault();

    const message = this.draftMessage().trim();

    if (!message) {
      return;
    }

    this.whateelbotService.addUserMessage(message);
    const thinkingMessage = this.whateelbotService.addBotThinkingMessage();
    this.draftMessage.set('');

    const timerId = window.setTimeout(() => {
      this.whateelbotService.updateMessage(thinkingMessage.id, {
        text: 'Response',
        status: 'sent',
      });
      this.pendingReplyTimers.delete(timerId);
    }, 1000);

    this.pendingReplyTimers.add(timerId);

  }

  ngOnDestroy(): void {
    for (const timerId of this.pendingReplyTimers) {
      window.clearTimeout(timerId);
    }

    this.pendingReplyTimers.clear();
  }

  openEmailAdmin(): void {
    this.whateelbotService.close();
    this.emailAdminService.open();
  }
  
  closeChat(): void {
    this.chatService.close();
  }
}

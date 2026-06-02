import { Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
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
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLElement>;
  readonly messages = this.whateelbotService.messages;
  readonly draftMessage = signal('');
  private readonly pendingReplyTimers = new Set<number>();
  private pendingScrollFrame: number | null = null;

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
    this.queueScrollToBottom();

    const timerId = window.setTimeout(() => {
      this.whateelbotService.updateMessage(thinkingMessage.id, {
        text: 'Response wejdew iofwej woeijf eñfoiej feñwoifjweñfoijwefñoiwejñeowijfwñoifjeji',
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

    if (this.pendingScrollFrame !== null) {
      window.cancelAnimationFrame(this.pendingScrollFrame);
      this.pendingScrollFrame = null;
    }
  }

  openEmailAdmin(): void {
    this.whateelbotService.close();
    this.emailAdminService.open();
  }
  
  closeChat(): void {
    this.chatService.close();
  }

  private queueScrollToBottom(): void {
    if (this.pendingScrollFrame !== null) {
      window.cancelAnimationFrame(this.pendingScrollFrame);
    }

    this.pendingScrollFrame = window.requestAnimationFrame(() => {
      const chatBodyElement = this.chatBody?.nativeElement;

      if (chatBodyElement) {
        chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
      }

      this.pendingScrollFrame = null;
    });
  }
}

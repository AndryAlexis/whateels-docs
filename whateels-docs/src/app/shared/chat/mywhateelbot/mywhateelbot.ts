import { Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { WhateelbotService } from '../../services/whateelbot.service';
import { EmailAdminService } from '../../services/email-admin.service';
import { ChatService } from '../../services/chat.service';

type ChatApiResponse = {
  message?: string;
};

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
  private pendingScrollFrame: number | null = null;

  onDraftMessageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.draftMessage.set(input.value);
  }

  async sendMessage(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const message = this.draftMessage().trim();

    if (!message) {
      return;
    }

    this.whateelbotService.addUserMessage(message);
    const thinkingMessage = this.whateelbotService.addBotThinkingMessage();
    this.draftMessage.set('');
    this.queueScrollToBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Chat endpoint failed with status ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;
      const botReply = typeof data.message === 'string' && data.message.trim()
        ? data.message.trim()
        : 'I could not generate a response right now.';

      this.whateelbotService.updateMessage(thinkingMessage.id, {
        text: botReply,
        status: 'sent',
      });
    } catch (error) {
      console.error('Chat request failed:', error);
      this.whateelbotService.failMessage(
        thinkingMessage.id,
        'Sorry, I cannot answer right now. Please try again in a moment.'
      );
    }
  }

  ngOnDestroy(): void {
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

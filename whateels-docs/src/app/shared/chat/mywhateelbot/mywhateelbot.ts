import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
export class Mywhateelbot implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly chatService = inject(ChatService);
  private readonly whateelbotService = inject(WhateelbotService);
  private readonly emailAdminService = inject(EmailAdminService);
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLElement>;
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLTextAreaElement>;
  readonly messages = this.whateelbotService.messages;
  readonly draftMessage = signal('');
  private pendingScrollFrame: number | null = null;

  ngAfterViewInit(): void {
    if (!this.isBrowser()) {
      return;
    }

    this.resizeMessageInput();
  }

  onDraftMessageChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.draftMessage.set(input.value);
    this.resizeMessageInput();
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void this.sendMessage();
  }

  async sendMessage(event?: SubmitEvent): Promise<void> {
    event?.preventDefault();

    const message = this.draftMessage().trim();

    if (!message) {
      return;
    }

    this.whateelbotService.addUserMessage(message);
    const thinkingMessage = this.whateelbotService.addBotThinkingMessage();
    this.draftMessage.set('');
    if (this.isBrowser()) {
      window.requestAnimationFrame(() => this.resizeMessageInput());
    }
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
      this.queueScrollToBottom();
    } catch (error) {
      console.error('Chat request failed:', error);
      this.whateelbotService.failMessage(
        thinkingMessage.id,
        'Sorry, I cannot answer right now. Please try again in a moment.'
      );
      this.queueScrollToBottom();
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser()) {
      return;
    }

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
    if (!this.isBrowser()) {
      return;
    }

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

  private resizeMessageInput(): void {
    if (!this.isBrowser()) {
      return;
    }

    const textarea = this.messageInput?.nativeElement;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';

    const computedStyles = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(computedStyles.lineHeight) || 20;
    const paddingTop = Number.parseFloat(computedStyles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(computedStyles.paddingBottom) || 0;
    const borderTop = Number.parseFloat(computedStyles.borderTopWidth) || 0;
    const borderBottom = Number.parseFloat(computedStyles.borderBottomWidth) || 0;

    const maxVisibleLines = 3;
    const maxHeight =
      lineHeight * maxVisibleLines + paddingTop + paddingBottom + borderTop + borderBottom;
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

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
export class Mywhateelbot implements OnDestroy, AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly chatService = inject(ChatService);
  private readonly whateelbotService = inject(WhateelbotService);
  private readonly emailAdminService = inject(EmailAdminService);
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLElement>;
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLTextAreaElement>;
  readonly messages = this.whateelbotService.messages;
  readonly messageMaxLength = 250;
  readonly draftMessage = signal('');
  private readonly chatRequestTimeoutMs = 15000;
  private pendingScrollFrame: number | null = null;
  private readonly pendingRequestControllers = new Set<AbortController>();
  private lastInputContentHeight = 0;
  private lastInputLineBreakCount = 0;

  ngAfterViewInit(): void {
    if (!this.isBrowser()) {
      return;
    }

    this.resizeMessageInput();
  }

  onDraftMessageChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const nextValue =
      input.value.length > this.messageMaxLength
        ? input.value.slice(0, this.messageMaxLength)
        : input.value;

    if (nextValue !== input.value) {
      input.value = nextValue;
    }

    this.draftMessage.set(nextValue);
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
    this.resetDraftMessage();
    this.queueScrollToBottom();

    const requestController = new AbortController();
    this.pendingRequestControllers.add(requestController);
    const timeoutId = window.setTimeout(() => {
      requestController.abort();
    }, this.chatRequestTimeoutMs);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: requestController.signal,
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
      const fallbackMessage =
        error instanceof DOMException && error.name === 'AbortError'
          ? 'The request took too long. Please try again.'
          : 'Sorry, I cannot answer right now. Please try again in a moment.';

      this.whateelbotService.failMessage(
        thinkingMessage.id,
        fallbackMessage
      );
      this.queueScrollToBottom();
    } finally {
      window.clearTimeout(timeoutId);
      this.pendingRequestControllers.delete(requestController);
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

    for (const requestController of this.pendingRequestControllers) {
      requestController.abort();
    }

    this.pendingRequestControllers.clear();
  }

  openEmailAdmin(): void {
    this.whateelbotService.close();
    this.emailAdminService.open();
  }
  
  closeChat(): void {
    this.chatService.close();
  }

  private resetDraftMessage(): void {
    this.draftMessage.set('');
    this.lastInputContentHeight = 0;
    this.lastInputLineBreakCount = 0;

    if (!this.isBrowser()) {
      return;
    }

    const textarea = this.messageInput?.nativeElement;

    if (textarea) {
      textarea.value = '';
    }

    window.requestAnimationFrame(() => this.resizeMessageInput());
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

    const computedStyles = window.getComputedStyle(textarea);
    const lineHeight = this.resolveLineHeight(computedStyles);
    const paddingTop = Number.parseFloat(computedStyles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(computedStyles.paddingBottom) || 0;
    const borderTop = Number.parseFloat(computedStyles.borderTopWidth) || 0;
    const borderBottom = Number.parseFloat(computedStyles.borderBottomWidth) || 0;

    const maxVisibleLines = 3;
    const maxHeight =
      lineHeight * maxVisibleLines + paddingTop + paddingBottom + borderTop + borderBottom;

    const lineBreakCount = this.countLineBreaks(textarea.value);

    textarea.style.height = '0';
    const contentHeight = textarea.scrollHeight;
    const nextHeight = Math.min(contentHeight, maxHeight);
    const wrappedToNewLine =
      contentHeight > this.lastInputContentHeight &&
      lineBreakCount === this.lastInputLineBreakCount;

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';

    if (wrappedToNewLine && contentHeight > maxHeight) {
      textarea.scrollTop = textarea.scrollHeight;
    }

    this.lastInputContentHeight = contentHeight;
    this.lastInputLineBreakCount = lineBreakCount;
  }

  private countLineBreaks(value: string): number {
    return (value.match(/\n/g) ?? []).length;
  }

  private resolveLineHeight(computedStyles: CSSStyleDeclaration): number {
    const parsedLineHeight = Number.parseFloat(computedStyles.lineHeight);

    if (Number.isFinite(parsedLineHeight)) {
      return parsedLineHeight;
    }

    const parsedFontSize = Number.parseFloat(computedStyles.fontSize);
    return Number.isFinite(parsedFontSize) ? parsedFontSize * 1.2 : 20;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

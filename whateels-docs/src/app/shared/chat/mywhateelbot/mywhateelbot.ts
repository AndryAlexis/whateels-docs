import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, TimeoutError, timeout } from 'rxjs';
import { WhateelbotService } from '../../services/whateelbot.service';
import { WhateelbotApiService } from '../../services/whateelbot-api.service';
import { EmailAdminService } from '../../services/email-admin.service';
import { ChatService } from '../../services/chat.service';

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
  private readonly whateelbotApiService = inject(WhateelbotApiService);
  private readonly emailAdminService = inject(EmailAdminService);
  @ViewChild('chatBody') private chatBody?: ElementRef<HTMLElement>;
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLTextAreaElement>;
  readonly messages = this.whateelbotService.messages;
  readonly messageMaxLength = 250;
  readonly showEmailAdminSuggestion = signal(false);
  readonly isPending = signal(false);
  readonly draftMessage = signal('');
  private readonly humanHandoffSentence =
    "If you'd like, you can contact the WhatEELS team using the button below this message.";
  private pendingScrollFrame: number | null = null;
  private pendingSubscription: Subscription | null = null;
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
    this.sendMessage();
  }

  sendMessage(event?: SubmitEvent): void {
    event?.preventDefault();

    const message = this.draftMessage().trim();

    if (!message || this.isPending()) {
      return;
    }

    this.isPending.set(true);
    this.showEmailAdminSuggestion.set(false);

    this.whateelbotService.addUserMessage(message);
    const thinkingMessage = this.whateelbotService.addBotThinkingMessage();
    this.resetDraftMessage();
    this.queueScrollToBottom();

    this.pendingSubscription?.unsubscribe();
    this.pendingSubscription = this.whateelbotApiService
      .send(message)
      .pipe(timeout(15000))
      .subscribe({
        next: (data) => {
          const botReply =
            typeof data.message === 'string' && data.message.trim()
              ? data.message.trim()
              : 'I could not generate a response right now.';

          this.showEmailAdminSuggestion.set(data.needsHumanSupport === true);
          this.whateelbotService.updateMessage(thinkingMessage.id, { text: botReply, status: 'sent' });
          this.queueScrollToBottom();
          this.isPending.set(false);
        },
        error: (err: unknown) => {
          let fallbackMessage: string;

          if (err instanceof TimeoutError) {
            fallbackMessage = `The request took too long and I couldn't complete the response. ${this.humanHandoffSentence}`;
          } else if (
            err instanceof HttpErrorResponse &&
            typeof err.error?.message === 'string' &&
            err.error.message.trim()
          ) {
            fallbackMessage = this.ensureHumanHandoffHint(err.error.message.trim());
          } else {
            fallbackMessage = `Sorry, I cannot answer right now. ${this.humanHandoffSentence}`;
          }

          this.showEmailAdminSuggestion.set(true);
          this.whateelbotService.failMessage(thinkingMessage.id, fallbackMessage);
          this.queueScrollToBottom();
          this.isPending.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.pendingSubscription?.unsubscribe();

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

    window.requestAnimationFrame(() => {
      this.resizeMessageInput();
      this.focusMessageInput();
    });
  }

  private focusMessageInput(): void {
    if (!this.isBrowser()) {
      return;
    }

    this.messageInput?.nativeElement.focus();
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

  private ensureHumanHandoffHint(text: string): string {
    const normalizedText = text.trim();

    if (/whateels\s+team|button\s+(right\s+)?below|below\s+(this\s+)?message/i.test(normalizedText)) {
      return normalizedText;
    }

    return `${normalizedText} ${this.humanHandoffSentence}`;
  }
}

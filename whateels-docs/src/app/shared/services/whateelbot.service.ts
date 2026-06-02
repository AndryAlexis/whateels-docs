import { Injectable, signal } from '@angular/core';

export type WhateelbotRole = 'user' | 'bot';
export type WhateelbotMessageStatus = 'sent' | 'thinking' | 'error';

export type WhateelbotMessage = {
  id: string;
  role: WhateelbotRole;
  text: string;
  createdAt: number;
  status: WhateelbotMessageStatus;
};

@Injectable({
  providedIn: 'root',
})
export class WhateelbotService {
  isOpen = signal<boolean>(true);
  messages = signal<WhateelbotMessage[]>([this.createWelcomeMessage()]);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  clearMessages(): void {
    this.messages.set([this.createWelcomeMessage()]);
  }

  addUserMessage(text: string): WhateelbotMessage {
    return this.appendMessage('user', text, 'sent');
  }

  addBotMessage(text: string): WhateelbotMessage {
    return this.appendMessage('bot', text, 'sent');
  }

  addBotThinkingMessage(text = 'Thinking...'): WhateelbotMessage {
    return this.appendMessage('bot', text, 'thinking');
  }

  updateMessage(id: string, patch: Partial<Pick<WhateelbotMessage, 'text' | 'status'>>): void {
    this.messages.update((current) =>
      current.map((message) => (message.id === id ? { ...message, ...patch } : message))
    );
  }

  failMessage(id: string, errorText = 'Something went wrong. Please try again.'): void {
    this.updateMessage(id, { text: errorText, status: 'error' });
  }

  private appendMessage(
    role: WhateelbotRole,
    text: string,
    status: WhateelbotMessageStatus
  ): WhateelbotMessage {
    const message: WhateelbotMessage = {
      id: this.createMessageId(),
      role,
      text: text.trim(),
      createdAt: Date.now(),
      status,
    };

    this.messages.update((current) => [...current, message]);
    return message;
  }

  private createMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private createWelcomeMessage(): WhateelbotMessage {
    return {
      id: 'welcome-message',
      role: 'bot',
      text: "Hello! I'm WhatEELBot, your friendly documentation assistant. How can I help you today?",
      createdAt: Date.now(),
      status: 'sent',
    };
  }
}

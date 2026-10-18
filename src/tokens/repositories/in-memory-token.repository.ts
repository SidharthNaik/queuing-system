import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Token } from '../token.entity';
import { TokenRepository } from './token.repository';

/**
 * Keeps the queue in process memory; everything is lost on restart.
 * When the day changes the counter restarts at 1 and any tokens left
 * unserved from the previous day are discarded.
 */
@Injectable()
export class InMemoryTokenRepository extends TokenRepository {
  private currentDay: string | null = null;
  private lastNumber = 0;
  private queue: Token[] = [];

  /** Assigns the next number for `day` and enqueues the token. */
  create(day: string, createdAt: Date): Token {
    this.rollOver(day);
    const token: Token = {
      id: randomUUID(),
      number: ++this.lastNumber,
      day,
      createdAt,
    };
    this.queue.push(token);
    return token;
  }

  /** Dequeues the oldest token, or returns null if the queue is empty. */
  takeNext(day: string): Token | null {
    this.rollOver(day);
    return this.queue.shift() ?? null;
  }

  /** Returns how many tokens are waiting for `day`. */
  countWaiting(day: string): number {
    this.rollOver(day);
    return this.queue.length;
  }

  /** Resets the counter and clears the queue when `day` differs from the current day. */
  private rollOver(day: string): void {
    if (this.currentDay === day) return;
    this.currentDay = day;
    this.lastNumber = 0;
    this.queue = [];
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CLOCK, Clock, toDayKey } from './clock';
import { TokenRepository } from './repositories/token.repository';
import { Token } from './token.entity';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokens: TokenRepository,
    @Inject(CLOCK) private readonly now: Clock,
  ) {}

  /** Issues a new token and reports how many customers are ahead of it. */
  create(): { token: Token; waitingAhead: number } {
    const now = this.now();
    const token = this.tokens.create(toDayKey(now), now);
    const waitingAhead = this.tokens.countWaiting(token.day) - 1;
    return { token, waitingAhead };
  }

  /** Takes the oldest waiting token off the queue, or null if it is empty. */
  callNext(): Token | null {
    return this.tokens.takeNext(toDayKey(this.now()));
  }
}

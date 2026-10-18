import { Token } from '../token.entity';

/**
 * Storage for the token queue. Abstract class so it can double as the
 * Nest injection token; swap the implementation to move to a database.
 */
export abstract class TokenRepository {
  /** Issues the next number for `day` and appends the token to the queue. */
  abstract create(day: string, createdAt: Date): Token;

  /** Removes and returns the oldest waiting token for `day`, or null if none. */
  abstract takeNext(day: string): Token | null;

  /** Number of tokens still waiting for `day`. */
  abstract countWaiting(day: string): number;
}

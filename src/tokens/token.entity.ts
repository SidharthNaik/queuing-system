export interface Token {
  id: string;
  /** Number shown to the customer. Restarts at 1 every day. */
  number: number;
  /** Calendar day (YYYY-MM-DD, server local time) the token was issued for. */
  day: string;
  createdAt: Date;
}

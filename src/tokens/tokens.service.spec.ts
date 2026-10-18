import { Test } from '@nestjs/testing';
import { CLOCK } from './clock';
import { InMemoryTokenRepository } from './repositories/in-memory-token.repository';
import { TokenRepository } from './repositories/token.repository';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
  let service: TokensService;
  let now: Date;

  beforeEach(async () => {
    now = new Date(2026, 9, 18, 9, 0);
    const moduleRef = await Test.createTestingModule({
      providers: [
        TokensService,
        { provide: TokenRepository, useClass: InMemoryTokenRepository },
        { provide: CLOCK, useValue: () => now },
      ],
    }).compile();
    service = moduleRef.get(TokensService);
  });

  it('issues sequential numbers starting at 1', () => {
    expect(service.create().token.number).toBe(1);
    expect(service.create().token.number).toBe(2);
    expect(service.create().token.number).toBe(3);
  });

  it('reports how many tokens are waiting ahead', () => {
    expect(service.create().waitingAhead).toBe(0);
    expect(service.create().waitingAhead).toBe(1);
    service.callNext();
    expect(service.create().waitingAhead).toBe(1);
  });

  it('calls tokens in the order they were created', () => {
    const first = service.create().token;
    const second = service.create().token;
    expect(service.callNext()).toEqual(first);
    expect(service.callNext()).toEqual(second);
  });

  it('returns null when nobody is waiting', () => {
    expect(service.callNext()).toBeNull();
    service.create();
    service.callNext();
    expect(service.callNext()).toBeNull();
  });

  it('does not reuse numbers after tokens are served', () => {
    service.create();
    service.callNext();
    expect(service.create().token.number).toBe(2);
  });

  it('restarts numbering and drops unserved tokens on a new day', () => {
    service.create();
    service.create();
    now = new Date(2026, 9, 19, 9, 0);

    expect(service.callNext()).toBeNull();
    const token = service.create().token;
    expect(token.number).toBe(1);
    expect(token.day).toBe('2026-10-19');
  });
});

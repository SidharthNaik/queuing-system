import { Module } from '@nestjs/common';
import { CLOCK, Clock } from './clock';
import { InMemoryTokenRepository } from './repositories/in-memory-token.repository';
import { TokenRepository } from './repositories/token.repository';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  controllers: [TokensController],
  providers: [
    TokensService,
    { provide: TokenRepository, useClass: InMemoryTokenRepository },
    { provide: CLOCK, useValue: (() => new Date()) satisfies Clock },
  ],
})
export class TokensModule {}

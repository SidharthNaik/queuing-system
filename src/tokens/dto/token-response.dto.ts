import { ApiProperty } from '@nestjs/swagger';
import { Token } from '../token.entity';

export class TokenResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 7, description: 'Token number shown to the customer' })
  number: number;

  @ApiProperty({ example: '2026-10-18' })
  day: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  /** Maps a stored token to its API representation. */
  static from(token: Token): TokenResponseDto {
    return {
      id: token.id,
      number: token.number,
      day: token.day,
      createdAt: token.createdAt.toISOString(),
    };
  }
}

export class CreatedTokenResponseDto extends TokenResponseDto {
  @ApiProperty({ example: 3, description: 'Tokens waiting ahead of this one' })
  waitingAhead: number;
}

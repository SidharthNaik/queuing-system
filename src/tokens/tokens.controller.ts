import { Controller, HttpCode, HttpStatus, NotFoundException, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatedTokenResponseDto, TokenResponseDto } from './dto/token-response.dto';
import { TokensService } from './tokens.service';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  @ApiOperation({ summary: 'Create a token for a customer' })
  @ApiCreatedResponse({ type: CreatedTokenResponseDto })
  create(): CreatedTokenResponseDto {
    const { token, waitingAhead } = this.tokensService.create();
    return { ...TokenResponseDto.from(token), waitingAhead };
  }

  @Post('next')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Call the next waiting token for service (staff)' })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiNotFoundResponse({ description: 'No tokens are waiting' })
  next(): TokenResponseDto {
    const token = this.tokensService.callNext();
    if (!token) {
      throw new NotFoundException('No tokens are waiting');
    }
    return TokenResponseDto.from(token);
  }
}

import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { AccessTokenResponse } from './classes/access-token.response'

@Controller('auth')
@ApiTags('Access Token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({
    operationId: 'getAccessToken',
    summary: 'Get an access token that can be used to authenticate against the api',
  })
  @ApiOkResponse({ description: 'Access token', type: AccessTokenResponse })
  public async getAccessToken(): Promise<AccessTokenResponse> {
    return this.authService.getAccessToken()
  }
}

import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'

import { AccessTokenResponse } from './classes/access-token.response'
import { JwtPayload } from './classes/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async getAccessToken(): Promise<AccessTokenResponse> {
    const payload: JwtPayload = {
      sub: uuidv4(),
    }
    const expireDate = new Date()
    expireDate.setFullYear(expireDate.getFullYear() + 10) // expire in 10 years
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: `10y`,
      }),
      expires: expireDate,
    }
  }
}

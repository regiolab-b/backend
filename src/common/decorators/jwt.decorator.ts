import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload } from 'src/auth/classes/jwt-payload.interface'

export const ReqJwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getClientIp } from 'src/globals/helpers/getIp.helper';
import { PrismaService } from 'src/globals/services/prisma.service';
import { extractJWT } from '../helpers/extract-token';
export type Payload = {
  exp: number;
  iat: number;
  id: Id;
  jti: string;
  userType?: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'REFRESH',
) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = extractJWT(request);
          return token;
        },
      ]),
      secretOrKey: env('REFRESH_TOKEN_SECRET'),
      jsonWebTokenOptions: {
        maxAge: +env('REFRESH_TOKEN_EXPIRE_TIME'),
      },
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: Payload) {
    const { id, jti } = payload;
    const clientIp = getClientIp(request);
    const foundedSession = await this.prisma.session.findUnique({
      where: { jti },
    });
    if (clientIp !== foundedSession?.ipAddress) {
      return false;
    }

    if (!id || !jti) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        active: true,
        Role: true,
        Sessions: {
          where: { jti },
          select: { jti: true },
        },
      },
    });

    if (!user || !user.active || !user.Sessions.length) {
      throw new UnauthorizedException('Session not found or user inactive');
    }

    const session = user.Sessions[0];

    return {
      id: user.id,
      jti: session.jti,
      Role: user.Role,
    };
  }
}

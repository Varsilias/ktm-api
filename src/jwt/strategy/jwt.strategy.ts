import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { UserService } from 'src/api/user/services/user.service';
import { NotFoundException } from 'src/common/exceptions/notfound.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
    });
  }

  /**
   *
   * TODO: Do further token validation, looking up the publicId in a list of revoked tokens,
   * enabling us to perform token revocation.
   */

  async validate(payload: any) {
    const user = await this.userService.findUserBy({
      where: { publicId: payload.sub },
    });

    if (!user) {
      throw new NotFoundException('Provided auth user not found', user);
    }

    return {
      // tokenObj: {
      //   publicId: payload.sub,
      //   email: payload.email,
      // },
      ...user,
    };
  }
}

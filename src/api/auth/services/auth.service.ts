import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dto';
import { Utils } from 'src/common/utils';
import { UserService } from 'src/api/user/services/user.service';
import { PostgresError } from 'src/common/helpers/enum';
import { ConflictException } from 'src/common/exceptions/conflict.exception';
import { ServerErrorException } from 'src/common/exceptions/server-error.exception';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    try {
      const { password: userPasssword } = signUpDto;
      const hash = await Utils.hashPassword(userPasssword);
      const { password, ...user } = await this.userService.createUser({
        ...signUpDto,
        password: hash,
      });
      return user;
    } catch (error: any) {
      console.log(error);
      if (error?.code === PostgresError.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new ConflictException('Email already taken', null);
      }
      throw new ServerErrorException('Something went wrong', null);
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password: userPassword } = signInDto;
    const user = await this.userService.findUserBy({ where: { email } });

    if (!user) {
      throw new BadRequestException('Email or Password Incorrect');
    }

    const isPasswordMatch = await Utils.comparePassword(
      userPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Email or Password Incorrect');
    }

    const payload = {
      sub: user.publicId,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const { password, ...data } = user;

    return { access_token: accessToken, user: data };
  }
}

import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/api/auth/services/auth.service';
import { UserService } from 'src/api/user/services/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: createMock<UserService>() },
        { provide: JwtService, useValue: createMock<JwtService>() },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be sign up user', async () => {
    const user = {
      firstname: 'Daniel',
      lastname: 'Okoronkwo',
      email: 'daniel@gmail.com',
      password: 'P@ssword1234',
    };

    const result = await authService.signUp(user);
    expect(userService.createUser).toHaveBeenCalled();
  });
});

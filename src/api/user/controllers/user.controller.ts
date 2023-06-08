import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Public } from 'src/common/decorators/public-request.decorator';
import {
  CurrentUser,
  IDecoratorUser,
} from 'src/common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Public()
  async findAll(@CurrentUser() iuser: IDecoratorUser) {
    console.log(iuser);
    const user = await this.userService.findUserBy({
      where: { id: 1 },
    });
    return user;
  }
}

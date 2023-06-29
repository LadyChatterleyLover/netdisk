import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDto: UserDto) {
    return await this.userService.register(userDto)
  }

  @Post('login')
  async login(@Body() userDto: UserDto) {
    return await this.userService.login(userDto)
  }
}

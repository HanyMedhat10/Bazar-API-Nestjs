import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { User } from './entities/user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RoleGuard } from 'src/utility/common/role/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async create(@Body() userSignUpDto: UserSignUpDto): Promise<{ user: User }> {
    return { user: await this.usersService.signup(userSignUpDto) };
  }
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.usersService.login(userLoginDto);
  }

  // @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<User> {
  //   return this.usersService.findOne(+id);
  // }
  @UseGuards(JwtAuthGuard, RoleGuard) //must using token in using this method (login)
  @Get('profile')
  profile(@Req() req, @Res() res) {
    // return res.status(HttpStatus.OK).json(req.user);
    const userJson = res.status(HttpStatus.OK).json(req.user);
    // console.log(req);
    const id = req.user.id;
    console.log(id);
    return userJson;
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}

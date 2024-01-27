import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { User } from './entities/user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RoleGuard } from 'src/utility/common/role/role.guard';
import { Roles } from 'src/utility/common/roles/roles.decorator';

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
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async signup(userSignUpDto: UserSignUpDto): Promise<User> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if (userExists) {
      throw new BadRequestException('Email is not available.');
    }
    userSignUpDto.password = await bcrypt.hash(userSignUpDto.password, 10);
    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }
  async login(userLoginDto: UserLoginDto) {
    // const userExists = await this.findUserByEmail(userLoginDto.email);
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userLoginDto.email })
      .getOne();
    if (!userExists) {
      // throw new BadRequestException('Email or Password is incorrect.');
      throw new UnauthorizedException();
    }
    const matchPassword = await bcrypt.compare(
      userLoginDto.password,
      userExists.password,
    );
    if (!matchPassword) {
      // throw new BadRequestException('Email or Password is incorrect.');
      throw new UnauthorizedException();
    }

    delete userExists.password;
    const token = sign({ ...userExists }, 'secrete');
    return { token, userExists };
  }
  async accessToken(user: User) {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '30m' },
    );
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
  async findOne(id: number): Promise<User> {
    // const user = await this.usersRepository.findOne({ where: { id } });
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`This id: ${id} not found `);
    }
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSignUp {
  //   @IsNotEmpty({ message: 'Name can not be null ' })
  //   @IsString({ message: 'Name should be string ' })
  @IsNotEmpty()
  @IsString()
  name: string;
  //   @IsEmail({}, { message: 'Please provide a validator email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  //   @MinLength(5, { message: 'Password minimum character should be 5.' })
  @MinLength(5)
  @IsString()
  password: string;
}

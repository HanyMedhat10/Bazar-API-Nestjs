import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
    } else {
      const token = authHeader.split(' ')[1];
      // const { id } = verify(token, 'hadjkldsjfkscjcsmvksdjsmckjsd');
      const { id } = <JwtPayload>(
        verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
      );
      const currentUser = await this.usersService.findOne(+id);
      console.log(currentUser);
      next();
    }
  }
}
interface JwtPayload {
  id: string;
}

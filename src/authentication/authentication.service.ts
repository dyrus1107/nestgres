import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registration.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    try {
      const createdUser = await this.usersService.createUser({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined; // Hide password
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new ConflictException('Email already exists');

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching)
      throw new UnauthorizedException('Invalid credentials');
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayLoad = { userId };
    
    const token = this.jwtService.sign(payload);
    
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}

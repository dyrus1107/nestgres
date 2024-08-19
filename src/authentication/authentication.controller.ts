import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/registration.dto';

import { UsersService } from 'src/users/users.service';
import { JwtAuthenticationGuard } from './guards/jwtAuthentication.guard';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { JwtRefreshGuard } from './guards/JwtRefresh.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    const result = await this.authenticationService.register(registrationData);
    return result;
  }

  @Post('log-in')
  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(200)
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(
      user.id,
      refreshTokenCookie.token,
    );
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
  }

  @Post('log-out')
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    const cookies = await this.authenticationService.getCookiesForLogOut(
      request.user.id,
    );
    request.res.setHeader('Set-Cookie', cookies.join('; '))
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}

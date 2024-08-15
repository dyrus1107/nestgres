import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthenticationGuard } from 'src/authentication/guards/jwtAuthentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from 'src/authentication/interfaces/requestWithUser.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addAvatar(
      request.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Post('files')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  addPrivateFile(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addPrivateFile(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }
}

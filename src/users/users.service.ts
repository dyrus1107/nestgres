import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { PrivateFilesService } from 'src/private-files/private-files.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly filesService: FilesService,
    private readonly privateFilesService: PrivateFilesService,
  ) {}

  async getUserById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getUserIfRefreshTokenMatch(userId: number, token: string) {
    const user = await this.getUserById(userId);
    const isMatching = await bcrypt.compare(
      token,
      user.currentHashedRefreshToken,
    );

    if (isMatching) {
      return user;
    }
  }

  async createUser(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const user = await this.getUserById(userId);
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    this.usersRepository.update(userId, { ...user, avatar });
    return avatar;
  }

  async removeAvatar(userId: number) {
    const user = await this.getUserById(userId);
    const fileId = user.avatar.id;
    if (!fileId) return;
    await this.filesService.deletePublicFile(fileId);
    this.usersRepository.update(userId, {
      ...user,
      avatar: null,
    });
  }

  async addPrivateFile(userId: number, fileBuffer: Buffer, filename: string) {
    console.log(fileBuffer);
    return this.privateFilesService.uploadFile(userId, fileBuffer, filename);
  }

  async setCurrentRefreshToken(userId: number, refreshToken: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    const user = await this.usersRepository.update(
      { id: userId },
      {
        currentHashedRefreshToken: null,
      },
    );
  }
}

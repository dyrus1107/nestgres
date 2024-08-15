import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from 'src/files/entities/publicFile.entity';
import Address from './entities/address.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FilesModule } from 'src/files/files.module';
import { PrivateFile } from 'src/private-files/entities/privateFile.entity';
import { PrivateFilesModule } from 'src/private-files/private-files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, PublicFile, PrivateFile]),
    FilesModule,
    PrivateFilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

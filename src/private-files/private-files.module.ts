import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateFile } from './entities/privateFile.entity';
import { PrivateFilesService } from './private-files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateFile]), ConfigModule],
  providers: [PrivateFilesService],
  exports: [PrivateFilesService],
})
export class PrivateFilesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entities/publicFile.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

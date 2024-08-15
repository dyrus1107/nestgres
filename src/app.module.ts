import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import { PrivateFilesService } from './private-files/private-files.service';
import { PrivateFilesModule } from './private-files/private-files.module';


@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    CategoriesModule,
    FilesModule,
    PrivateFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

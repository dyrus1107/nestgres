import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostsController from './posts.controller';
import PostsService from './posts.service';
import { Post } from './entities/post.entity';
import { Category } from 'src/categories/entities/category.entity';
import { PostsSearchService } from './posts-search.service';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category]), SearchModule],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}

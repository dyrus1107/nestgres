import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/authentication/guards/jwtAuthentication.guard';
import { RequestWithUser } from 'src/authentication/interfaces/requestWithUser.interface';
import { FindOneParams } from 'src/utils/findOneParams';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import PostsService from './posts.service';

@Controller('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAllPosts(@Query('search') search: string) {
    if (!search) return this.postsService.getAllPosts();
    const searchPosts = await this.postsService.searchForPosts(search);
    return searchPosts;
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findPostById(@Param('id') { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }
  
  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  async updatePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(Number(id));
  }
}

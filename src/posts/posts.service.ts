import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async createPost(post: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepository.create(post);
    await this.postsRepository.save(newPost);
    return newPost;
  }

  findAllPosts(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findPostById(id: number): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async updatePost(id: number, post: UpdatePostDto): Promise<void> {
    const updatedPost = await this.postsRepository.update(id, post);
    if (!updatedPost.affected)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: number): Promise<void> {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}

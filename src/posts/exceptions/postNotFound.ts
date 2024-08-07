import { NotFoundException } from '@nestjs/common';

class PostNotFound extends NotFoundException {
  constructor(postId: number) {
    super(`Post with id ${postId} not found`);
  }
}

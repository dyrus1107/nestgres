import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from './entities/post.entity';
import { PostSearchBody } from './types/postSearchBody.interface';

@Injectable()
export class PostsSearchService {
  private readonly index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index<PostSearchBody>({
      index: this.index,
      document: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    });
  }

  async search(text: string): Promise<PostSearchBody[]> {
    const result = await this.elasticsearchService.search<PostSearchBody>({
      index: this.index,
      query: {
        multi_match: {
          query: text,
          fields: ['title', 'content'],
        },
      },
    });
    const hits = result.hits.hits;
    return hits.map((hit) => hit._source);
  }

  async remove(postId: number) {
    return this.elasticsearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          id: postId,
        },
      },
    });
  }
}

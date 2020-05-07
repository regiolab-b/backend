import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'

import { Article } from './article.entity'

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: MongoRepository<Article>,
  ) {}
  public async getArticles(): Promise<Article[]> {
    return this.articleRepository.find({ take: 50 })
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository, ObjectID } from 'typeorm'

import { ArticleDetails } from './classes/article-details.entity'
import { ArticleListItem } from './classes/article-list-item.entity'

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleDetails)
    private readonly articleDetailsRepository: MongoRepository<ArticleDetails>,
    @InjectRepository(ArticleListItem)
    private readonly articleListItemRepository: MongoRepository<ArticleListItem>,
  ) {}
  public async listArticles(): Promise<ArticleListItem[]> {
    return this.articleListItemRepository.find({
      take: 50,
    })
  }

  public async getArticleDetails(articleId: string): Promise<ArticleDetails> {
    const article = await this.articleDetailsRepository.findOne(articleId)
    if (!article) {
      throw new NotFoundException('No article found with this id', 'ArticleNotFoundError')
    }
    return article
  }
}

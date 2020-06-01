import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectIdArray } from 'src/common/functions/objectid-array.function'
import { RecommendationsService } from 'src/recommendations/recommendations.service'
import { MongoRepository } from 'typeorm'

import { ArticleDetails } from './classes/article-details.entity'
import { ArticleListItem } from './classes/article-list-item.entity'

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleDetails)
    private readonly articleDetailsRepository: MongoRepository<ArticleDetails>,
    @InjectRepository(ArticleListItem)
    private readonly articleListItemRepository: MongoRepository<ArticleListItem>,
    private readonly recommendationsService: RecommendationsService,
  ) {}
  public async listArticles(amount = 50): Promise<ArticleListItem[]> {
    return this.articleListItemRepository.find({
      take: amount,
      order: {
        pubDate: 'DESC',
      },
    })
  }

  public async listRecommendedArticles(userId: string, amount = 50): Promise<ArticleListItem[]> {
    const recommendedArticleIds = await this.recommendationsService.getRecommendationIds(userId)
    const recommendedArticleObjectIds = ObjectIdArray(recommendedArticleIds)

    let recommendedArticles = await this.articleListItemRepository.findByIds(recommendedArticleObjectIds)

    if (recommendedArticles.length < amount) {
      const idsNotToFind = recommendedArticleIds.concat(await this.recommendationsService.getLikedWatchedIds(userId))
      const objectIdsNotToFind = ObjectIdArray(idsNotToFind)

      const additionalArticles = await this.articleListItemRepository.find({
        take: amount - recommendedArticles.length,
        order: {
          pubDate: 'DESC',
        },
        where: {
          _id: {
            $nin: objectIdsNotToFind,
          },
        },
      })

      recommendedArticles = recommendedArticles.concat(additionalArticles)
    }
    return recommendedArticles
  }

  public async getArticleDetails(articleId: string): Promise<ArticleDetails> {
    const article = await this.articleDetailsRepository.findOne(articleId)
    if (!article) {
      throw new NotFoundException('No article found with this id', 'ArticleNotFoundError')
    }
    return article
  }
}

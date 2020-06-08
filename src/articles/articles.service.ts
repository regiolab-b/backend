import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'
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

  public async listIds(ids: ObjectId[]): Promise<ArticleListItem[]> {
    return this.articleListItemRepository.findByIds(ids)
  }

  public async listRecommendedArticles(userId: string, amount = 50): Promise<ArticleListItem[]> {
    amount-- // Take one less out of database so we can insert a random article later

    const recommendedArticleIds = await this.recommendationsService.getRecommendationIds(userId, amount)
    const recommendedArticleObjectIds = ObjectIdArray(recommendedArticleIds)

    let recommendedArticles = await this.listIds(recommendedArticleObjectIds)

    if (recommendedArticles.length < amount) {
      const idsNotToFind = recommendedArticleIds.concat(await this.recommendationsService.getAllHistoryIds(userId))
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

    const currentArticleIds = recommendedArticles.map(article => article._id.toString())
    const randomArticle = (await this.ListRandomArticles(1, currentArticleIds))[0]

    // Add random article to position between 0 and 5
    recommendedArticles.splice(Math.round(Math.random() * 5), 0, randomArticle)

    return recommendedArticles
  }

  public async ListRandomArticles(amount: number, excludeIds: string[] = []): Promise<ArticleListItem[]> {
    const objectIdsNotToFind = ObjectIdArray(excludeIds)

    return this.articleListItemRepository
      .aggregateEntity([
        {
          $match: {
            _id: {
              $nin: objectIdsNotToFind,
            },
          },
        },
        {
          $sample: {
            size: amount,
          },
        },
      ])
      .toArray()
  }

  public async getArticleDetails(articleId: string): Promise<ArticleDetails> {
    const article = await this.articleDetailsRepository.findOne(articleId)
    if (!article) {
      throw new NotFoundException('No article found with this id', 'ArticleNotFoundError')
    }
    return article
  }
}

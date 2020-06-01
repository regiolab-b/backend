import { Injectable } from '@nestjs/common'
import { ArticlesService } from 'src/articles/articles.service'
import { ObjectIdArray } from 'src/common/functions/objectid-array.function'
import { RecommendationsService } from 'src/recommendations/recommendations.service'

import { HistoryItem } from './classes/history-item.class'

@Injectable()
export class HistoryService {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  public async listHistory(userId: string): Promise<HistoryItem[]> {
    const historyIds = await this.recommendationsService.getAllHistoryIds(userId)
    const historyObjectIds = ObjectIdArray(historyIds)

    const likedIds = await this.recommendationsService.getLikeHistoryIds(userId)

    const historyItems = (await this.articlesService.listIds(historyObjectIds)).map((article: HistoryItem) => {
      article.liked = likedIds.includes(article._id.toString())
      return article
    })

    return historyItems
  }
}

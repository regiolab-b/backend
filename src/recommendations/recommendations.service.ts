import Raccoon from '@maruware/raccoon'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from 'src/config/config.service'

@Injectable()
export class RecommendationsService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  private raccoon: Raccoon

  onModuleInit(): void {
    this.raccoon = new Raccoon({
      className: 'article',
      redisUrl: this.config.REDIS_URL,
    })
  }

  public async like(userId: string, articleId: string): Promise<void> {
    return this.raccoon.liked(userId, articleId)
  }

  public async dislike(userId: string, articleId: string): Promise<void> {
    return this.raccoon.disliked(userId, articleId)
  }

  public async getRecommendationIds(userId: string, amount = 50): Promise<string[]> {
    return this.raccoon.recommendFor(userId, amount)
  }

  public async getLikeHistoryIds(userId: string): Promise<string[]> {
    return this.raccoon.allLikedFor(userId)
  }

  public async getDislikeHistoryIds(userId: string): Promise<string[]> {
    return this.raccoon.allDislikedFor(userId)
  }

  public async getAllHistoryIds(userId: string): Promise<string[]> {
    return this.raccoon.allWatchedFor(userId)
  }

  public async deleteHistoryItem(userId: string, articleId: string): Promise<void> {
    await this.raccoon.unliked(userId, articleId)
    await this.raccoon.undisliked(userId, articleId)
    await this.raccoon.updateRecommendationsFor(userId)
  }
}

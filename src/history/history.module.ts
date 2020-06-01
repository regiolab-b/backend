import { Module } from '@nestjs/common'
import { ArticlesModule } from 'src/articles/articles.module'
import { RecommendationsModule } from 'src/recommendations/recommendations.module'

import { HistoryController } from './history.controller'
import { HistoryService } from './history.service'

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [RecommendationsModule, ArticlesModule],
})
export class HistoryModule {}

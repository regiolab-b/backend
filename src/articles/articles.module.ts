import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecommendationsModule } from 'src/recommendations/recommendations.module'

import { ArticlesController } from './articles.controller'
import { ArticlesService } from './articles.service'
import { ArticleDetails } from './classes/article-details.entity'
import { ArticleListItem } from './classes/article-list-item.entity'

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [
    TypeOrmModule.forFeature([ArticleDetails]),
    TypeOrmModule.forFeature([ArticleListItem]),
    RecommendationsModule,
  ],
})
export class ArticlesModule {}

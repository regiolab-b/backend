import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Article } from './article.entity'
import { ArticlesController } from './articles.controller'
import { ArticlesService } from './articles.service'

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [TypeOrmModule.forFeature([Article])],
})
export class ArticlesModule {}

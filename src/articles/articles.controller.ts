import { Controller, Get } from '@nestjs/common'

import { Article } from './article.entity'
import { ArticlesService } from './articles.service'

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  @Get()
  public async getArticles(): Promise<Article[]> {
    return this.articleService.getArticles()
  }
}

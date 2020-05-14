import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { ArticlesService } from './articles.service'
import { ArticleDetails } from './classes/article-details.entity'
import { ArticleIdParams } from './classes/article-id.params'
import { ArticleListItem } from './classes/article-list-item.entity'

@Controller('articles')
@ApiTags('Articles')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad user input' })
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  @ApiOperation({ operationId: 'getArticles', summary: 'Get list of articles' })
  @ApiOkResponse({ description: 'List of articles', type: ArticleListItem, isArray: true })
  public async getArticles(): Promise<ArticleListItem[]> {
    return this.articleService.listArticles()
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getArticleDetails', summary: 'Get article details' })
  @ApiOkResponse({ description: 'Full article object', type: ArticleDetails })
  @ApiNotFoundResponse({ description: 'No article found with this id' })
  public async getArticleDetails(@Param() articleIdParams: ArticleIdParams): Promise<ArticleDetails> {
    return this.articleService.getArticleDetails(articleIdParams.id)
  }
}

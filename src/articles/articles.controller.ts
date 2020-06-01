import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { JwtPayload } from 'src/auth/classes/jwt-payload.interface'
import { ReqJwtPayload } from 'src/common/decorators/jwt.decorator'
import { RecommendationsService } from 'src/recommendations/recommendations.service'

import { ArticlesService } from './articles.service'
import { ArticleDetails } from './classes/article-details.entity'
import { ArticleIdParams } from './classes/article-id.params'
import { ArticleListItem } from './classes/article-list-item.entity'
import { ArticleListQueryParams } from './classes/article-list-query.params'

@Controller('articles')
@ApiTags('Articles')
@ApiBadRequestResponse({ description: 'Bad user input' })
export class ArticlesController {
  constructor(
    private readonly articleService: ArticlesService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  @ApiOperation({ operationId: 'getArticles', summary: 'Get list of articles' })
  @ApiOkResponse({ description: 'List of articles', type: ArticleListItem, isArray: true })
  public async getArticles(@Query() articleListQueryParams: ArticleListQueryParams): Promise<ArticleListItem[]> {
    return this.articleService.listArticles(articleListQueryParams.limit)
  }

  @Get('recommended')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'getRecommendedArticles', summary: 'Get list of recommended articles' })
  @ApiOkResponse({ description: 'List of articles', type: ArticleListItem, isArray: true })
  public async getRecommendedArticles(
    @Query() articleListQueryParams: ArticleListQueryParams,
    @ReqJwtPayload() jwtPayload: JwtPayload,
  ): Promise<ArticleListItem[]> {
    return this.articleService.listRecommendedArticles(jwtPayload.sub, articleListQueryParams.limit)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getArticleDetails', summary: 'Get article details' })
  @ApiOkResponse({ description: 'Full article object', type: ArticleDetails })
  @ApiNotFoundResponse({ description: 'No article found with this id' })
  public async getArticleDetails(@Param() articleIdParams: ArticleIdParams): Promise<ArticleDetails> {
    return this.articleService.getArticleDetails(articleIdParams.id)
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'likeArticle', summary: 'Like an article' })
  @ApiCreatedResponse({ description: 'Successfully liked Article' })
  @ApiNotFoundResponse({ description: 'No article found with this id' })
  public async likeArticle(
    @Param() articleIdParams: ArticleIdParams,
    @ReqJwtPayload() jwtPayload: JwtPayload,
  ): Promise<void> {
    await this.articleService.getArticleDetails(articleIdParams.id)
    return this.recommendationsService.like(jwtPayload.sub, articleIdParams.id)
  }

  @Post(':id/dislike')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'dislikeArticle', summary: 'Dislike an article' })
  @ApiCreatedResponse({ description: 'Successfully disliked Article' })
  @ApiNotFoundResponse({ description: 'No article found with this id' })
  public async dislikeArticle(
    @Param() articleIdParams: ArticleIdParams,
    @ReqJwtPayload() jwtPayload: JwtPayload,
  ): Promise<void> {
    await this.articleService.getArticleDetails(articleIdParams.id)
    return this.recommendationsService.dislike(jwtPayload.sub, articleIdParams.id)
  }
}

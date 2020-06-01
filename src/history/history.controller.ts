import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ArticleIdParams } from 'src/articles/classes/article-id.params'
import { JwtPayload } from 'src/auth/classes/jwt-payload.interface'
import { ReqJwtPayload } from 'src/common/decorators/jwt.decorator'
import { RecommendationsService } from 'src/recommendations/recommendations.service'

import { HistoryItem } from './classes/history-item.class'
import { HistoryService } from './history.service'

@Controller('history')
@ApiTags('History')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad user input' })
export class HistoryController {
  constructor(
    private readonly historyService: HistoryService,
    private readonly recommendationService: RecommendationsService,
  ) {}

  @Get()
  @ApiOperation({ operationId: 'getHistory', summary: 'Get like/dislike history' })
  @ApiOkResponse({ description: 'List of articles', type: HistoryItem, isArray: true })
  public async getHistory(@ReqJwtPayload() jwtPayload: JwtPayload): Promise<HistoryItem[]> {
    return this.historyService.listHistory(jwtPayload.sub)
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteHistoryItem', summary: 'Delete history item' })
  @ApiOkResponse({ description: 'History item successfully deleted' })
  public async deleteHistoryItem(
    @Param() articleIdParams: ArticleIdParams,
    @ReqJwtPayload() jwtPayload: JwtPayload,
  ): Promise<void> {
    return this.recommendationService.deleteHistoryItem(jwtPayload.sub, articleIdParams.id)
  }
}

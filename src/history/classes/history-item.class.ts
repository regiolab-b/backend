import { ApiProperty } from '@nestjs/swagger'
import { ArticleListItem } from 'src/articles/classes/article-list-item.entity'

export class HistoryItem extends ArticleListItem {
  @ApiProperty({ description: 'Whether the user has liked or disliked this article', example: true })
  liked?: boolean
}

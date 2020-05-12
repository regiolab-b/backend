import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'

import { ArticleListItem } from './article-list-item.entity'

@Entity('articles')
export class ArticleDetails extends ArticleListItem {
  @ApiProperty({
    description: 'Body of the article',
    example:
      '<p>Het<a href="http://auschwitz.org/en/museum/news/" target="_blank"> concentratiekamp Auschwitz</a>&nbsp;is eigenlijk een verzameling van (sub)kampen en fabrieken waar de nazi\'s...',
  })
  @Column()
  body: string
}

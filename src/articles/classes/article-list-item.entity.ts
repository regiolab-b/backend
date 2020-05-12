import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity('articles')
export class ArticleListItem {
  @ObjectIdColumn()
  @ApiProperty({
    description: 'Unique id for this user',
    example: '5d49e11f600a423ffc0b1297',
  })
  _id: string

  @ApiProperty({
    description: 'Headline of the article',
    example: '27 januari: Auschwitz bevrijd, internationale herdenking Holocaust',
  })
  @Column()
  headline: string

  @ApiProperty({
    description: 'Ankeiler of the article',
    example: 'Op 27 januari 1945, precies 75 jaar geleden, bevrijden de Russen het concentratiekamp Auschwitz.',
  })
  @Column()
  ankeiler: string

  @ApiProperty({
    description: 'Lead of the article',
    example:
      "Op 27 januari 1945, precies 75 jaar geleden, bevrijden de Russen het concentratiekamp Auschwitz. De naam Auschwitz wordt het symbool van de rassenwaan van de nazi's.",
  })
  @Column()
  lead: string

  @ApiProperty({
    description: 'Publishing date of the article',
    example: new Date('2020-01-27T08:45:47.000Z'),
  })
  @Column()
  pubDate: Date

  @ApiProperty({
    description: 'Whether or not the article is breaking news',
    example: false,
  })
  @Column()
  breakingNews: boolean
}

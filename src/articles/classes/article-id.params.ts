import { ApiProperty } from '@nestjs/swagger'

export class ArticleIdParams {
  @ApiProperty({
    example: '5d49e11f600a423ffc0b1297',
    description: 'Unique id of the article',
  })
  // @IsMongoId()
  id: string
}

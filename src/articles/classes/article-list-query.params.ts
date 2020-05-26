import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsPositive } from 'class-validator'
import { jsonParseTransformer } from 'src/common/transformers/json-parse.transformer'

export class ArticleListQueryParams {
  @ApiPropertyOptional({
    example: 10,
    description: 'Max amount of articles to return',
  })
  @Transform(jsonParseTransformer, { toClassOnly: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number
}

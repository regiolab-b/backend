import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, Matches, NotContains } from 'class-validator'

const jsonParse = (value: any): any => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

export class RegiolabConfig {
  @IsNotEmpty()
  @IsString()
  @Matches(new RegExp('^(development|production|test|provision)$'))
  NODE_ENV: 'development' | 'production' | 'test' | 'provision' = 'development'

  @Transform(jsonParse, { toClassOnly: true })
  @IsNumber()
  PORT = 3000

  @Transform((value: string) => (value.endsWith('/') ? value.slice(0, -1) : value)) // Remove trailing slash
  @IsString()
  BASE_URL = '/'

  @IsNotEmpty()
  @IsString()
  MONGODB_URL: string

  @IsNotEmpty()
  @IsString()
  REDIS_URL: string

  @IsNotEmpty()
  @IsString()
  @NotContains('CHANGE-ME-PLEASE!', {
    message: 'Set TOKEN_SECRET to something safe and random!',
  })
  TOKEN_SECRET: string
}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ArticlesModule } from './articles/articles.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'
import { HistoryModule } from './history/history.module'
import { RecommendationsModule } from './recommendations/recommendations.module'

const entityContext = require.context('.', true, /\.entity\.ts$/)

@Module({
  imports: [
    ArticlesModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        url: config.MONGODB_URL,
        keepConnectionAlive: true,
        entities: [
          ...entityContext.keys().map(id => {
            const entityModule = entityContext(id)
            const [entity] = Object.values<any>(entityModule)
            return entity
          }),
        ],
        useNewUrlParser: true,
        useUnifiedTopology: true,
        appname: 'regiolab',
      }),
    }),
    AuthModule,
    RecommendationsModule,
    HistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

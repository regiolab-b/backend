import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ArticlesModule } from './articles/articles.module'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

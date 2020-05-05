import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

declare const module: any

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
}
bootstrap()

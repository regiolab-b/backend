import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { ConfigService } from './config/config.service'

declare const module: any

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const config: ConfigService = app.get('ConfigService')

  app.setGlobalPrefix(config.BASE_URL)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
      exceptionFactory: (errors: ValidationError[]): BadRequestException =>
        new BadRequestException(errors, 'ValidationError'),
    }),
  )

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Regiolab API')
    .setDescription("Look mom! I'm learning your reading preferences!")
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Access Token')
    .addTag('Articles')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup(`${config.BASE_URL}/swagger`, app, swaggerDocument, {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
      displayRequestDuration: true,
      displayOperationId: true,
    },
  })

  await app.listen(config.PORT)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
}
bootstrap()

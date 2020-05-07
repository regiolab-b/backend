import { Injectable, Logger } from '@nestjs/common'
import { classToClass, plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import dotenv from 'dotenv'
import fs from 'fs'

import { RegiolabConfig } from './regiolab-config.class'

export type EnvConfig = Record<string, any>

@Injectable()
export class ConfigService extends RegiolabConfig {
  constructor(filePath: string) {
    super()
    const config = dotenv.parse(fs.readFileSync(filePath))
    this.validateConfig(config)
  }

  private readonly logger = new Logger(ConfigService.name, true)

  /**
   * Ensures all needed variables are set, and assigns them to this class
   */
  private async validateConfig(envConfig: EnvConfig): Promise<void> {
    // Run the transformer twice, as the transform decorator seems to run after the type decorator
    let regiolabConfig = plainToClass(RegiolabConfig, envConfig)
    regiolabConfig = classToClass(regiolabConfig)

    try {
      await validateOrReject(regiolabConfig, { validationError: { target: false, value: false } })
    } catch (errors) {
      this.logger.error('Configuration validation failed')
      this.logger.error(errors)
      process.exit(1)
    }
    Object.assign(this, regiolabConfig)
  }
}

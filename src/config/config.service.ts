import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppException } from '../common/exceptions/app.exception';
import { AppStatus } from '../common/helpers/enum';

interface EnvConfig {
  [prop: string]: string;
}

const EnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...['development', 'production', 'staging'])
    .default('development'),
  ENVIRONMENT: Joi.string()
    .valid(...['development', 'production', 'staging'])
    .default('development'),
  PORT: Joi.number().default(3000),
  BASE_URL: Joi.string(),
  DB_URL: Joi.string(),
  DB_PORT: Joi.number(),
  DB_NAME: Joi.string(),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_HOST: Joi.string(),
  DB_TYPE: Joi.string(),
  JWT_SECRET: Joi.string(),
  JWT_EXPIRY: Joi.number(),
  //   DB_MIGRATIONS: Joi.string(),
  //   DB_ALLOW_REFRESH: Joi.boolean(),
  //   DB_TRUST_CERT: Joi.boolean(),
});

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const config = ConfigService.parseEnvVariables();
    this.envConfig = ConfigService.validateConfig(config);
  }

  private static parseEnvVariables() {
    const envFile =
      process.env.NODE_ENV === 'development' ? '.env' : '.env.production';
    return dotenv.parse(fs.readFileSync(envFile));
  }

  private static validateConfig(envConfig: EnvConfig) {
    const { error, value: validatedEnvValues } = EnvSchema.validate(envConfig, {
      allowUnknown: true,
    });

    if (error) {
      throw new AppException(
        `Config validation error: ${error.message}`,
        AppStatus.CONFIGURATION_ERROR,
      );
    }

    return validatedEnvValues;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get inProduction(): boolean {
    return this.envConfig.NODE_ENV === 'production';
  }

  get PORT(): number {
    return parseInt(this.envConfig.PORT || '3000', 10);
  }

  get BASE_URL(): string {
    return this.envConfig.BASE_URL;
  }

  get DB_URL(): string {
    return this.envConfig.DB_URL;
  }

  get DB_USER(): string {
    return this.envConfig.DB_USER;
  }

  get DB_NAME(): string {
    return this.envConfig.DB_NAME;
  }

  get DB_PASSWORD(): string {
    return this.envConfig.DB_PASSWORD;
  }

  get DB_HOST(): string {
    return this.envConfig.DB_HOST;
  }
  get DB_PORT(): number {
    return Number(this.envConfig.DB_PORT);
  }

  get DB_SYNC() {
    return /(true|on|1)/gi.test(this.envConfig.DB_SYNC);
  }

  get DB_TYPE() {
    return this.envConfig.DB_TYPE;
  }

  get JWT_SECRET() {
    return this.envConfig.JWT_SECRET;
  }

  get JWT_EXPIRY() {
    return this.envConfig.JWT_EXPIRY;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get apiUrl(): string {
    return this.config.getOrThrow('PAYMENT_API_URL');
  }

  get publicKey(): string {
    return this.config.getOrThrow('PAYMENT_PUBLIC_KEY');
  }

  get privateKey(): string {
    return this.config.getOrThrow('PAYMENT_PRIVATE_KEY');
  }

  get integrityKey(): string {
    return this.config.getOrThrow('PAYMENT_INTEGRITY_KEY');
  }

  get dataBaseHost(): string {
    return this.config.getOrThrow('DB_HOST');
  }

  get dataBasePort(): number {
    return this.config.getOrThrow('DB_PORT');
  }

  get dataBaseUsername(): string {
    return this.config.getOrThrow('DB_USERNAME');
  }

  get dataBasePassword(): string {
    return this.config.getOrThrow('DB_PASSWORD');
  }

  get dataBaseDataBase(): string {
    return this.config.getOrThrow('DB_DATABASE');
  }

  get nodeEnv(): string {
    return this.config.getOrThrow('NODE_ENV');
  }

  get port(): number {
    return Number(this.getOrThrow('PORT'));
  }

  get apiPrefix(): string {
    return this.getOrThrow('API_PREFIX');
  }

  get corsOrigin(): string {
    return this.getOrThrow('CORS_ORIGIN');
  }

  private getOrThrow(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) {
      throw new Error(`❌ Missing environment variable: ${key}`);
    }
    return value;
  }
}

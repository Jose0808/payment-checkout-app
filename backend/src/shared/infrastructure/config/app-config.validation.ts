import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  PAYMENT_API_URL!: string;

  @IsString()
  @IsNotEmpty()
  PAYMENT_PUBLIC_KEY!: string;

  @IsString()
  @IsNotEmpty()
  PAYMENT_PRIVATE_KEY!: string;

  @IsString()
  @IsNotEmpty()
  PAYMENT_INTEGRITY_KEY!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error(errors);
    throw new Error(`❌ Environment validation error: ${errors.toString()}`);
  }

  return validatedConfig;
}

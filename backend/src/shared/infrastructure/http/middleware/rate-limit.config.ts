import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const rateLimitConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    },
  ],
};

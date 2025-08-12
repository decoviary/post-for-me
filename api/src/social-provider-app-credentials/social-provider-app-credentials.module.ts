import { Module } from '@nestjs/common';
import { SocialProviderAppCredentialsService } from './social-provider-app-credentials.service';

@Module({
  controllers: [],
  providers: [SocialProviderAppCredentialsService],
  exports: [SocialProviderAppCredentialsService],
})
export class SocialProviderAppCredentialsModule {}

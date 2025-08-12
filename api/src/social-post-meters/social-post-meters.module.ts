import { Module } from '@nestjs/common';
import { SocialPostMetersService } from './social-post-meters.service';

@Module({
  controllers: [],
  providers: [SocialPostMetersService],
  exports: [SocialPostMetersService],
})
export class SocialPostMetersModule {}

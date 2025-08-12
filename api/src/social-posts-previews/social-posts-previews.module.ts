import { Module } from '@nestjs/common';
import { SocialPostPreviewsController } from './social-posts-previews.controller';
import { SocialPostPreviewsService } from './social-posts-previews.service';

@Module({
  imports: [],
  controllers: [SocialPostPreviewsController],
  providers: [SocialPostPreviewsService],
})
export class SocialPostPreviewsModule {}

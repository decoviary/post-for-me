import { Module } from '@nestjs/common';
import { SocialPostsController } from './social-posts.controller';
import { SocialPostsService } from './social-posts.service';
import { PaginationModule } from '../pagination/pagination.module';
import { SocialPostMetersModule } from '../social-post-meters/social-post-meters.module';

@Module({
  imports: [PaginationModule, SocialPostMetersModule],
  controllers: [SocialPostsController],
  providers: [SocialPostsService],
})
export class SocialPostsModule {}

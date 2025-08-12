import { Module } from '@nestjs/common';
import { SocialPostResultsController } from './social-post-results.controller';

import { PostResultsService } from './social-post-results.service';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [PaginationModule],
  controllers: [SocialPostResultsController],
  providers: [PostResultsService],
})
export class SocialPostResultsModule {}

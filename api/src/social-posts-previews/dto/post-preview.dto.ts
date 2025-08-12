import { ApiProperty } from '@nestjs/swagger';
import { SocialPostMediaDto } from '../../social-posts/dto/post-media.dto';
import { PlatformConfiguration } from '../../social-posts/dto/post-configurations.dto';

export class SocialPostPreviewDto {
  @ApiProperty({ description: 'Caption text for the post', required: true })
  caption: string;

  @ApiProperty({
    description: 'Array of media URLs associated with the post',
    nullable: true,
    required: false,
    type: SocialPostMediaDto,
    isArray: true,
  })
  media: SocialPostMediaDto[] | null;

  @ApiProperty({
    description: 'Platform of the post',
    required: true,
  })
  platform: string;

  @ApiProperty({
    description: 'Username of the social account',
    required: false,
  })
  social_account_username?: string | null;

  @ApiProperty({ description: 'Id of the social account', required: true })
  social_account_id: string;

  @ApiProperty({
    description: 'Url of the social account profile picture',
    required: false,
  })
  social_account_profile_picture_url?: string | null;

  @ApiProperty({
    description: 'Additional configuration for this platform',
    required: false,
  })
  configuration?: PlatformConfiguration;
}

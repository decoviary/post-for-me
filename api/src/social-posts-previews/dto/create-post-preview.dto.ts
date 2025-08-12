import { ApiProperty } from '@nestjs/swagger';
import { SocialPostMediaDto } from '../../social-posts/dto/post-media.dto';
import {
  AccountConfigurationDto,
  PlatformConfigurationsDto,
} from '../../social-posts/dto/post-configurations.dto';

export class SocialAccountPreview {
  @ApiProperty({
    description: 'ID of the social account, ex: spc_12312',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Platform of the social account',
    required: true,
  })
  platform: string;

  @ApiProperty({
    description: 'username of the social account',
    required: false,
    type: String,
  })
  username?: string | null;
}

export class CreateSocialPostPreviewDto {
  @ApiProperty({ description: 'Caption text for the post' })
  caption: string;

  @ApiProperty({
    description:
      'Array of social accounts. Can preview non connected accounts, just specify a random ID',
    required: true,
    isArray: true,
    type: SocialAccountPreview,
  })
  preview_social_accounts: SocialAccountPreview[];

  @ApiProperty({
    description: 'Platform-specific configurations for the post',
    nullable: true,
    required: false,
    type: PlatformConfigurationsDto,
  })
  platform_configurations?: PlatformConfigurationsDto | null;

  @ApiProperty({
    description: 'Account-specific configurations for the post',
    nullable: true,
    required: false,
    isArray: true,
    type: AccountConfigurationDto,
  })
  account_configurations?: AccountConfigurationDto[] | null;

  @ApiProperty({
    description: 'Array of media URLs associated with the post',
    nullable: true,
    required: false,
    type: SocialPostMediaDto,
    isArray: true,
  })
  media: SocialPostMediaDto[] | null;
}

import { ApiProperty } from '@nestjs/swagger';

export class SocialAccountProviderAuthUrlDto {
  @ApiProperty({
    description:
      'The url to redirect the user to, in order to connect their account',
  })
  url: string;

  @ApiProperty({ description: 'The social account provider' })
  platform: string;
}

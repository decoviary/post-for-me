import { ApiProperty } from '@nestjs/swagger';

export class SocialPostMediaDto {
  @ApiProperty({ description: 'Public URL of the media' })
  url: string;

  @ApiProperty({
    description: 'Public URL of the thumbnail for the media',
    nullable: true,
    required: false,
  })
  thumbnail_url: string | null | undefined;

  @ApiProperty({
    description:
      'Timestamp in milliseconds of frame to use as thumbnail for the media',
    nullable: true,
    required: false,
  })
  thumbnail_timestamp_ms: number | null | undefined;
}

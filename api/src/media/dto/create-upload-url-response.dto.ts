import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadUrlResponseDto {
  @ApiProperty({
    description: 'The signed upload URL for the client to upload the file',
    type: String,
  })
  upload_url: string;

  @ApiProperty({
    description:
      'The public URL for the media, to use once file has been uploaded',
    type: String,
  })
  media_url: string;
}

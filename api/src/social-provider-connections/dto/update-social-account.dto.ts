import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSocialAccountDto {
  @ApiProperty({
    description: "The platform's username of the social account",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: "The platform's external id of the social account",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  external_id?: string;
}

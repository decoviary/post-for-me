import { ApiProperty } from '@nestjs/swagger';

export class PostValidation {
  isValid: boolean;
  errors: string[];
}

export class InvalidSocialPostDto {
  @ApiProperty({ description: 'Errors for the invalid post' })
  error: string[];
}

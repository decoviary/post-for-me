import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export class BasePaginatedQueryDto {
  @ApiProperty({
    description: 'Number of items to skip',
    default: DEFAULT_OFFSET,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset: number = DEFAULT_OFFSET;

  @ApiProperty({
    description: 'Number of items to return',
    default: DEFAULT_LIMIT,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  @IsOptional()
  @Type(() => Number)
  limit: number = DEFAULT_LIMIT;
}

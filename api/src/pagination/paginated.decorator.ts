import { applyDecorators, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import type { Type } from '@nestjs/common';

export function Paginated<T extends Type<any>>(
  model: T,
  opt?: { name?: string },
): MethodDecorator {
  const decorators = [
    Get(), // Assuming GET is standard for pagination
    ApiOkResponse({
      ...(opt?.name
        ? { description: `Paginated data set for ${opt.name}.` }
        : {}),
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            type: 'object',
            properties: {
              total: {
                type: 'number',
                description: 'Total number of items available.',
              },
              offset: {
                type: 'number',
                description: 'Number of items skipped.',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of items returned.',
              },
              next: {
                type: 'string',
                nullable: true,
                description:
                  'URL to the next page of results, or null if none.',
                example:
                  'https://api.postforme.dev/v1/items?offset=10&limit=10',
              },
            },
            required: ['total', 'offset', 'limit', 'next'],
          },
        },
        required: ['data', 'meta'],
      },
    }),
    ApiResponse({
      status: 500,
      description: `Internal server error when fetching ${
        opt?.name || 'paginated data'
      }.`,
    }),
  ];

  if (opt?.name) {
    decorators.push(
      ApiOperation({
        summary: `Get ${opt.name}`,
        description: `Get a paginated result for ${opt.name} based on the applied filters`,
      }),
    );
  }

  return applyDecorators(...decorators);
}

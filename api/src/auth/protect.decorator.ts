import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

export interface ProtectOptions {
  [key: string]: any;
}

export const PROTECT_OPTIONS = 'protect_options';

export function Protect(options: ProtectOptions = {}) {
  return applyDecorators(
    SetMetadata(PROTECT_OPTIONS, options),
    UseGuards(AuthGuard),
  );
}

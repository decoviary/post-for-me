import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

export const SupabaseClient = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const supabaseService = request.app.get(SupabaseService);

    if (request.userId) {
      return supabaseService.getClient(request.userId);
    }

    return supabaseService.getClient();
  },
);

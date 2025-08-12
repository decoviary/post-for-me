import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SocialProviderAppCredentialsDto } from './dto/social-provider-app-credentials.dto';

@Injectable()
export class SocialProviderAppCredentialsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getSocialProviderAppCredentials(
    provider: string,
    projectId: string,
  ): Promise<SocialProviderAppCredentialsDto | null> {
    const { data, error } = await this.supabaseService.supabaseServiceRole
      .from('social_provider_app_credentials')
      .select('*')
      .eq(
        'provider',
        provider as
          | 'facebook'
          | 'instagram'
          | 'x'
          | 'tiktok'
          | 'youtube'
          | 'pinterest'
          | 'linkedin'
          | 'bluesky'
          | 'threads',
      )
      .eq('project_id', projectId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      provider: data.provider,
      projectId: data?.project_id,
      appId: data?.app_id || '',
      appSecret: data?.app_secret || '',
    };
  }
}

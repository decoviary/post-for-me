import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

import { SocialPostResultDto } from './dto/post-results.dto';
import { SocialPostResultQueryDto } from './dto/post-results.query.dto';

import type { PaginatedRequestQuery } from '../pagination/pagination-request.interface';

@Injectable()
export class PostResultsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getPostPostResultRecord(id: string, projectId: string) {
    const postResults = await this.supabaseService.supabaseClient
      .from('social_post_results')
      .select('*, social_provider_connections(provider, project_id)')
      .eq('id', id)
      .eq('social_provider_connections.project_id', projectId)
      .maybeSingle();

    if (postResults.error) {
      throw postResults.error;
    }

    return postResults;
  }

  async getPostResults(
    queryParams: SocialPostResultQueryDto,
    projectId: string,
  ): PaginatedRequestQuery<SocialPostResultDto> {
    const { offset, limit, post_id, platform } = queryParams;

    const query = this.supabaseService.supabaseClient
      .from('social_post_results')
      .select('*, social_provider_connections!inner(provider, project_id)', {
        count: 'exact',
        head: false,
      })
      .eq('social_provider_connections.project_id', projectId)
      .range(offset, offset + limit - 1);

    if (post_id) {
      if (typeof post_id === 'string') {
        query.eq('post_id', post_id);
      } else if (Array.isArray(post_id)) {
        query.in('post_id', post_id);
      }
    }

    if (platform) {
      if (typeof platform === 'string') {
        query.eq('social_provider_connections.provider', platform);
      } else if (Array.isArray(platform)) {
        query.in(
          'social_provider_connections.provider',
          platform.map(
            (provider) =>
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
          ),
        );
      }
    }

    query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const transformedData: SocialPostResultDto[] = data.map((raw) => {
      let platform_data = null;

      if (raw.success) {
        platform_data = {
          id: raw.provider_post_id,
          url: raw.provider_post_url,
        };
      }

      return {
        id: raw.id,
        social_account_id: raw.provider_connection_id,
        post_id: raw.post_id,
        success: raw.success,
        error: raw.error_message,
        details: raw.details,
        platform_data,
      };
    });

    return {
      data: transformedData,
      count: count || 0,
    };
  }

  async getPostResultById(
    id: string,
    projectId: string,
  ): Promise<SocialPostResultDto | null> {
    const postResults = await this.getPostPostResultRecord(id, projectId);

    if (!postResults.data) {
      return null;
    }

    let platform_data = null;

    if (postResults.data.success) {
      platform_data = {
        id: postResults.data.provider_post_id,
        url: postResults.data.provider_post_url,
      };
    }

    return {
      id: postResults.data.id,
      social_account_id: postResults.data.provider_connection_id,
      post_id: postResults.data.post_id,
      success: postResults.data.success,
      error: postResults.data.error_message,
      details: postResults.data.details,
      platform_data,
    };
  }
}

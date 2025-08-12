import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';

import { SupabaseService } from '../supabase/supabase.service';
import { CreateUploadUrlResponseDto } from './dto/create-upload-url-response.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async createUploadUrl(
    projectId: string,
  ): Promise<CreateUploadUrlResponseDto> {
    const baseStorageUrl =
      this.configService.get<string>('BASE_STORAGE_URL') ||
      'https://data.postforme.dev/storage/v1/object/public/post-media';

    // Sanitize name: hash user_id + timestamp + random
    const randomString = randomBytes(8).toString('hex');
    const hash = createHash('sha256')
      .update(projectId + Date.now().toString() + randomString)
      .digest('hex')
      .slice(0, 24);

    const key = `${projectId}/${hash}`;
    const bucket = 'post-media';

    // Create signed upload URL
    const signedUrl = await this.supabaseService.supabaseClient.storage
      .from(bucket)
      .createSignedUploadUrl(key);

    if (signedUrl.error) throw signedUrl.error;
    if (!signedUrl.data) throw new Error('Signed URL not found');

    return {
      upload_url: signedUrl.data.signedUrl,
      media_url: `${baseStorageUrl}/${key}`,
    };
  }
}

import type { Provider } from '../../lib/global.dto';

export class SocialProviderAppCredentialsDto {
  provider: Provider;
  projectId: string;
  appId: string;
  appSecret: string;
}

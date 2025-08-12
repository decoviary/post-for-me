/* ===============================================================
 Seed "Getting started with the TikTok API" (EN, ES, FR)
 Target schema: cms.*  (canonical-slug + redirect model)
 =============================================================== */
BEGIN;

/* ---------- 3A. ENGLISH LOCALE ------------------------------- */
INSERT INTO cms.resources(status, slug, title, body_blocks, summary, seo_meta)
SELECT
  'published',
  'getting-started-with-tiktok',
  'Getting started with the TikTok API',
  jsonb_build_array(jsonb_build_object('type', 'markdown', 'content', '### Introduction'), jsonb_build_object('type', 'markdown', 'content', 'TikTok''s official API lets your app create, manage, and measure video content at scale.'), jsonb_build_object('type', 'markdown', 'content', '#### Prerequisites'), jsonb_build_object('type', 'markdown', 'content', '- TikTok developer account'), jsonb_build_object('type', 'markdown', 'content', '- OAuth 2.0 client credentials'), jsonb_build_object('type', 'markdown', 'content', '- A public callback URL'), jsonb_build_object('type', 'markdown', 'content', '#### Authentication Flow'), jsonb_build_object('type', 'markdown', 'content', 'TikTok uses [OAuth 2.0 Authorization Code](https://developers.tiktok.com/doc/oauth-user-access-token/).'), jsonb_build_object('type', 'markdown', 'content', '1. Redirect the user to the consent screen.'), jsonb_build_object('type', 'markdown', 'content', '2. Exchange the `code` for an **access token**.'), jsonb_build_object('type', 'markdown', 'content', '3. Refresh the token when it expires.'), jsonb_build_object('type', 'markdown', 'content', '#### Posting a Video'), jsonb_build_object('type', 'markdown', 'content', '
POST https://open.tiktokapis.com/v2/post/publish/
Authorization: Bearer <access_token>
Content-Type: application/json
'), jsonb_build_object('type', 'markdown', 'content', '
{
  "video_id": "<your_uploaded_video_id>",
  "caption": "Hello TikTok!"
}
')),
  'Step-by-step guide to authenticating and publishing videos with the TikTok API.',
  jsonb_build_object('title', 'Getting started with the TikTok API', 'description', 'Quick primer on auth, posting and analytics using TikTok''s official REST API', 'canonical', 'https://example.com/en/getting-started-with-the-tiktok-api');

/* ---------- 4. REDIRECT SLUGS ------------------------------- */
INSERT INTO cms.slug_redirects(slug, target_slug, http_status)
-- English variants
SELECT
  unnest(ARRAY['tiktok-api-guide', 'tiktok-api-tutorial', 'how-to-use-tiktok-api', 'tiktok-developer-guide', 'tiktok-api-getting-started', 'tiktok-oauth-tutorial']),
  'getting-started-with-tiktok',
  301;
COMMIT;


/* ------------------- Seed complete ✔︎ ------------------------ */

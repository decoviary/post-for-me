/* ===============================================================
 Seed "Getting started with the Facebook Graph API"
 Target schema: cms.*  (canonical-slug + redirect model)
 =============================================================== */
BEGIN;

/* ---------- 2. RESOURCE -------------------------------------- */
INSERT INTO cms.resources(status, slug, title, body_blocks, summary, seo_meta)
SELECT
  'published',
  'getting-started-with-facebook',
  'Getting started with the Facebook API',
  jsonb_build_array(jsonb_build_object('type', 'markdown', 'content', '### Introduction'), jsonb_build_object('type', 'markdown', 'content', 'Facebook''s Graph API is the primary way to read and write data on the Meta platform.'), jsonb_build_object('type', 'markdown', 'content', '#### Prerequisites'), jsonb_build_object('type', 'markdown', 'content', '- Facebook Developer account'), jsonb_build_object('type', 'markdown', 'content', '- App ID & App Secret'), jsonb_build_object('type', 'markdown', 'content', '- **Access Token** with required permissions'), jsonb_build_object('type', 'markdown', 'content', '#### App Review & Permissions'), jsonb_build_object('type', 'markdown', 'content', 'Most production apps need review for permissions such as `pages_show_list`, `pages_read_engagement`, or `instagram_basic`.'), jsonb_build_object('type', 'markdown', 'content', '#### Generating a User Access Token'), jsonb_build_object('type', 'markdown', 'content', '
GET https://graph.facebook.com/v19.0/oauth/access_token
  ?client_id=<APP_ID>
  &redirect_uri=<CALLBACK_URL>
  &client_secret=<APP_SECRET>
  &code=<AUTH_CODE>
'), jsonb_build_object('type', 'markdown', 'content', 'The response returns `access_token`, `token_type`, and `expires_in`.'), jsonb_build_object('type', 'markdown', 'content', '#### Posting to a Page Feed'), jsonb_build_object('type', 'markdown', 'content', '
POST https://graph.facebook.com/v19.0/<PAGE_ID>/feed
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
'), jsonb_build_object('type', 'markdown', 'content', '
{
  "message": "Hello, Facebook Graph API!"
}
'), jsonb_build_object('type', 'markdown', 'content', 'A successful call returns the new post ID.'), jsonb_build_object('type', 'markdown', 'content', '#### Reading Insights'), jsonb_build_object('type', 'markdown', 'content', '
GET https://graph.facebook.com/v19.0/<PAGE_ID>/insights
  ?metric=page_impressions,page_engaged_users
  &period=day
'), jsonb_build_object('type', 'markdown', 'content', '### Next steps'), jsonb_build_object('type', 'markdown', 'content', '- Schedule posts with Batch API'), jsonb_build_object('type', 'markdown', 'content', '- Handle Webhooks for real-time updates'), jsonb_build_object('type', 'markdown', 'content', '- Rotate long-lived tokens before expiration')),
  'Step-by-step guide to authenticating, posting, and reading insights with the Facebook Graph API.',
  jsonb_build_object('title', 'Getting started with the Facebook Graph API', 'description', 'Quick primer on auth, publishing, and insights using Facebook''s Graph API', 'canonical', 'https://example.com/resources/getting-started-with-the-facebook-graph-api');

/* ---------- 3. REDIRECT SLUGS -------------------------------- */
INSERT INTO cms.slug_redirects(slug, target_slug, http_status)
SELECT
  unnest(ARRAY['facebook-graph-api-guide', 'facebook-api-tutorial', 'how-to-use-facebook-api', 'facebook-developer-guide', 'facebook-api-getting-started', 'facebook-oauth-tutorial']),
  'getting-started-with-facebook',
  301;
COMMIT;


/* ------------------- Seed complete ✔︎ ------------------------ */

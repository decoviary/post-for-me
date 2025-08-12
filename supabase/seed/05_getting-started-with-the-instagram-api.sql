/* ===============================================================
 Seed "Getting started with the Instagram Graph API"
 Target schema: cms.*  (canonical-slug + redirect model)
 =============================================================== */
BEGIN;

/* ---------- 2. MAIN RESOURCE ---------------------------------------- */
INSERT INTO cms.resources(status, slug, title, body_blocks, summary, seo_meta)
  VALUES ('published', 'getting-started-with-instagram', 'Getting started with the Instagram Graph API', jsonb_build_array(jsonb_build_object('type', 'markdown', 'content', '### Introduction'), jsonb_build_object('type', 'markdown', 'content', 'The Instagram Graph API lets business and creator accounts manage media, comments, and insights.'), jsonb_build_object('type', 'markdown', 'content', '#### Prerequisites'), jsonb_build_object('type', 'markdown', 'content', '- Facebook App in **Live** mode'), jsonb_build_object('type', 'markdown', 'content', '- Instagram Business or Creator account linked to a Facebook Page'), jsonb_build_object('type', 'markdown', 'content', '- `instagram_basic`, `pages_show_list`, `pages_read_engagement` permissions'), jsonb_build_object('type', 'markdown', 'content', '#### Long-Lived User Token'), jsonb_build_object('type', 'markdown', 'content', '
GET https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_secret=<APP_SECRET>
  &access_token=<SHORT_LIVED_TOKEN>
'), jsonb_build_object('type', 'markdown', 'content', 'The long-lived token lasts ~60 days.'), jsonb_build_object('type', 'markdown', 'content', '#### Publishing a Photo'), jsonb_build_object('type', 'markdown', 'content', '
POST https://graph.facebook.com/v19.0/<IG_USER_ID>/media
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json
'), jsonb_build_object('type', 'markdown', 'content', '
{
  "image_url": "https://example.com/hello.jpg",
  "caption": "Hello, Instagram!"
}
'), jsonb_build_object('type', 'markdown', 'content', 'Then **publish**:'), jsonb_build_object('type', 'markdown', 'content', '
POST https://graph.facebook.com/v19.0/<IG_USER_ID>/media_publish
  ?creation_id=<RETURNED_ID>
'), jsonb_build_object('type', 'markdown', 'content', '#### Pulling Insights'), jsonb_build_object('type', 'markdown', 'content', '
GET https://graph.facebook.com/v19.0/<MEDIA_ID>/insights
  ?metric=impressions,reach,engagement
'), jsonb_build_object('type', 'markdown', 'content', '### Best practices'), jsonb_build_object('type', 'markdown', 'content', '- Queue media for scheduled posting'), jsonb_build_object('type', 'markdown', 'content', '- Cache media IDs to avoid duplicate uploads'), jsonb_build_object('type', 'markdown', 'content', '- Follow Instagram Platform Policy to prevent app-review issues')), 'Guide to authentication, publishing media, and retrieving insights with the Instagram Graph API.', jsonb_build_object('title', 'Getting started with the Instagram Graph API', 'description', 'Quick primer on auth, media publishing, and analytics using Instagram''s Graph API', 'canonical', 'https://example.com/resources/getting-started-with-the-instagram-graph-api'));

/* ---------- 3. REDIRECT SLUGS -------------------------------- */
INSERT INTO cms.slug_redirects(slug, target_slug, http_status)
SELECT
  unnest(ARRAY['instagram-graph-api-guide', 'instagram-api-tutorial', 'how-to-use-instagram-api', 'instagram-developer-guide', 'instagram-api-getting-started', 'instagram-oauth-tutorial']),
  'getting-started-with-instagram',
  301;
COMMIT;


/* ------------------- Seed complete ✔︎ ------------------------ */

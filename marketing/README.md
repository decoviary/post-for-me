# Post For Me Marketing Site

The marketing website for Post For Me - a social media automation platform that enables users to create, schedule, and publish content across multiple social media platforms.

## Features

- 🎨 **Modern Design** - Clean, responsive design with Tailwind CSS v4
- 🚀 **Server-Side Rendering** - Fast loading with React Router v7 SSR
- 📱 **Mobile-First** - Optimized for all device sizes
- ⚡️ **Performance Optimized** - Lighthouse-optimized with fast loading times
- 🔍 **SEO Ready** - Meta tags, structured data, and sitemap generation
- 📊 **Analytics Integration** - PostHog for user behavior tracking
- 🎯 **Conversion Focused** - Optimized landing pages and CTAs
- 🌙 **Dark Mode Support** - Theme switching with next-themes
- 📝 **Content Management** - Markdown-based content with type safety
- 🔒 **TypeScript** - Full type safety throughout the application

## Architecture

- **Framework**: React Router v7 with TypeScript
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom design system
- **Icons**: shared icon system for React components
- **Analytics**: PostHog for user tracking and conversion metrics
- **Content**: Markdown-based content management
- **Deployment**: Optimized for Vercel and other edge platforms

## Key Pages

- **Landing Page** - Hero section with product overview and CTAs
- **Features** - Detailed feature breakdown with benefits
- **Pricing** - Subscription plans and pricing tiers
- **About** - Company information and team profiles
- **Blog** - Content marketing and SEO articles
- **Legal** - Privacy policy, terms of service, and compliance

## Getting Started

### Prerequisites

This marketing site is part of a monorepo. The site is standalone but shares components with the dashboard.

### Installation

From the project root:

```bash
bun install
```

### Development

Start the marketing site development server:

```bash
# From project root (recommended)
bun run dev

# Or start just the marketing site (from marketing/ directory)
bun run dev
```

The marketing site will be available at `http://localhost:5174`.

### Environment Setup

Create a `.env.local` file with:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=

POST_HOG_API_KEY=
POST_HOG_API_HOST=
```

## Content Management

### Adding Blog Posts

1. Create a new `.mdx` file in `app/routes/blog/`
2. Add frontmatter with metadata:

```markdown
---
title: "Your Blog Post Title"
description: "SEO description"
publishedAt: "2024-01-01"
author: "Author Name"
tags: ["social-media", "automation"]
---

Your content here...
```

### Updating Features

Feature content is managed in `app/lib/content/features.ts` with type-safe definitions.

### Pricing Updates

Pricing plans are defined in `app/lib/content/pricing.ts` with structured data for easy updates.

## Building for Production

Create a production build:

```bash
bun run build
```

## Testing

Run the test suite:

```bash
# Run tests once
bun run test

# Watch mode for development
bun run test:watch
```

## Code Quality

```bash
# Lint code
bun run lint

# Fix linting issues
bun run lint:fix

# Type checking
bun run typecheck
```

## SEO Optimization

The marketing site includes:

- **Meta Tags** - Dynamic meta tags for each page
- **Open Graph** - Social media sharing optimization
- **Structured Data** - JSON-LD for search engines
- **Sitemap** - Auto-generated XML sitemap
- **Performance** - Optimized images and lazy loading
- **Accessibility** - WCAG compliant components

## Analytics & Tracking

- **PostHog Integration** - User behavior and conversion tracking
- **Performance Monitoring** - Core Web Vitals tracking
- **A/B Testing** - Feature flags for conversion optimization
- **Conversion Funnels** - Track user journey from landing to signup

## Deployment

### Vercel (Recommended)

The marketing site is optimized for Vercel deployment:

```bash
# Deploy to Vercel
vercel --prod
```

### Other Platforms

The site can be deployed to:

- Netlify
- AWS Amplify
- Google Cloud Run
- Railway
- Fly.io

## Project Structure

```
marketing/
├── app/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and content
│   ├── providers/     # Context providers
│   ├── routes/        # Page components and routing
│   └── ui/            # Shadcn/ui components
├── public/            # Static assets and images
└── build/             # Production build output
```

## Performance

The marketing site is optimized for:

- **Core Web Vitals** - LCP, FID, and CLS optimization
- **Image Optimization** - WebP format with lazy loading
- **Code Splitting** - Route-based code splitting
- **Caching** - Aggressive caching strategies
- **Bundle Size** - Minimal JavaScript footprint

## Contributing

1. Follow the existing design system and component patterns
2. Optimize for performance and SEO
3. Test on multiple devices and browsers
4. Update content types when adding new content structures
5. Ensure accessibility compliance

---

Built with ❤️ using React Router v7, Tailwind CSS, and modern web technologies.

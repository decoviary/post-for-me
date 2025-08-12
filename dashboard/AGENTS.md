# Agent Guidelines for Post-for-Me Dashboard

## Commands

- **Build**: `bun run build` (React Router build)
- **Dev**: `bun run dev` (development server)
- **Test**: `bun run test` (Vitest run), `bun run test:watch` (watch mode)
- **Lint**: `bun run lint` (ESLint check), `bun run lint:fix` (auto-fix)
- **Typecheck**: `bun run typecheck` (React Router typegen + tsc)

## Code Style

- **Framework**: React Router v7 with TypeScript
- **Imports**: Use `~/` for app imports, group external imports first
- **Components**: PascalCase, export as named functions
- **Files**: kebab-case for routes, camelCase for utilities
- **Types**: Define interfaces for form data, use Zod schemas for validation
- **Forms**: Use react-hook-form with zodResolver, custom useFormFetcher hook
- **UI**: Radix UI components in `~/ui/`, Tailwind CSS classes
- **Error Handling**: Use toast notifications (sonner), validate inputs
- **Async**: Use fetcher.submit() for form submissions, fetcher.load() for data
- **Naming**: Descriptive names, prefix unused vars with `_`

## Testing

- **Framework**: Vitest with jsdom
- **Single Test**: `bun run test -- path/to/test.spec.ts`

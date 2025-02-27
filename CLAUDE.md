# CLAUDE.md - Wisconsin Inmate Lookup Codebase Guidelines

## Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run start:with-scheduler`: Start server with automated data scraper
- `npm run lint`: Run ESLint
- `npm run init-scheduler`: Initialize data scraper scheduler
- `npm run scrape` or `curl http://localhost:3000/api/scrape`: Manually trigger data scraping

## Style Guidelines

### Project Structure
- Next.js App Router with `/app` directory for routes and layouts
- React components in `/components` directory (PascalCase filenames)
- Utility functions in `/lib` directory by domain (camelCase filenames)
- TypeScript types in `/types` directory or co-located with components

### Code Style
- TypeScript with strict mode enabled
- Use ES6+ features and async/await for asynchronous code
- Mark client components with 'use client' directive
- Server components for data fetching
- Use Tailwind CSS for styling
- Use absolute imports with `@/` alias
- Explicitly type function parameters, return values, and React props
- Use try/catch blocks for error handling in async functions
- Log errors with `console.error` before propagating

### Naming Conventions
- PascalCase for components and their files
- camelCase for variables, functions, and utility files
- ALL_CAPS for constants
- Descriptive variable names (avoid abbreviations)
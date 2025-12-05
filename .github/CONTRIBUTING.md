# Contributing to React Hook Granth

## Quick Start
1. Fork & clone the repo
2. `npm install`
3. Create a branch: `git checkout -b feat/your-hook`
4. Make changes & commit: `git commit -m "feat: add useYourHook"`
5. Push & create PR

## Adding a Hook
1. Create `src/hooks/useYourHook.ts`
2. Export from `src/index.ts`
3. Add tests in `src/__tests__/` (optional)
4. Update README.md

## Commit Format
Use conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation
- `test:` tests
- `chore:` maintenance

## Code Standards
- TypeScript with proper types
- Follow existing patterns
- Keep hooks simple and focused
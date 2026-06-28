# factufacil-landing — Claude Onboarding

## What this project is

Landing page for **FactuFacil** (factufacil.pe) — a Peruvian electronic invoicing SaaS. Built with Astro 4 + Tailwind CSS. Deployed automatically to AWS S3 + CloudFront on every push to `main`.

## Stack

| Layer | Tool |
|---|---|
| Framework | Astro 4 |
| Styles | Tailwind CSS 3 + PostCSS |
| Animations | Anime.js 4.4 (scroll-triggered) |
| Testing | Playwright (e2e) |
| CI/CD | GitHub Actions → AWS S3 + CloudFront via OIDC |

## Architecture

Hexagonal / Clean Architecture with DDD — unusual for a landing page, but intentional. This establishes patterns for the broader FactuFacil product.

```
src/
  features/
    facturacion/   ← domain: billing features section
    planes/        ← domain: pricing plans section
    testimonios/   ← domain: testimonials section
      adapters/secondary/   InMemory*Repository (data hardcoded here)
      application/use-cases/ GetAll* use cases
      domain/entities/       Entity classes
      domain/ports/          IRepository interfaces
  infrastructure/
    container/Container.ts   DI container — single singleton, wires everything
  shared/domain/
    Entity.ts      base class
    Result.ts      Result<T, E> monad (no throw/catch in use cases)
    ValueObject.ts base class
  layouts/
    BaseLayout.astro   HTML shell, loads Anime.js, applies initial hidden CSS
  pages/
    index.astro                home (/)
    facturacion-electronica.astro
    politica-privacidad.astro
    suscripcion.astro
  components/ui/
    Button.astro
    ChatWidget.astro           floating WhatsApp chat button with animation
```

**Key rule**: Astro pages import ONLY `container` from `Container.ts`. They call use cases, unwrap `Result`, and pass plain data to templates. Zero business logic in pages.

## Local dev

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # output → dist/
npm run preview    # serve dist/ locally
npm test           # Playwright e2e (requires built app or running dev server)
```

Environment variable needed for build:
```
PUBLIC_CHAT_API_URL=...   # chat widget backend URL
```
Copy `.env.example` → `.env` and fill it in.

## Adding a new domain section

1. Create `src/features/<domain>/domain/entities/<Entity>.ts` extending `Entity`
2. Create `src/features/<domain>/domain/ports/I<Entity>Repository.ts`
3. Create `src/features/<domain>/adapters/secondary/InMemory<Entity>Repository.ts`
4. Create `src/features/<domain>/application/use-cases/GetAll<Entities>.ts`
5. Wire it in `Container.ts` (add field + constructor instantiation)
6. Use in Astro page: `container.getAll<Entities>.execute()`

## CI/CD

Push to `main` → GitHub Actions:
1. `npm ci && npm run build`
2. Auth to AWS via OIDC (`AWS_DEPLOY_ROLE_ARN` secret — no long-lived keys)
3. Sync hashed assets (JS/CSS/images) with 1-year cache
4. Sync HTML/XML/TXT with no-cache headers
5. Invalidate CloudFront distribution

Secrets required in GitHub repo settings:
- `AWS_DEPLOY_ROLE_ARN`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `PUBLIC_CHAT_API_URL`

## Git remotes

```
origin → github.com/factufacil-pe/factufacil-landing  (primary)
```

Always push to `origin`. CodeCommit was removed (deprecated by AWS, 2026-06-27).

## Conventions

- **No business logic in pages** — use cases only
- **Result monad** — use cases return `Result<T, E>`, never throw. Unwrap in pages.
- **InMemory adapters** — all data is hardcoded in `adapters/secondary/`. Swap for real DB without touching use cases or ports.
- **Anime.js v4** — scroll animations use `anime.timeline()` with `autoplay: false` + IntersectionObserver. Initial hidden state goes in `BaseLayout.astro` global CSS.
- **Conventional commits** — no AI attribution in commits
- **No `cat`/`grep`/`find`** — use `bat`/`rg`/`fd` instead

## GitHub Project board

Board: [factufacil-landing project](https://github.com/users/miguel-anay/projects/6)

Columns: **Todo → In Progress → In Review → Done**

Use it to track features, bugs, and content updates for the landing page.

## Cambios completados

### #1 — mejora-responsive (feat/1-mejora-responsive) — 2026-05-27
- 8 fixes críticos de layout responsive: hero padding, tipografía h2, section spacing, about header, imágenes e-commerce/venta-equipo, pricing overflow, ChatWidget height
- Convenciones establecidas: `factufacil-h2-scale` y `factufacil-section-spacing` (Tailwind mobile-first)
- 15 tests e2e Playwright en 3 viewports (375px, 768px, 1280px)
- Fix canónica `/politica-privacidad` incluido en el mismo PR

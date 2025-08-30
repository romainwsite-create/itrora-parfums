import type { MiddlewareHandler } from 'astro';

// Map des anciens slugs → nouveaux
const LEGACY: Record<string, string> = {
  '/foireauxquestions': '/faq',
  '/foireauxquestions/': '/faq',
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const original = url.pathname;

  // 1) legacy → redirect
  const legacyHit = LEGACY[original] ?? LEGACY[original.toLowerCase()];
  if (legacyHit) {
    return context.redirect(legacyHit, 308);
  }

  // 2) normalise casse
  const lower = original.toLowerCase();
  if (original !== lower) {
    url.pathname = lower;
    return context.redirect(url.toString(), 308);
  }

  // 3) normalise trailing slash (enlève la barre finale sauf pour "/")
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
    return context.redirect(url.toString(), 308);
  }

  return next();
};

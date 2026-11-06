import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

const routes = [
  '/', '/commands', '/dashboard', '/partners', '/reviews',
  '/status', '/support', '/changelog', '/privacy', '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/status' ? 'hourly' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}

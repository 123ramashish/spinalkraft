import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: [] },
    sitemap: 'https://spinalkraft.in/sitemap.xml',
    host: 'https://spinalkraft.in',
  }
}

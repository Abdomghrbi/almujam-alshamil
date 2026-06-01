export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://almujam-alshamil.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/moderation', '/add']
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}

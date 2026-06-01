export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://almujam-alshamil.vercel.app';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://almujam-alshamil-api.onrender.com';
  const now = new Date();

  const urls = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  try {
    const seen = new Set();
    let page = 1;
    let totalPages = 1;

    do {
      const res = await fetch(`${apiBase}/api/search?limit=100&page=${page}`, {
        cache: 'no-store',
      });

      if (!res.ok) break;

      const data = await res.json();
      totalPages = Number(data.totalPages || 1);
      const words = Array.isArray(data.words) ? data.words : [];

      for (const word of words) {
        const slug = word.slug || word.word;
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);

        urls.push({
          url: `${siteUrl}/search/${encodeURIComponent(slug)}`,
          lastModified: word.created_at ? new Date(word.created_at) : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }

      page += 1;
    } while (page <= totalPages);
  } catch (error) {
    // Fallback to homepage-only sitemap if the API is unavailable.
  }

  return urls;
}

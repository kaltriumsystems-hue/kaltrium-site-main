export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`,          lastModified: new Date() },
    { url: `${base}/upload`,    lastModified: new Date() },
    { url: `${base}/pricing`,   lastModified: new Date() },
    { url: `${base}/contact`,   lastModified: new Date() },
    { url: `${base}/policy`,    lastModified: new Date() },
    { url: `${base}/updates`,   lastModified: new Date() },
  ];
}

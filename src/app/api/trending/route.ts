/**
 * BXH nhạc Việt Nam — lấy trực tiếp thời gian thực (LIVE realtime - không cache tĩnh).
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TrendingSong {
  rank: number;
  title: string;
  artist: string;
  artworkUrl: string | null;
  link: string | null;
  previewUrl: string | null;
}

const FEED_URL = 'https://itunes.apple.com/vn/rss/topsongs/limit=10/json';

export async function GET() {
  try {
    // Luôn gọi mới nhất với tham số thời gian để chống cache trình duyệt/proxy
    const res = await fetch(`${FEED_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) throw new Error(`Apple RSS trả về ${res.status}`);

    const data = await res.json();
    const entries: any[] = data?.feed?.entry ?? [];

    const songs: TrendingSong[] = entries.map((e, i) => {
      const images: any[] = e['im:image'] ?? [];
      const biggest = images[images.length - 1]?.label as string | undefined;
      const artworkUrl = biggest
        ? biggest.replace(/\/\d+x\d+bb\./, '/400x400bb.')
        : null;

      const links = Array.isArray(e.link) ? e.link : [e.link];
      const preview = links.find((l: any) => l?.attributes?.title === 'Preview');
      const pageLink = links.find((l: any) => l?.attributes?.rel === 'alternate');

      return {
        rank: i + 1,
        title: e['im:name']?.label ?? 'Không rõ',
        artist: e['im:artist']?.label ?? '',
        artworkUrl,
        link: pageLink?.attributes?.href ?? null,
        previewUrl: preview?.attributes?.href ?? null,
      };
    });

    return Response.json(
      { ok: true, songs, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (err: any) {
    return Response.json(
      { ok: false, error: { code: 'TRENDING_UNAVAILABLE', message: err?.message ?? 'unknown' } },
      { status: 503 }
    );
  }
}


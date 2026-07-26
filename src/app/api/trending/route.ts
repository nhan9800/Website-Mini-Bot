/**
 * BXH nhạc Việt Nam — lấy từ RSS công khai của iTunes (không cần API key).
 * Cache 1 giờ phía server để không gọi Apple liên tục.
 */

export const revalidate = 3600;

interface TrendingSong {
  rank: number;
  title: string;
  artist: string;
  artworkUrl: string | null;
  link: string | null;
}

const FEED_URL = 'https://itunes.apple.com/vn/rss/topsongs/limit=10/json';

export async function GET() {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Apple RSS trả về ${res.status}`);

    const data = await res.json();
    const entries: any[] = data?.feed?.entry ?? [];

    const songs: TrendingSong[] = entries.map((e, i) => {
      // Lấy artwork lớn nhất rồi nâng kích thước qua pattern URL của iTunes
      const images: any[] = e['im:image'] ?? [];
      const biggest = images[images.length - 1]?.label as string | undefined;
      const artworkUrl = biggest
        ? biggest.replace(/\/\d+x\d+bb\./, '/400x400bb.')
        : null;

      return {
        rank: i + 1,
        title: e['im:name']?.label ?? 'Không rõ',
        artist: e['im:artist']?.label ?? '',
        artworkUrl,
        link: e.link?.attributes?.href ?? null,
      };
    });

    return Response.json(
      { ok: true, songs, updatedAt: data?.feed?.updated?.label ?? null },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' } }
    );
  } catch (err: any) {
    return Response.json(
      { ok: false, error: { code: 'TRENDING_UNAVAILABLE', message: err?.message ?? 'unknown' } },
      { status: 503 }
    );
  }
}

import { useState, useEffect } from "react";

export interface Episode {
  id: number;
  title: string;
  description: string;
  runtime: string;
  thumbnailUrl: string;
}

export interface ContentItem {
  id: number;
  title: string;
  imageUrl: string;
  overview: string;
  maturity: string;
  isTop10: boolean;
  adult: boolean;
  episodes?: number;
  genres?: string[];
  hd?: boolean;
  episodesDetail?: Episode[];
}

interface UseContentItemsResult {
  items: ContentItem[];
  loading: boolean;
  error: Error | null;
}

export function useContentItems(
  count: number,
  category: "random" | "similar" | "continue" = "random"
): UseContentItemsResult {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const endpoint = `random/${count}`;
    const url = `https://jsonfakery.com/movies/${endpoint}`;

    const categoryGenresMap: Record<string, string[]> = {
      random: ["Drama", "Romantic"],
      similar: ["Fantasy", "Historical"],
      continue: ["Documentary", "True Story"],
    };

    const genrePool = [
      "Comedy",
      "Action",
      "Thriller",
      "Crime",
      "Adventure",
      "Sci-Fi",
      "Family",
      "Mystery",
      "Western",
    ];

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const rawArray = Array.isArray(data) ? data : [data];

        const mapped: ContentItem[] = rawArray.map((d: any) => {
          const baseGenres = categoryGenresMap[category] ?? [];
          const combinedGenres = [
            ...baseGenres,
            ...genrePool.sort(() => 0.5 - Math.random()),
          ]
            .filter((v, i, a) => a.indexOf(v) === i)
            .slice(0, 2);

          const epCount = d.episodes ?? Math.floor(Math.random() * 16) + 5;

          return {
            id: d.id,
            title: d.original_title,
            imageUrl: d.backdrop_path,
            overview: d.overview,
            maturity: d.adult ? "18+" : "15+",
            isTop10: Math.random() < 0.1,
            adult: d.adult ?? false,
            episodes: epCount,
            genres: d.genres ?? combinedGenres,
            hd: d.hd ?? Math.random() > 0.3,
            episodesDetail: Array.from({ length: epCount }, (_, i) => ({
              id: i + 1,
              title: `Episode ${i + 1}`,
              description: `This is the description for episode ${i + 1}.`,
              runtime: `${Math.floor(Math.random() * 10) + 50}min`,
              thumbnailUrl: d.backdrop_path || d.poster_path,
            })),
          };
        });

        setItems(mapped);
      })
      .catch((err) => {
        console.error("useContentItems fetch error:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [count, category]);

  return { items, loading, error };
}

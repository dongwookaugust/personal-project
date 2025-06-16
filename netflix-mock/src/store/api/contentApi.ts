import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContentItem } from "../../types";

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonfakery.com/" }),
  endpoints: (builder) => ({
    getContentItems: builder.query<
      ContentItem[],
      { count: number; category: string }
    >({
      query: ({ count, category }) =>
        `movies/random/${count}?category=${category}`,
      transformResponse: (response: any[]): ContentItem[] => {
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

        return response.map((d: any) => {
          const category = "random";
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
      },
    }),
  }),
});

export const { useGetContentItemsQuery } = contentApi;

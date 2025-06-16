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
export interface Notification {
  id: number | string;
  image: string;
  title: string;
  subtitle: string;
  time: string;
}

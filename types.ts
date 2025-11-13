
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  pages: number;
  emoji: string;
  imageKeywords?: string;
  coverImageUrl?: string;
}
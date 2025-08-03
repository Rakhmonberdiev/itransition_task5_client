export interface ReviewDto {
  author: string;
  text: string;
}
export interface BookDto {
  index: number;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  likes: number;
  reviews: ReviewDto[];
}

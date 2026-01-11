import {ReviewSummary} from "./ReviewSummary";

export interface Product {
  id: number,
  name: string,
  price: number,
  quantity: number,
  image: string,
  description: string,
  for_animal: string,
  utility: string,
  reviewSummary: ReviewSummary,
}

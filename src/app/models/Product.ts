import {ReviewSummary} from "./ReviewSummary";

export class Product {
  id: number = -1;
  name: string = "";
  price: number = -1;
  quantity: number = 0;
  image: string = "";
  description: string = "";
  for_animal: string = ""
  utility: string = ""
  reviewSummary: ReviewSummary = new ReviewSummary();
}

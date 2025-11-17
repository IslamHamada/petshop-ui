export interface SessionCart {
  cart_items: SessionCartItem[]
}

interface SessionCartItem {
  product_id: number;
  count: number;
}

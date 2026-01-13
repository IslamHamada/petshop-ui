export class SessionCart {
  cart_items: SessionCartItem[] = [];
}

class SessionCartItem {
  product_id: number = -1;
  count: number = 0;
}

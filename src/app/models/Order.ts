import {OrderItem} from './OrderItem';

export interface Order {
  time: string;
  price: number;
  elaborateOrderItems: OrderItem[];
}

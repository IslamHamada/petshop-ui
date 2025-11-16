import {OrderItem} from './OrderItem';

export interface Order {
  time: string;
  elaborateOrderItems: OrderItem[];
}

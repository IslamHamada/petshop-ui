import {OrderItem} from './OrderItem';

export interface Order {
  time: string;
  price: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  houseNumber: string;
  elaborateOrderItems: OrderItem[];
}

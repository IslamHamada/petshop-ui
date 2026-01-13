import {OrderItem} from './OrderItem';

export class Order {
  time: string = "";
  price: number = -1;
  firstName: string = "";
  lastName: string = "";
  phoneNumber: string = "";
  country: string = "";
  city: string = "";
  street: string = "";
  postalCode: string = "";
  houseNumber: string = "";
  elaborateOrderItems: OrderItem[] = [];
}

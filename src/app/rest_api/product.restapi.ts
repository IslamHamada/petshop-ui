import {inject, Injectable} from '@angular/core';
import {Product} from '../models/Product';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductRestAPI {
  http = inject(HttpClient);

  getAllProducts() {
    return this.http.get<Product[]>(`${environment.gateway_url}/product`);
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${environment.gateway_url}/product/${id}`);
  }
}

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class CartRestAPI {
  userService = inject(UserService)
  http = inject(HttpClient);

  addCartItem(product_id: number, count: number) {
    if(this.userService.loggedIn){
      this.http.post("http://localhost:9090/cart",{
        user_id: this.userService.user?.id,
        product_id: product_id,
        count: count
      });
      this.http.get<[]>("http://localhost:9090/cart", {params: {user_id : this.userService.user?.id ?? ''}}).subscribe(
        data => {
          this.userService.cartItems = data.length
        }
      )
    } else {
      console.log("local cart not yet implemented");
    }

  }
}

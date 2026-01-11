import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Review} from "../../models/Review";

@Injectable({
    providedIn: 'root'
})
export class ReviewRestAPI {
    http = inject(HttpClient);

    getReviewsByProductId(product_id : number) {
        return this.http.get<Review[]>(`${environment.gateway_url}/review/product/${product_id}`)
    }

    submitReview(review: Review) {
        return this.http.post<Review>(`${environment.gateway_url}/review`, review);
    }

    getReviewByProductIdAndUserId(product_id: number, userId: number) {
        return this.http.get<Review>(`${environment.gateway_url}/review/product/user/${product_id}/${userId}`);
    }
}
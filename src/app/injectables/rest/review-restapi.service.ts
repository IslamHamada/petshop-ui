import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Review} from "../../models/Review";
import {ReviewSummary} from "../../models/ReviewSummary";

@Injectable({
    providedIn: 'root'
})
export class ReviewRestAPI {
    http = inject(HttpClient);

    getReviewsByProductId(product_id : number) {
        return this.http.get<Review[]>(`${environment.gateway_url}/review/public/product/${product_id}`)
    }

    submitReview(review: Review) {
        return this.http.post<Review>(`${environment.gateway_url}/review/protected`, review);
    }

    getReviewByProductIdAndUserId(product_id: number, userId: number) {
        return this.http.get<Review>(`${environment.gateway_url}/review/protected/product/user/${product_id}/${userId}`);
    }

    getReviewsSummaryByProductId(product_id : number) {
        return this.http.get<ReviewSummary>(`${environment.gateway_url}/review/public/product/summary/${product_id}`);
    }
}
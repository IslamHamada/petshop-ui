import {Component, inject, input} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Review} from "../../models/Review";
import {ReviewRestAPI} from "../../injectables/rest/review-restapi.service";

@Component({
    selector: "review-dialog",
    templateUrl: "./review_dialog.html",
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        FormsModule,
        MatIconButton,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
    ],
    styleUrl: "./review_dialog.sass"
})
export class ReviewDialogComponent {
    private dialogRef = inject(MatDialogRef<ReviewDialogComponent>);
    review_text: string = "";
    rating: number = 0;
    stars = [1, 2 ,3, 4, 5];
    data = inject(MAT_DIALOG_DATA);
    reviewForm = new FormGroup({
        review_text: new FormControl(""),
    })

    chooseRating(rating : number) {
        this.rating = this.stars[rating];
    }

    reviewRestAPI = inject(ReviewRestAPI);

    submittingReview = false;
    snackBar = inject(MatSnackBar);
    protected submitReview() {
        this.submittingReview = true;
        let review : Review = {
            text: this.review_text,
            rating: this.rating,
            userId: this.data.user_id,
            productId: this.data.product_id,
            username: ""
        }
        this.userService.rxOnBackendId$(id => this.reviewRestAPI.submitReview(review))
            .subscribe(rev => {
                this.submittingReview = false;
                this.dialogRef.close(true);
                this.snackBar.open("Review submitted successfully!")._dismissAfter(2000);
            });
    }
}
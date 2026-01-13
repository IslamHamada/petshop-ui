import {Component, inject, input} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Review} from "../../models/Review";
import {ReviewRestAPI} from "../../injectables/rest/review-restapi.service";
import {UserService} from "../../user.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SubmittingDirective} from "../../directives/submitting";

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
        SubmittingDirective,
    ],
    styleUrl: "./review_dialog.sass"
})
export class ReviewDialogComponent {
    private dialogRef = inject(MatDialogRef<ReviewDialogComponent>);
    review_text: string = "";
    rating: number = 0;
    stars = [1, 2 ,3, 4, 5];
    data = inject(MAT_DIALOG_DATA);

    ngOnInit(): void {
        this.reviewRestAPI.getReviewByProductIdAndUserId(this.data.product_id, this.data.user_id)
            .subscribe(review => {
                if(review) {
                    this.review_text = review.text;
                    this.rating = review.rating;
                }
            });
    }
    reviewForm = new FormGroup({
        review_text: new FormControl(""),
    })

    chooseRating(rating : number) {
        this.rating = this.stars[rating];
    }

    reviewRestAPI = inject(ReviewRestAPI);
    userService = inject(UserService);
    submittingReview = false;
    snackBar = inject(MatSnackBar);
    protected submitReview() {
        this.submittingReview = true;
        let review : Review = new Review();
        review.text = this.review_text;
        review.rating = this.rating;
        review.userId = this.data.user_id;
        review.productId = this.data.product_id;

        this.userService.rxOnBackendId$(id => this.reviewRestAPI.submitReview(review))
            .subscribe(rev => {
                this.submittingReview = false;
                this.dialogRef.close(true);
                this.snackBar.open("Review submitted successfully!")._dismissAfter(2000);
            });
    }
}
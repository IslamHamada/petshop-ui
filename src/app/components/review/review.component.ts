import {Component, input} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'review',
    templateUrl: './review.html',
    styleUrl: './review.sass',
    imports: [
        MatCardModule,
        MatIcon,
    ]
})
export class ReviewComponent {
    text = input.required<string>();
    rating = input.required<number>();
    username = input.required<string>();
}
import {Component, input} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'reviews',
    templateUrl: './review.html',
    styleUrl: './review.sass',
    imports: [
        MatCardModule,
        MatIcon,
    ]
})
export class Reviews {
    text = input.required<string>();
    rating = input.required<number>();
    username = input.required<string>();
}
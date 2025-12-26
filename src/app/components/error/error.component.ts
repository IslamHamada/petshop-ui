import {Component, input} from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: 'error.html',
  styleUrl: 'error.sass',
})
export class ErrorComponent {
  error_code = input.required<string>();
  error_message = input.required<string>();
}

import {Directive, ElementRef, inject, input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[submitting]',
})
export class SubmittingDirective implements OnChanges {
  elementRef = inject(ElementRef<HTMLElement>);
  submitting = input.required<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
      const element = this.elementRef.nativeElement;
      if(this.submitting()){
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.6';
      } else {
        element.style.pointerEvents = '';
        element.style.opacity = '1';
      }
  }
}

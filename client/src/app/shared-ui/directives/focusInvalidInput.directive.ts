import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[focusInvalidInput]'
})
export class FormDirective {
  constructor(private el: ElementRef) { }

  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
    console.log("I am here for focus", invalidControl);
    if (invalidControl) {
      invalidControl.focus();
    }
  }
}

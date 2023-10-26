import { Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';

@Directive({
  selector: '[appExitEmail]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => ExitsEmaillDirective), multi: true }]

})
export class ExitsEmaillDirective implements Validator {

  constructor(private customValidator: GlobalService) { }

  validate(control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {
    return this.customValidator.userEmailValidator(control);
  }

}

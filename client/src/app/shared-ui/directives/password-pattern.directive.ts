import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { GlobalService } from '../services/global.service';

@Directive({
  selector: '[appPasswordPattern]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordPatternDirective, multi: true }]
})
export class PasswordPatternDirective implements Validator {

  constructor(private customValidator: GlobalService) { }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.customValidator.patternValidator()(control);
  }
}

import { NgModule } from '@angular/core';
import { SharedUiRoutingModule } from './shared-ui-routing.module';
import { OrderByPipe } from './filters-pipes/orderby.pipe';
import { RemoveWhitespaceDirective } from './directives/remove-whitespace.directive';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NumberOnlyDirective } from './directives/onlynumber.directive';
import { CharacterOnlyDirective } from './directives/onlycharacter.directive';
import { DisabledDirective } from './directives/disabled.directive';
import { AlertComponent } from './alert';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingComponent } from './loading/loading.component';
import { } from './loading/loading.component';
import { GrdFilterPipe } from './filters-pipes/grd-filter.pipe';
// import { PaypalLibraryComponent } from './payment-gataway/paypal-library/paypal-library.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { UiSwitchModule } from 'ngx-toggle-switch'; // We will add later
import { ToastrModule } from 'ngx-toastr';
import { FormDirective } from './directives/focusInvalidInput.directive';
import { NatualNumbersOnlyDirective } from './directives/naturalNum.directive';
import { CharNumOnlyDirective } from './directives/onlyCharNum.directive';
import { SpecialNumOnlyDirective } from './directives/onlyspecialNum.directive';
import { DateAgoPipe } from './filters-pipes/date-ago.pipe';
import { MatchPasswordDirective } from './directives/match-password.directive';
import { PasswordPatternDirective } from './directives/password-pattern.directive';
import { ExitsEmaillDirective } from './directives/exits-email.directive';


const SHARED_COMPONENTS: any = [
  NumberOnlyDirective,
  CharacterOnlyDirective,
  DisabledDirective,
  AlertComponent,
  LoadingComponent,
  GrdFilterPipe,
  MatchPasswordDirective,
  PasswordPatternDirective,
  ExitsEmaillDirective,
  OrderByPipe,
  // PaypalLibraryComponent,
  RemoveWhitespaceDirective,
  FormDirective,
  NatualNumbersOnlyDirective,
  SpecialNumOnlyDirective,
  DateAgoPipe,
  CharNumOnlyDirective,
];

const SHARED_MODULES: any = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  DataTablesModule,
  RouterModule,
  BsDropdownModule.forRoot(),
  ModalModule,
  DataTablesModule,
  // UiSwitchModule,
  BsDropdownModule.forRoot(),
];

@NgModule({
  declarations: [SHARED_COMPONENTS],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    NgxPayPalModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-bottom-right',
    }),
    SharedUiRoutingModule
  ],
  providers: [],
  // declarations: SHARED_COMPONENTS,
  exports: [SHARED_COMPONENTS, SHARED_MODULES],
  // entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedUiModule {
  static forRoot(): ModuleWithProviders<SharedUiModule> {
    return {
      ngModule: SharedUiModule,
      providers: [],
    };
  }
}

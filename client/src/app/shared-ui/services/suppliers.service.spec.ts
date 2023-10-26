import { TestBed } from '@angular/core/testing';

import { SuppliersService } from './suppliers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('SuppliersService', () => {
  let service: SuppliersService;

  beforeEach( async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, ToastrModule.forRoot()]
    });
    service = TestBed.inject(SuppliersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

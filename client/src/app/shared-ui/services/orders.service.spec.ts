import { TestBed } from '@angular/core/testing';

import { OrdersService } from './orders.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations:[],
      imports:[HttpClientTestingModule, ToastrModule.forRoot()]
    });
    service = TestBed.inject(OrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

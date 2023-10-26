import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagenotfoundComponent } from './pagenotfound.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalService, SharedUiModule, UsersService } from 'src/app/shared-ui';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

describe('PagenotfoundComponent', () => {
  let component: PagenotfoundComponent;
  let fixture: ComponentFixture<PagenotfoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagenotfoundComponent],
      imports:[
        HttpClientTestingModule,
        SharedUiModule,
        RouterModule,
        RouterTestingModule,
      ],
      providers:[]
    });
    fixture = TestBed.createComponent(PagenotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

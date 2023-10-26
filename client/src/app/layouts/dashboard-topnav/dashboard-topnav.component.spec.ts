import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopnavComponent } from './dashboard-topnav.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedUiModule } from 'src/app/shared-ui';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardTopnavComponent', () => {
  let component: DashboardTopnavComponent;
  let fixture: ComponentFixture<DashboardTopnavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardTopnavComponent],
      imports:[
        HttpClientTestingModule,
        SharedUiModule,
        RouterModule,
        RouterTestingModule,
      ]
    });
    fixture = TestBed.createComponent(DashboardTopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

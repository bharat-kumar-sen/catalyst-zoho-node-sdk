/* import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../services/global.service';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  subscription: Subscription = new Subscription();
  loadingLabel: string = "Loading... Please Wait.";
  constructor(
    private globalService: GlobalService
  ) {
    this.subscription = this.globalService.getLoadingLabel().subscribe(message => {
      if (message) {
        this.loadingLabel = message.text;
      }
    });
  }

  ngOnInit() {
  }
}
 */

import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { GlobalService } from '../services/global.service';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  timeLeft: number = 0; // and use same time in scss file line number 41 for circle progress bar
  interval: any;
  intervalTime: number = 500;

  subscription: Subscription = new Subscription();
  loadingLabel: string = 'Loading... Please Wait.';
  constructor(
    private globalService: GlobalService,
    private spinner: NgxSpinnerService
  ) {
    this.subscription = this.globalService
      .getLoadingLabel()
      .subscribe((message) => {
        if (message.text === 'stop') {
          this.pauseTimer();
        } else {
          this.startTimer(this.intervalTime);
        }
        if (message) {
          this.loadingLabel = message.text;
        }
      });
  }

  ngOnInit() {}

  startTimer(interValtime: any) {
    this.interval = setInterval(() => {
      if (this.timeLeft < 101) {
        this.timeLeft++;
      } else {
        setTimeout(() => {
          this.timeLeft = 0;
          this.spinner.hide();
          clearInterval(this.interval);
        }, 500);
      }
    }, interValtime);
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.startTimer(20);
  }
}

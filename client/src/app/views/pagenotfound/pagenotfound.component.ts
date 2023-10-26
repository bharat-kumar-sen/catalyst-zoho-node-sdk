import { Component } from '@angular/core';
import { GlobalService } from 'src/app/shared-ui';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent {

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void { }

}

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UsersService } from '../services/users.service';
@Injectable()
export class RouteResolver implements Resolve<any> {
   constructor(public usersListService: UsersService) { }
   resolve() {
      return this.usersListService.getUsersList()
   }
   
}
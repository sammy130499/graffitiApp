import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Router, CanActivate } from '@angular/router';
import { AlertService } from '../alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardLoginService implements CanActivate{

  constructor(  private userService : UserService,
                private router : Router,
                private alertService: AlertService) { }

  canActivate(){
    if(this.userService.isLoggedIn()){
      
      if(localStorage.getItem("isBackBtnPressed")=="true"){
        localStorage.setItem("isBackBtnPressed","false");
        this.alertService.warn("You cannot visit that page without logging out");
        return false;
      }
      let loggedInUsername = localStorage.getItem("loggedInUsername");
      this.router.navigate(['/dashboard/'+loggedInUsername]);
      this.alertService.info("Welcome !!");
      return false;
    }
    return true;
  }
}

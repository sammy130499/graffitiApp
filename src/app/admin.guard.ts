import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router:Router ){}
  canActivate(){

    if(!localStorage.getItem('access_token')){
      this.router.navigate(['/adminlogin']);
      return false;
    }
    return true;

  }
  
}

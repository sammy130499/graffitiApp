import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subscription, Subscribable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:8000/api/";
  constructor( private http : HttpClient, private router : Router ) { }



  loginUser(user:any):any{
    let url = this.baseUrl + "login";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    console.log(headers);
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }
  logoutUser(){
    let url = this.baseUrl + "logout";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.get(url);
  }
  createUser(user:any):any{
    let url = this.baseUrl + "createUser";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  updatePhoto(user:any):any{
    let url = this.baseUrl + "updatePhoto";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  checkUser(user:any):any{
    let url = this.baseUrl + "checkUser";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  getDataForDashboard(user:any):any{
    let url = this.baseUrl + "getDataForDashboard";
    
    return this.http.get(url);
  }

  getImageUrlForUser(user:any):any{
    let url = this.baseUrl + "getImageUrlForUser";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }
}

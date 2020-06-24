import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subscription, Subscribable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:8000/";
  constructor( private http : HttpClient, private router : Router ) { }


  createUser(user:any){
    let url = this.baseUrl + "createUser";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  updatePhoto(user:any){
    let url = this.baseUrl + "updatePhoto";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  checkUser(user:any){
    let url = this.baseUrl + "checkUser";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  getDataForDashboard(user:any){
    let url = this.baseUrl + "getDataForDashboard";
    
    return this.http.get(url);
  }
}

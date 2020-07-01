import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subscription, Subscribable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "/api/";
  constructor( private http : HttpClient, private router : Router,private alert:AlertService,private spinner:NgxSpinnerService ) { }



  loginUser(user:any):any{
    let url = this.baseUrl + "login";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  getWritingUsers(){
    let url = this.baseUrl + "getWritingUsers";
    return this.http.get(url);
  }
  
  getUsersAffectedAndRoom(user:any):any{
    let url = this.baseUrl + "getUsersAffectedAndRoom";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,user,{headers});
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

  updatePhotoBack(user:any):any{
    let url = this.baseUrl + "updatePhotoBack";
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

  getDataForDashboard(user):any{
    let url = this.baseUrl + "getDataForDashboard";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  getImageUrlForUser(face:any):any{
    let url = this.baseUrl + "getImageUrlForUser";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(face)),{headers});
  }

  getImageUrlForTshirtUser(user:any):any{
    let url = this.baseUrl + "getImageUrlForTshirtUser";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  getImageUrlForTshirtUserBack(user:any):any{
    let url = this.baseUrl + "getImageUrlForTshirtUserBack";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  deleteUser(user:any):any{
    let url=this.baseUrl+"deleteUser";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.delete(url,JSON.parse(JSON.stringify(user)));
  }

  updateUsername(user:any):any
  {
      let url=this.baseUrl+"updateUsername";
      let headers=new HttpHeaders();
      headers.set('Content-Type','application/json');
      return this.http.put(url,JSON.parse(JSON.stringify(user)),{headers});
  }

  isLoggedIn(){
    if(!localStorage.getItem("access_token"))
    {
      return false;
    }
    return true;
  }

  logout(){
    let url = this.baseUrl + "logout";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    this.spinner.show()
    this.http.get(url).subscribe((data:any)=>{
      this.spinner.hide();
      if(!data.action){
        this.alert.error(data.message);
      }
      else{
        localStorage.removeItem("access_token");
        localStorage.removeItem("loggedInUsername")
        localStorage.removeItem("tshirtUser")
        localStorage.removeItem("currentUser")
        this.router.navigate(['/homepage']);
      }
    })
  }
  
}

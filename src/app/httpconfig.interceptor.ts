import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${currentUser.token}`
        }
      });
    }

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
        if(err.status==404)
        {
          this.router.navigate(['/page404']);
          return;
        }
        if(err.status==502)
        {
          this.router.navigate(['/servererror']);
          return;
        }
        if(err.status==500)
        {
          this.router.navigate(['/servererror']);
          return;
        }
        if(err.status==0)
        {
          this.router.navigate(['/servererror']);
          return;
        }
      if (err instanceof HttpErrorResponse) {
        if (err.status !== 401) {
         return;
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("loggedInUsername");
        localStorage.removeItem("tshirtUser");
        this.router.navigate(['/homepage']);
      }
    }));
  }
}
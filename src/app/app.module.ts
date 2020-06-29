import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserService } from './user.service';
import { AlertComponent } from './alert/alert.component';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import {NgxPaginationModule, PaginationService} from 'ngx-pagination'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FrontComponent } from './front/front.component';
import { BackComponent } from './back/back.component';
import { ProfileComponent } from './profile/profile.component';
import { FrontProfileComponent } from './front-profile/front-profile.component';
import { BackProfileComponent } from './back-profile/back-profile.component';
import { AuthGuardLoginService } from './services/auth-guard-login.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AlertService } from './alert.service';
import { AuthInterceptor } from './httpconfig.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TeamComponent } from './team/team.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    DashboardComponent,
    EditPageComponent,
    SignUpComponent,
    AlertComponent,
    FrontComponent,
    BackComponent,
    ProfileComponent,
    FrontProfileComponent,
    BackProfileComponent,
    TeamComponent,
    PageNotFoundComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    HttpClientModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8000'],
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [UserService,AuthGuardLoginService,AuthGuardService,AlertService,NgxSpinnerService,PaginationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

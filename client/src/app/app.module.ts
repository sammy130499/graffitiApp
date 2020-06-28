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
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { AlertComponent } from './alert/alert.component';
import { NgxSpinnerModule } from "ngx-spinner";
import {NgxPaginationModule} from 'ngx-pagination'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FrontComponent } from './front/front.component';
import { BackComponent } from './back/back.component';


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
    BackComponent
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
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

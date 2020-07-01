import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  HomepageComponent
} from './homepage/homepage.component';
import {
  EditPageComponent
} from './edit-page/edit-page.component';
import {
  SignUpComponent
} from './sign-up/sign-up.component';
import {
  DashboardComponent
} from './dashboard/dashboard.component';
import {
  AuthGuardService
} from './services/auth-guard.service';
import {
  FrontComponent
} from './front/front.component';
import {
  BackComponent
} from './back/back.component';
import {
  AuthGuardLoginService
} from './services/auth-guard-login.service';
import {
  ProfileComponent
} from './profile/profile.component';
import { FrontProfileComponent } from './front-profile/front-profile.component';
import { BackProfileComponent } from './back-profile/back-profile.component';
import { TeamComponent } from './team/team.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';

const routes: Routes = [{
    path: "homepage",
    component: HomepageComponent,
    canActivate: [AuthGuardLoginService]
  },
  {
    path: "edit/:userId/:editId",
    component: EditPageComponent,
    children: [{
        path: 'front',
        component: FrontComponent
      },
      {
        path: 'back',
        component: BackComponent
      }
    ],
    canActivate: [AuthGuardService]
  },
  {
    path: "signup",
    component: SignUpComponent,
    canActivate: [AuthGuardLoginService]
  },
  {
    path: "dashboard/:userId",
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full'
  },
  {
    path: 'profile/:userId',
    component: ProfileComponent,
    children: [{
        path: 'front',
        component: FrontProfileComponent
      },
      {
        path: 'back',
        component: BackProfileComponent
      }
    ],
    canActivate: [AuthGuardService]
  },
  {path:'team',component:TeamComponent},
  {
    path:'page404',
    component:PageNotFoundComponent
  },
  {
    path:'servererror',
    component:ServerErrorComponent
  },
  {
    path:'**',
    redirectTo:'/page404'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {



}

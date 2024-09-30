import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { adminGuard, usersGuard } from './utils/userGuard/users.guard';
import { UpdateuserComponent } from './pages/user/updateuser/updateuser.component';
import { UserslistComponent } from './pages/admin/userlist/userslist.component';
import { AddhotelComponent } from './pages/hotel/addhotel/addhotel.component';
import { UpdatehotelComponent } from './pages/hotel/updatehotel/updatehotel.component';

export const routes: Routes = [
  //Landing page
  {
    path: '',
    component: LandingComponent,
  },

  //Auth pages

  //Register page
  {
    path: 'register',
    component: RegisterComponent,
  },
  //Login page
  {
    path: 'login',
    component: LoginComponent,
  },

  //User pages

  //Profile page
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [usersGuard],
  },
  //Update user page
  {
    path: 'update/:id',
    component: UpdateuserComponent,
    canActivate: [adminGuard],
  },

  //Admin pages

  //Users list page
  {
    path: 'users',
    component: UserslistComponent,
    canActivate: [adminGuard],
  },

  //Hotel pages

  //Add hotel page
  {
    path: 'addhotel',
    component: AddhotelComponent,
  },

  //Update hotel page
  {
    path: 'updatehotel/:id',
    component: UpdatehotelComponent,
  },



























  //Error page
  {
    path: '**',
    component: LoginComponent,
  },
  //Redirect to login page
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

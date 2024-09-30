import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { adminGuard, usersGuard } from './utils/userGuard/users.guard';
import { UpdateuserComponent } from './pages/user/updateuser/updateuser.component';

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
];

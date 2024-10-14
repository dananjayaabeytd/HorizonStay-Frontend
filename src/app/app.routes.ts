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
import { HotellistComponent } from './pages/admin/hotellist/hotellist.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ContractlistComponent } from './pages/admin/contractlist/contractlist.component';
import { ResultlistComponent } from './pages/search/resultlist/resultlist.component';
import { MakebookingComponent } from './pages/bookings/makebooking/makebooking.component';
import { ResultmoreComponent } from './pages/search/resultmore/resultmore.component';
import { BookingdetailsComponent } from './pages/bookings/bookingdetails/bookingdetails.component';
import { BookinglistComponent } from './pages/bookings/bookinglist/bookinglist.component';
import { BookingcompleteComponent } from './pages/bookings/bookingcomplete/bookingcomplete.component';
import { AddContractComponent } from './pages/contract/add-contract/add-contract.component';
import { UpdateContractComponent } from './pages/contract/update-contract/update-contract.component';
import { SeasonDetailsComponent } from './pages/contract/update-contract/season-details/season-details.component';

export const routes: Routes = [


  //Landing page
  {
    path: 'season-details/:id',
    component: SeasonDetailsComponent,
  },

  {
    path: 'contract-add/:id',
    component: AddContractComponent,
  },

  // {
  //   path: 'update-contract/:id',
  //   component: UpdateContractComponent,
  // },

  {
    path: 'hotel/:hotelID/update-contract/:contractId',
    component: UpdateContractComponent,
  },


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
  
  //Admin pages

  //Dashboard page
  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  //Users list page
  {
    path: 'users',
    component: UserslistComponent,
    canActivate: [adminGuard],
  },

  //Hotel list page
  {
    path: 'hotels',
    component: HotellistComponent,
  },

  //Contract list page
  {
    path: 'hotel/contracts/:id',
    component: ContractlistComponent,
  },

  //Contract pages

  //Search page
  {
    path: 'search',
    component: ResultlistComponent,
  },

  //Result details page
  {
    path: 'resultmore/:number',
    component: ResultmoreComponent,
  },



  //Booking pages

  //Make booking page
  {
    path: 'makebooking',
    component: MakebookingComponent,
  },

  //User bookings page
  {
    path: 'bookings/:id',
    component: BookinglistComponent,
  },

  //Booking details page
  {
    path: 'details/:id',
    component: BookingdetailsComponent,
  },

  //Booking success page
  {
    path: 'completebooking',
    component: BookingcompleteComponent,
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UsersService } from '../../services/user/users.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) {}

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  userImage: any;
  userName: any;
  userID: any;
  userEmail: any;

  ngOnInit(): void {
    const img = localStorage.getItem('profileImage');
    this.userName = localStorage.getItem('userName');

    this.isAuthenticated = this.userService.isAuthenticated();
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    this.userID = localStorage.getItem('userId');
    this.userEmail = localStorage.getItem('email');

    this.userImage = `http://localhost:5000/profileImages/${img}`;
  }

  logout(): void {
    this.userService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
  }

  viewUserBookings(userId: string) {
    this.router.navigate(['/bookings', userId]);
  }
}

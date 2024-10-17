import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/user/users.service';
import { AlertService } from '../../../services/alert/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userslist',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './userslist.component.html',
})
export class UserslistComponent implements OnInit {
  token: any = localStorage.getItem('token');
  users: any[] = [];
  errorMessage: string = '';
  loggedinUser: any;
  userName: string = '';
  user: any;
  searchTerm: string = '';

  constructor(
    private readonly userService: UsersService,
    private alertService: AlertService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.user = this.userService.getUser();
  }

  async loadUsers() {
    try {
      const token: any = localStorage.getItem('token');
      const response = await this.userService.getAllUsers(token);
      if (response && response.statusCode === 200 && response.systemUsersList) {
        this.users = response.systemUsersList;
      } else {
        this.showError('No users found.');
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  async deleteUser(userId: string) {
    const confirmDelete = await this.alertService.showConfirm(
      'Are you sure you want to delete this user?',
      'Do you want to proceed?',
      'Yes, proceed',
      'No, cancel'
    );
    if (!confirmDelete) {
      return;
    }

    if (confirmDelete) {
      try {
        const token: any = localStorage.getItem('token');
        await this.userService.deleteUser(userId, token);
        this.alertService.showSuccess('User deleted successfully.');
        this.loadUsers();
      } catch (error: any) {
        this.alertService.showError(error.message);
      }
    }
  }

  get filteredUsers() {
    return this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  navigateToUpdate(userId: string) {
    this.router.navigate(['/update', userId]);
  }

  viewUserBookings(userId: string) {
    this.router.navigate(['/bookings', userId]);
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}

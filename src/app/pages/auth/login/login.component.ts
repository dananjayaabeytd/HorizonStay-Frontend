import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/user/users.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(
    private readonly usersService: UsersService,
    private router: Router,
    private alertService: AlertService
  ) {}

  userId: any;
  role: any;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  async handleSubmit() {
    if (!this.email || !this.password) {
      this.alertService.showError('Email and Password are required');
      return;
    }

    try {
      const response = await this.usersService.login(this.email, this.password);
      console.log(response);

      if (response.statusCode == 200) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('role', response.role);
        localStorage.setItem('profileImage', response.image);
        localStorage.setItem('email', response.email);
        localStorage.setItem('address', response.address);
        localStorage.setItem('userName', response.name);

        this.router.navigate(['/profile']);
      } else {
        this.alertService.showError(response.error);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}

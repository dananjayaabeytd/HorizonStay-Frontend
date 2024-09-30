import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/user/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(
    private readonly usersService: UsersService,
    private router: Router
  ) {}

  userId: any;
  role: any;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  async handleSubmit() {

  }
}

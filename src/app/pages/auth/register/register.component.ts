import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/user/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  formData: any = {
    name: '',
    email: '',
    address: '',
    password: '',
    role: '',
    image: '',
    nic: ''
  };
  errorMessage: string = '';

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) { }

  async handleSubmit() {
  
  }
}

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
    nic: '',
  };
  errorMessage: string = '';
  selectedFile: File | null = null;
  previewImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImageUrl = reader.result;
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async handleSubmit() {
    if (
      !this.formData.name ||
      !this.formData.email ||
      !this.formData.password ||
      !this.formData.role ||
      !this.formData.address ||
      !this.formData.nic
    ) {
      this.showError('Please fill in all fields.');
      return;
    }

    const confirmRegistration = confirm(
      'Are you sure you want to register this user?'
    );
    if (!confirmRegistration) {
      return;
    }

    try {
      if (this.selectedFile) {
        const response = await this.userService.register(this.formData, this.selectedFile);

        const token = localStorage.getItem('token');
        if (!token) {
          this.router.navigate(['/login']);
          return;
        }

        console.log(response);
        alert(response.message);
        if (response.statusCode === 200) {
          this.router.navigate(['/users']);
        } else {
          this.showError(response.message);
        }
      } else {
        this.showError('Please select a file.');
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
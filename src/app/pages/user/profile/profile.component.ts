import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/user/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) {}

  profileInfo: any;
  errorMessage: string = '';
  imageUrl: string = '';

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No Token Found');
      }

      this.profileInfo = await this.userService.getYourProfile(token);
      if (this.profileInfo?.systemUsers?.image) {
        this.imageUrl = `http://localhost:5000/profileImages/${this.profileInfo.systemUsers.image}`;
        console.log('Image URL:', this.imageUrl); // Log the image URL
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  updateProfile(id: string) {
    this.router.navigate(['/update', id]);
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
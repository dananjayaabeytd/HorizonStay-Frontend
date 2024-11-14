import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/user/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-updateuser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './updateuser.component.html',
})
export class UpdateuserComponent {
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private alertService: AlertService,
    private readonly route: ActivatedRoute
  ) {}

  userId: any;
  userData: any = {};
  errorMessage: string = '';
  imageUrl: any;
  selectedFile: File | null = null;
  previewImageUrl: string | ArrayBuffer | null = null;
  isAdmin:boolean | undefined;

  ngOnInit(): void {
    this.getUserById();
    this.isAdmin = this.userService.isAdmin()
  }

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

  async getUserById() {
    this.userId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    if (!this.userId || !token) {
      this.showError('User ID or Token is Required');
      return;
    }

    try {
      let userDataResponse = await this.userService.getUsersById(
        this.userId,
        token
      );
      const { name, email, role, address, nic, image } =
        userDataResponse.systemUsers;
      this.userData = { name, email, role, address, nic, image };
      this.imageUrl = `http://localhost:5000/profileImages/${this.userData.image}`;
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  // async updateUser() {
  //   const confirmUpdate = await this.alertService.showConfirm(
  //     'Are you sure you want to Update User Details?',
  //     'Do you want to proceed?',
  //     'Yes, proceed',
  //     'No, cancel'
  //   );

  //   if (!confirmUpdate) {
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       throw new Error('Token not found');
  //     }

  //     if (!this.selectedFile) {
  //       throw new Error('No file selected');
  //     }

  //     const res = await this.userService.updateUser(
  //       this.userId,
  //       this.userData,
  //       this.selectedFile,
  //       token
  //     );
  //     console.log(res);

  //     if (res.statusCode === 200) {
  //       this.alertService.showSuccess('User Updated Successfully');
  //       this.router.navigate(['/users']);
  //     } else {
  //       this.alertService.showError('Error Occured When updating');
  //       this.showError(res.message);
  //     }
  //   } catch (error: any) {
  //     this.alertService.showError('Error Occured When updating 2');
  //     this.showError(error.message);
  //   }
  // }

  async updateUser() {
  const confirmUpdate = await this.alertService.showConfirm(
    'Are you sure you want to Update User Details?',
    'Do you want to proceed?',
    'Yes, proceed',
    'No, cancel'
  );

  if (!confirmUpdate) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    if (!this.areFieldsValid()) {
      throw new Error('All fields are required');
    }

    if (this.selectedFile) {
    const res = await this.userService.updateUser(
      this.userId,
      this.userData,
      this.selectedFile, // Allow selectedFile to be null
      token
    );
    console.log(res);

    if (res.statusCode === 200) {
      this.alertService.showSuccess('User Updated Successfully');
      this.router.navigate(['/users']);
    } else {
      this.alertService.showError('Error Occured When updating');
      this.showError(res.message);
    }
  }

  if (!this.selectedFile) {
    const res = await this.userService.updateUser2(
      this.userId,
      this.userData,
      token
    );

    console.log(res);

    if (res.statusCode === 200) {
      this.alertService.showSuccess('User Updated Successfully');
      this.router.navigate(['/users']);
    } else {
      this.alertService.showError('Error Occured When updating');
      this.showError(res.message);
    }
  }
  } catch (error: any) {
    console.error('Update User Error:', error);
    this.alertService.showError('Error Occured When updating 2');
    this.showError(error.message);
  }
}
  
  areFieldsValid(): boolean {
    return (
      this.userData.name &&
      this.userData.email &&
      this.userData.address &&
      this.userData.nic &&
      this.userData.role
    );
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}

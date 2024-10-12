import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/user/users.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-updateuser',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './updateuser.component.html',
})
export class UpdateuserComponent {
 

  constructor(private readonly userService:UsersService,
    private readonly router: Router,
    private readonly route:ActivatedRoute){}


    userId: any;
    userData: any = {}
    errorMessage:string = ''
    imageUrl:any;


  ngOnInit(): void {
    this.getUserById()

    
  }

  async getUserById(){
      this.userId = this.route.snapshot.paramMap.get('id')
      const token = localStorage.getItem('token')
      if(!this.userId || !token){
          this.showError("User ID or Token is Required")
          return;
      }

      try {
        let userDataResponse = await this.userService.getUsersById(this.userId, token)
        const {name, email,role ,address,nic,image} = userDataResponse.systemUsers
        this.userData = {name, email,role ,address,nic,image};
        this.imageUrl = `http://localhost:5000/profileImages/${this.userData.image}`;

        
      } catch (error:any) {
        this.showError(error.message);
      }
  }

  async updateUser(){

    const confirmm = confirm("Are you sure you wanna update this user")
    if(!confirm) return

    try{
      const token = localStorage.getItem('token')
      if(!token){
        throw new Error("Token not found")
      }
      
      const res = await this.userService.updateUser(this.userId, this.userData, token);
      console.log(res)

      if(res.statusCode === 200){
        this.router.navigate(['/users'])
      }else{
        this.showError(res.message)
      }

    }catch(error:any){
      this.showError(error.message)
    }

  }


  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }

}

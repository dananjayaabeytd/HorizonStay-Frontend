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


}

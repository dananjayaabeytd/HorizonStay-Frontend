import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/user/users.service';

@Component({
  selector: 'app-userslist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './userslist.component.html',
})
export class UserslistComponent implements OnInit {

  users: any[] = [];
  errorMessage: string = ''
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router
  ) {}

  
  ngOnInit(): void {
  }
}

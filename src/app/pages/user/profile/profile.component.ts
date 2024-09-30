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
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}

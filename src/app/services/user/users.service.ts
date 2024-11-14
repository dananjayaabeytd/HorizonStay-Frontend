import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private BASE_URL = 'http://localhost:5000';
  authStatusChanged: any;

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private user: any;

  // Load user details from local storage
  private loadUser() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const profileImage = localStorage.getItem('profileImage');
    const email = localStorage.getItem('email');
    const address = localStorage.getItem('address');
    const userName = localStorage.getItem('userName');

    if (userId) {
      this.user = {
        id: userId,
        role: role,
        profileImage: profileImage,
        email: email,
        address: address,
        name: userName,
      };
    }
  }

  // Getter methods to access user attributes
  getUser() {
    return this.user;
  }

  async login(email: string, password: string): Promise<any> {
    const url = `${this.BASE_URL}/auth/login`;

    try {
      const response = this.http
        .post<any>(url, { email, password })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: any, file: File): Promise<any> {
    const url = `${this.BASE_URL}/auth/register`;

    const formData: FormData = new FormData();
    formData.append(
      'user',
      new Blob([JSON.stringify(userData)], { type: 'application/json' })
    );
    formData.append('files', file);

    try {
      const response = await this.http.post<any>(url, formData).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: string, userData: any, file: File, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/update/${userId}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    const formData: FormData = new FormData();
    formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    formData.append('files', file);
  
    try {
      const response = await this.http
        .put<any>(url, formData, { headers })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/get-all-users`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getYourProfile(token: string): Promise<any> {
    const url = `${this.BASE_URL}/adminuser/get-profile`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    try {
      const response = this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getUsersById(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/get-users/${userId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    try {
      const response = this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/delete/${userId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    try {
      const response = this.http.delete<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  

  async updateUser2(userId: string, userData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/update/${userId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    try {
      const response = this.http
        .put<any>(url, userData, { headers })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Authentication Methods

  logOut(): void {
    if (typeof localStorage !== 'undefined') {
      // localStorage.removeItem('token');
      // localStorage.removeItem('role');
      this.user = null; // Clear user data in memory
      localStorage.clear(); // Clear local storage
    }
  }

  isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  isAdmin(): boolean {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      return role === 'ADMIN';
    }
    return false;
  }

  isUser(): boolean {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      return role === 'USER';
    }
    return false;
  }
}

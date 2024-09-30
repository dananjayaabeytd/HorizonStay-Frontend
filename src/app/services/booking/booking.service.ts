import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  getBookingByEmail(email: any, token: string) {
    throw new Error('Method not implemented.');
  }

  private BASE_URL = "http://localhost:5000";

  constructor(private http: HttpClient) { }

  private bookingData: any = {};

  setBookingData(data: any) {
    this.bookingData = { ...this.bookingData, ...data };
  }

  getBookingData() {
    return this.bookingData;
  }

  clearBookingData() {
    this.bookingData = {};
  }
  async calculateAmount(payload: any): Promise<any> {
    const url = `${this.BASE_URL}/booking/calculate-amount`;

    try {
      const response = await this.http.post<any>(url, payload).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async makeBooking(bookingData: any): Promise<any> {
    const url = `${this.BASE_URL}/booking/add`;

    try {
      const response = await this.http.post<any>(url, bookingData).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async viewBookingsByEmail(email: string): Promise<any> {
    const url = `${this.BASE_URL}/booking/${email}`;

    try {
      const response = await this.http.get<any>(url).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async adminUpdateBookingById(bookingId: number, bookingData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/booking/admin/update/${bookingId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.put<any>(url, bookingData, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async adminDeleteBookingById(bookingId: number, token: string): Promise<any> {
    const url = `${this.BASE_URL}/booking/admin/delete/${bookingId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.delete<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async adminGetBookingById(bookingId: number, token: string): Promise<any> {
    const url = `${this.BASE_URL}/booking/admin/get/${bookingId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
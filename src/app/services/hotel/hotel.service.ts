import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private BASE_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  async addHotel(hotelData: any, files: File[], token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/hotel/add`;

    const formData: FormData = new FormData();
    formData.append(
      'hotel',
      new Blob([JSON.stringify(hotelData)], { type: 'application/json' })
    );
    files.forEach((file, index) => {
      formData.append('files', file, file.name);
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http
        .post<any>(url, formData, { headers })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateHotel2(
    hotelId: string,
    hotelData: any,
    files: File[],
    token: string
  ): Promise<any> {
    const url = `${this.BASE_URL}/admin/hotel/update/v2/${hotelId}`;

    const formData: FormData = new FormData();
    formData.append(
      'hotel',
      new Blob([JSON.stringify(hotelData)], { type: 'application/json' })
    );
    files.forEach((file, index) => {
      formData.append('files', file, file.name);
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http
        .put<any>(url, formData, { headers })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllHotels(token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/hotel/get-all`;
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

  async getHotelById(hotelId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/hotel/get/${hotelId}`;
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

  async updateHotel(
    hotelId: string,
    hotelData: any,
    token: string
  ): Promise<any> {
    const url = `${this.BASE_URL}/admin/hotel/update/${hotelId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = this.http
        .put<any>(url, hotelData, { headers })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteHotel(hotelId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/hotel/delete/${hotelId}`;
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
}

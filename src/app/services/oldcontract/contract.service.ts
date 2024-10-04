import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private BASE_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  async addContract(
    hotelId: number,
    contractData: any,
    token: string
  ): Promise<any> {
    const url = `${this.BASE_URL}/admin/contract/${hotelId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http
        .post<any>(url, contractData, { headers })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getContractById(contractId: number, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/contract/${contractId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getContractByHotelId(hotelId: number, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/contract/hotel/${hotelId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateContract(
    contractId: number,
    contractData: any,
    token: string
  ): Promise<any> {
    const url = `${this.BASE_URL}/admin/contract/update/${contractId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http
        .put<any>(url, contractData, { headers })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteContract(contractId: number, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/contract/delete/${contractId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http
        .delete<any>(url, { headers })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async searchContracts(
    location: string,
    checkInDate: string,
    checkOutDate: string,
    adults: number,
    children: number
  ): Promise<any> {
    const url = `${this.BASE_URL}/search?location=${location}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`;

    try {
      const response = await this.http.get<any>(url).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
}

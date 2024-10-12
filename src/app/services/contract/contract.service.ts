import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  
  private BASE_URL = 'http://localhost:5000/api/contracts'; // Adjust as needed

  constructor(private http: HttpClient) {}

  // Common header structure to include JWT token
  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
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
      console.log('result List ->',response)
      return response;
    } catch (error) {
      throw error;
    }
  }

  // POST: Add a new contract
  addContract(hotelID: number, contractData: any, token: string): Observable<any> {
    const url = `${this.BASE_URL}/${hotelID}`;
    const headers = this.createHeaders(token);
    return this.http.post<any>(url, contractData, { headers });
  }

  // GET: Retrieve a contract by its ID
  getContractById(contractID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/${contractID}`;
    const headers = this.createHeaders(token);
    return this.http.get<any>(url, { headers });
  }

  // PUT: Update a contract by its ID
  updateContract(contractID: number, contractData: any, token: string): Observable<any> {
    const url = `${this.BASE_URL}/update/${contractID}`;
    const headers = this.createHeaders(token);
    return this.http.put<any>(url, contractData, { headers });
  }

  // DELETE: Delete a contract by its ID
  deleteContract(contractID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/delete/${contractID}`;
    const headers = this.createHeaders(token);
    return this.http.delete<any>(url, { headers });
  }

  // GET: Retrieve all contracts for a specific hotel by hotel ID
  getContractsByHotelId(hotelID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/hotel/${hotelID}`;
    const headers = this.createHeaders(token);
    return this.http.get<any>(url, { headers });
  }
}

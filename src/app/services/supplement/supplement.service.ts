import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplementService {
  private BASE_URL = 'http://localhost:5000';
  
  constructor(private http: HttpClient) {}

  // Add a new supplement to a season
  addSupplementToSeason(seasonID: number, supplementData: any, token: string): Observable<any> {
    const url = `${this.BASE_URL}/supplement/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(url, supplementData, { headers });
  }

  // Get supplement by ID
  getSupplementById(supplementID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/supplement/${supplementID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }

  // Update a supplement by ID
  updateSupplement(supplementID: number, supplementData: any, token: string): Observable<any> {
    const url = `${this.BASE_URL}/supplement/update/${supplementID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(url, supplementData, { headers });
  }

  // Delete a supplement by ID
  deleteSupplement(supplementID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/supplement/delete/${supplementID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(url, { headers });
  }

  // Get all supplements by season ID
  getSupplementsBySeasonId(seasonID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/supplement/season/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }
}

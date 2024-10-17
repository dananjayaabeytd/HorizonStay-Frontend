import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeasonService {
  private BASE_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // Add a new season to a contract
  addSeasonToContract(
    contractID: number,
    seasonData: any,
    token: string
  ): Observable<any> {
    const url = `${this.BASE_URL}/api/seasons/${contractID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(url, seasonData, { headers });
  }

  // Get season by ID
  getSeasonById(seasonID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/api/seasons/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }

  // Update a season by ID
  updateSeason(
    seasonID: number,
    seasonData: any,
    token: string
  ): Observable<any> {
    const url = `${this.BASE_URL}/api/seasons/update/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(url, seasonData, { headers });
  }

  // Delete a season by ID
  deleteSeason(seasonID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/api/seasons/delete/${seasonID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(url, { headers });
  }

  // Get all seasons by contract ID
  getSeasonsByContractId(contractID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/api/seasons/contract/${contractID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }
}

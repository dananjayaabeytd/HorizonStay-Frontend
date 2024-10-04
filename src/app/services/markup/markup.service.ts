import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkupService {
  private BASE_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // Add a new markup to a season
  addMarkupToSeason(seasonID: number, markupData: any, token: string): Observable<any> {
    const url = `${this.BASE_URL}/markup/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(url, markupData, { headers });
  }

  // Get markup by ID
  getMarkupById(markupID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/markup/${markupID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }

  // Update a markup by ID
  updateMarkup(markupID: number, markupData: any, token: string): Observable<any> {
    const url = `${this.BASE_URL}/markup/update/${markupID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(url, markupData, { headers });
  }

  // Delete a markup by ID
  deleteMarkup(markupID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/markup/delete/${markupID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(url, { headers });
  }

  // Get all markups by season ID
  getMarkupsBySeasonId(seasonID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/markup/season/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }
}

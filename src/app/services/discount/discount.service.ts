import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private BASE_URL = 'http://localhost:5000'; // Update this with your actual backend URL

  constructor(private http: HttpClient) {}

  // Add a new discount to a season
  addDiscountToSeason(
    seasonID: number,
    discountData: any,
    token: string
  ): Observable<any> {
    const url = `${this.BASE_URL}/discount/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(url, discountData, { headers });
  }

  // Get discount by ID
  getDiscountById(discountID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/discount/${discountID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }

  // Update a discount by ID
  updateDiscount(
    discountID: number,
    discountData: any,
    token: string
  ): Observable<any> {
    const url = `${this.BASE_URL}/discount/update/${discountID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(url, discountData, { headers });
  }

  // Delete a discount by ID
  deleteDiscount(discountID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/discount/delete/${discountID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(url, { headers });
  }

  // Get all discounts by season ID
  getDiscountsBySeasonId(seasonID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/discount/season/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }
}

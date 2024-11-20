import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomTypeService {
  private BASE_URL = 'http://localhost:5000'; // Update this with your actual backend URL

  constructor(private http: HttpClient) {}

  // Add a new room type to a season with images
  addRoomTypeToSeason(
    seasonID: number,
    roomTypeData: any,
    files: File[],
    token: string
  ): Observable<any> {
    const url = `${this.BASE_URL}/roomtype/${seasonID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData: FormData = new FormData();
    // Append room type details
    formData.append(
      'roomtype',
      new Blob([JSON.stringify(roomTypeData)], { type: 'application/json' })
    );

    // Append each file to the form data
    for (let file of files) {
      formData.append('files', file, file.name);
    }

    return this.http.post(url, formData, { headers });
  }

  updateRoomType(
    roomTypeID: number,
    roomTypeData: any,
    token: string
  ): Observable<any> {
    const url = `${this.BASE_URL}/roomtype/update/${roomTypeID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Log the room type data to ensure it's being sent correctly
    console.log('Room Type Data:', roomTypeData);

    return this.http.put(url, roomTypeData, { headers });
  }

  // Get room type by ID
  getRoomTypeById(roomTypeID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/roomtype/${roomTypeID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }

  // Delete a room type by ID
  deleteRoomType(roomTypeID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/roomtype/delete/${roomTypeID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(url, { headers });
  }

  // Get all room types by season ID
  getRoomTypesBySeasonId(seasonID: number, token: string): Observable<any> {
    const url = `${this.BASE_URL}/roomtype/season/${seasonID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }
}

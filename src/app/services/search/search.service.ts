import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private hotelsSource = new BehaviorSubject<any[]>([]);
  
  currentHotels = this.hotelsSource.asObservable();

  updateHotels(hotels: any[]) {
    this.hotelsSource.next(hotels);
  }

}
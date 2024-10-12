import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showSuccess(message: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      customClass: {
        popup: 'custom-toast'
      }
    });
  }

  showError(message: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      customClass: {
        popup: 'custom-toast'
      }
    });
  }
}

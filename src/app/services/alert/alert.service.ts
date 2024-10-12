import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  normalSuccess(message:string){
    Swal.fire({
      title: "Good job!",
      text: "You clicked the button!",
      icon: "success"
    });
  }

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

  async showConfirm(title: string, text: string, confirmButtonText: string, cancelButtonText: string): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      customClass: {
        popup: 'custom-confirm'
      }
    });
    return result.isConfirmed;
  }


}

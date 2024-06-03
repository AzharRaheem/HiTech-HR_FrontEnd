import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const token=localStorage.getItem('token');
  const router=inject(Router);
  if (token) {
    return true;
  }
  else {
    Swal.fire({
      title: 'Must login First!',
      icon: 'error',
      position: 'top',
      showConfirmButton: false,
      timer: 1600 
    });
   router.navigate(['/login']);
   return false;
  }

};

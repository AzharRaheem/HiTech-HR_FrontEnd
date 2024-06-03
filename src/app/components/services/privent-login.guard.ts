import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const priventLoginGuard: CanActivateFn = (route, state) => {
  const token=localStorage.getItem('token');
  const router=inject(Router);
  if(!token) 
    return true;
  else {
    Swal.fire({
      title: 'You are already logged in!',
      icon: 'error',
      position: 'top',
      showConfirmButton: false,
      timer: 1500 
    });

   router.navigate(['']);
    return false;
  }
};

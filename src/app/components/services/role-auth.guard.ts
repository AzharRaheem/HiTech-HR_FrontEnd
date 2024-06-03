import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';






export const roleAuthGuard: CanActivateFn = (route, state) => {
  const role=route.data['role'];

  const router=inject(Router);
  const rolesString = localStorage.getItem('roles');
  if(rolesString!=null){
  const rolesArray = JSON.parse(rolesString); 
  for(const roledata of role){
  for (const ele of rolesArray) {
    if (ele === roledata ) {
      return true; 
    }
  }}
  }

  Swal.fire({
    title: "Don't have permission",
    text: "You don't have permission to access this page.",
    icon: 'warning',
  
    timer: 1600,
    showConfirmButton: false,
    position: 'top',
    
  });
  

    return false;
  
};

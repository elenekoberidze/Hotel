import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { UserService } from '../../service/user.service';

export const AuthGuard: CanActivateFn = (route, state) => {
 
  const userService = inject(UserService);
  const router = inject(Router); 

 
  if (userService.isLoggedIn()) {
    return true;
  }

  
  router.navigate(['/login']); 
  return false; 
};
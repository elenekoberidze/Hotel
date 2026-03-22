import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.token && authService.isTokenExpired()) {
    return authService.refreshToken().pipe(
      switchMap((response) => {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${response.token}` }
        });
        return next(cloned);
      }),
      catchError((refreshError) => {
        authService.logout();
        return next(req);
      })
    );
  }

  if (authService.token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${authService.token}` }
    });
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};
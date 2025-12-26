import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import {catchError, EMPTY, throwError} from "rxjs";
import {inject} from '@angular/core';
import {Router} from '@angular/router';


export const RestErrorInterceptor: HttpInterceptorFn = (req, next) => {
  let router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      router.navigate(['/error'], {
        queryParams: {
          error_code: error.status,
          error_message: error.message
        }
      })
      return EMPTY;
    })
  );
};

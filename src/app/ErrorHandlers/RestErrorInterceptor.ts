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
    catchError((httpError: HttpErrorResponse) => {
      router.navigate(['/error'], {
        queryParams: {
          error_code: httpError.error.error_code,
          error_message: httpError.error.error_message
        }
      })
      return EMPTY;
    })
  );
};

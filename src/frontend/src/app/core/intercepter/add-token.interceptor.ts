import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  #refreshTokenSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public _authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this._authService.getAuthToken()) {
      request = this.addToken(request, this._authService.getAuthToken());
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.#refreshTokenSubject$.next(null);

      return this._authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.#refreshTokenSubject$.next(token.access);
          return next.handle(this.addToken(request, token.access));
        })
      );
    } else {
      return this.#refreshTokenSubject$.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_TOKEN = 'AUTH_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(
    private _http: HttpClient,
    private _storageService: StorageService
  ) {}

  getToken(): Observable<boolean> {
    return this._http.post<any>(`${environment.baseUrl}auth/token/`, {}).pipe(
      tap((tokens) => this.storeTokens(tokens)),
      map((res) => {
        return true;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  refreshToken() {
    return this._http
      .post<any>(`${environment.baseUrl}auth/refresh/`, {
        refresh: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
        }),
        catchError((error) => {
          return of(false);
        })
      );
  }

  getAuthToken() {
    return this._storageService.getToken(this.AUTH_TOKEN);
  }

  private getRefreshToken() {
    return this._storageService.getToken(this.REFRESH_TOKEN);
  }

  private storeTokens(tokens: any) {
    this._storageService.setToken(this.AUTH_TOKEN, tokens.access);
    this._storageService.setToken(this.REFRESH_TOKEN, tokens.refresh);
  }

  private removeTokens() {
    this._storageService.removeToken(this.AUTH_TOKEN);
    this._storageService.removeToken(this.REFRESH_TOKEN);
  }
}

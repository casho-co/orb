import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public isAuthenticated(): boolean {
    return !(
      window.localStorage['AUTH_TOKEN'] == undefined ||
      window.localStorage['AUTH_TOKEN'] == null
    );
  }

  setToken(type: string, token: string) {
    window.localStorage[type] = token;
  }

  getToken(type: string) {
    if (!this.isAuthenticated()) {
      return undefined;
    }
    const data = window.localStorage[type];
    return data;
  }

  removeToken(type: string) {
    window.localStorage.removeItem(type);
  }
}

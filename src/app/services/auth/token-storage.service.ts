import { Injectable } from '@angular/core';
import {LoginResponse, User} from 'src/app/classes/common/user';

export const TOKEN_KEY = 'auth-token';
const SERVER_PROTOCOL = 'http';
export const SERVER_HOST = '91.234.124.67:8081';
// export const SERVER_HOST = 'localhost:8081';
export const SERVER_URL = SERVER_PROTOCOL + '://' + SERVER_HOST + '/';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: LoginResponse): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): LoginResponse {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
  }

  public isManager(): boolean {
    return this.getUser().roles != null && this.getUser().roles.includes('MANAGER');
  }
}

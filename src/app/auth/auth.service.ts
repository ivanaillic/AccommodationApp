import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { tap, map } from "rxjs/operators";
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

export interface UserData {
  name?: string;
  surname?: string;
  email: string;
  password: string;
  age?: number;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isUserAuthenticated = new BehaviorSubject<boolean>(false);
  private _user = new BehaviorSubject<User | null>(null);


  constructor(private http: HttpClient) { }

  get isUserAuthenticated(): Observable<boolean> {
    return this._isUserAuthenticated.asObservable();
  }

  get user(): Observable<User | null> {
    return this._user.asObservable();
  }

  logIn(user: UserData) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    ).pipe(
      tap((userData) => {
        const expirationTime = new Date(
          new Date().getTime() + +userData.expiresIn * 1000
        );
        const newUser = new User(
          userData.localId,
          userData.email,
          userData.idToken,
          expirationTime
        );
        console.log('Dobijen je korisnički ID:', userData.localId);
        this._user.next(newUser);
        this._isUserAuthenticated.next(true);
      })
    );
  }

  register(user: UserData) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {
        email: user.email,
        password: user.password,
        returnSecureToken: true
      }
    );
  }

  logOut() {
    this._isUserAuthenticated.next(false);
    this._user.next(null);
  }

  getToken(): Observable<string | null> {
    return this.user.pipe(
      map(user => user ? user.token : null)
    );
  }

  getUserId(): Observable<string | null> {
    return this._user.pipe(
      map(user => {
        const userId = user ? user.id : null;
        console.log(`getUserId: ${userId}`);
        return userId;
      })
    );
  }



}

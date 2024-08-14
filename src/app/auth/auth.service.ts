import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { tap, map } from 'rxjs/operators';
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
  name: string;  // Polje nije opcionalno
  surname: string;  // Polje nije opcionalno
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
        this._user.next(newUser);
        this._isUserAuthenticated.next(true);

        // Sačuvaj dodatne podatke korisnika u Realtime Database
        this.saveUserData(userData.localId, userData.idToken, user);
      })
    );
  }

  private saveUserData(userId: string, idToken: string, userData: UserData) {
    this.http.put(
      `https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${idToken}`,
      {
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        age: userData.age,
        username: userData.username
      }
    ).subscribe(
      response => console.log("Podaci o korisniku su uspešno sačuvani", response),
      error => console.error("Neuspešno čuvanje podataka o korisniku", error)
    );
  }

  logOut() {
    this._isUserAuthenticated.next(false);
    this._user.next(null);
  }

  getUserId(): Observable<string | null> {
    return this._user.pipe(
      map(user => {
        const userId = user ? user.id : null;
        return userId;
      })
    );
  }
}

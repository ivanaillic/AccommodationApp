import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { map, switchMap, take } from 'rxjs/operators';

interface IUserService {
    getUserFullName(userId: string): Observable<string>;
}

@Injectable({
    providedIn: 'root'
})
export class UserService implements IUserService {

    private baseUrl: string = 'https://accommodation-app-a89f8-default-rtdb.europe-west1.firebasedatabase.app/users';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getUserFullName(userId: string): Observable<string> {
        return this.authService.user.pipe(
            take(1),
            switchMap(user => {
                if (!user || !user.token) {
                    throw new Error('No user or token found!');
                }
                const userUrl = `${this.baseUrl}/${userId}.json?auth=${user.token}`;
                return this.http.get<any>(userUrl).pipe(
                    map(userData => {
                        if (userData && userData.name && userData.surname) {
                            return `${userData.name} ${userData.surname}`;
                        } else {
                            return 'Nepoznat korisnik';
                        }
                    })
                );
            })
        );
    }
}

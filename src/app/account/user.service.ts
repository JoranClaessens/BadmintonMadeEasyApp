import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

@Injectable()
export class UserService {
    private userUrl = 'http://localhost:8080/api/users';
    currentUser: User;

    constructor(private _http: Http, private storage: Storage) { }

    getUser(): Promise<string[]> {
        return Promise.all([
            this.storage.get('userId'),
            this.storage.get('email')
        ]);
    }

    setUser(user: User) {
        if (user) {
            this.storage.set('userId', user.id.toString());
            this.storage.set('email', user.email);
        } else {
            this.storage.remove('userId');
            this.storage.remove('email');
        }
        this.currentUser = user;
    }

    getUserByEmail(email: string): Observable<User> {
        return this._http.get(this.userUrl + '/email/' + btoa(email))
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    createUser(user: User): Observable<User> {
        return this._http.post(this.userUrl + '/create', user)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }

    login(email: string, password: string): Observable<User> {
        return this._http.get(this.userUrl + '/login/' + btoa(email) + '/' + password)
            .map(res => {
                if (res['_body']) {
                    return res.json();
                } else {
                    return null;
                }
            });
    }
}

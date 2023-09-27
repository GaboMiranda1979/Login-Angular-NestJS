import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'

import { Observable } from 'rxjs';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  BASE_URL: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(user: User): Observable<User>{
    return this.http.post<User>(`${this.BASE_URL}/auth/login`, user);
  }
}

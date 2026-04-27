import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserDto} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private baseUrl = "http://localhost:8080";

  http = inject(HttpClient);

  getAllUsers(): Observable<UserDto[]>{
    return this.http.get<UserDto[]>(`${this.baseUrl}/users`);
  }
}

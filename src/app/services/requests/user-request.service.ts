import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserDto} from '../../interfaces/interfaces';
import {RequestService} from './abstract-request.service';

@Injectable({
  providedIn: 'root',
})
export class UserRequestService extends RequestService{

  getAllUsers(): Observable<UserDto[]>{
    return this.http.get<UserDto[]>(`${this.baseUrl}/users`);
  }

  createUser(user: UserDto): Observable<UserDto>{
    return this.http.post<UserDto>(`${this.baseUrl}/users`, user);
  }

  deleteUser(userID: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/users?id=${userID}`);
  }
}

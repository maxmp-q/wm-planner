import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RequestService} from './abstract-request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRequestService extends RequestService{

  login(password: string): Observable<boolean>{
    return this.http.post<boolean>(`${this.baseUrl}/auth/login`, password);
  }

}

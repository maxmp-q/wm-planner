import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RequestService} from './abstract-request.service';
import {AuthResponseDto, LoginDto} from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthRequestService extends RequestService{

  login(value: LoginDto): Observable<AuthResponseDto>{
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/auth/login`, value);
  }

}

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HeadingDto} from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export abstract class RequestService {
  protected baseUrl = "https://wm-planner-backend.onrender.com";
  http = inject(HttpClient);

  getHeading(): Observable<HeadingDto>{
    return this.http.get<HeadingDto>(`${this.baseUrl}/heading`);
  }
}

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export abstract class RequestService {
  protected baseUrl = "http://localhost:8080";
  http = inject(HttpClient);
}

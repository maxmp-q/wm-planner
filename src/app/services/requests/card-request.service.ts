import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CardDto} from '../../interfaces/interfaces';
import {RequestService} from './abstract-request.service';

@Injectable({
  providedIn: 'root',
})
export class CardRequestService extends RequestService{

  getAllCards(): Observable<CardDto[]>{
    return this.http.get<CardDto[]>(`${this.baseUrl}/cards`);
  }

  createCard(card: CardDto): Observable<CardDto>{
    return this.http.post<CardDto>(`${this.baseUrl}/cards`, card);
  }

  renameCard(card: CardDto): Observable<CardDto>{
    return this.http.patch<CardDto>(`${this.baseUrl}/cards?id=${card.id}`, card);
  }

  deleteCard(cardID: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/cards?id=${cardID}`);
  }
}

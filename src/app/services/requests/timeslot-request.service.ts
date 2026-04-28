import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CardDto, TimeSlotDto} from '../../interfaces/interfaces';
import {RequestService} from './abstract-request.service';

@Injectable({
  providedIn: 'root',
})
export class TimeslotRequestService extends RequestService{

  private getExtendedBaseUrl = (cardID: number)=>
    `${this.baseUrl}/cards/${cardID}/timeslot`

  createTimeslot(card: CardDto, timeslot: TimeSlotDto): Observable<TimeSlotDto>{
    return this.http.post<TimeSlotDto>(this.getExtendedBaseUrl(card.id), timeslot);
  }

  renameTimeslot(card: CardDto, timeslot: TimeSlotDto): Observable<TimeSlotDto>{
    return this.http.patch<TimeSlotDto>(`${this.getExtendedBaseUrl(card.id)}?timeID=${timeslot.id}`, timeslot);
  }

  deleteTimeslot(cardID: number, timeslotID: number): Observable<void>{
    return this.http.delete<void>(`${this.getExtendedBaseUrl(cardID)}?timeID=${timeslotID}`);
  }

  addUser(cardID: number, timeslotID: number, userID: number): Observable<TimeSlotDto>{
    return this.http.patch<TimeSlotDto>(`${this.getExtendedBaseUrl(cardID)}/addUser?timeID=${timeslotID}`, userID);
  }

  removeUser(cardID: number, timeslotID: number, userID: number): Observable<TimeSlotDto>{
    return this.http.patch<TimeSlotDto>(`${this.getExtendedBaseUrl(cardID)}/removeUser?timeID=${timeslotID}`, userID);
  }
}

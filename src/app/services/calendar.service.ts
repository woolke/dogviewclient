import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CalendarEvent} from "../classes/common/calendar-event";
import {CalendarEventsRequest} from "../classes/common/calendar-events-request";
import {SERVER_URL} from './auth/token-storage.service';
import {Country} from "../classes/common/country";


const API_URL = SERVER_URL + 'api/calendar/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  constructor(private httpClient: HttpClient) {
  }

  save(event: CalendarEvent): Observable<any> {
    return this.httpClient.post<CalendarEvent>(API_URL + "save", event);
  }

  getEvents(req: CalendarEventsRequest): Observable<any> {
    return this.httpClient.post<CalendarEventsRequest>(API_URL + "getEvents", req);
  }

  delete(req: CalendarEventsRequest): Observable<any> {
    return this.httpClient.post<CalendarEventsRequest>(API_URL + "delete", req);
  }

  resize(req: CalendarEventsRequest): Observable<any> {
    return this.httpClient.post<CalendarEventsRequest>(API_URL + "resize", req);
  }

  move(req: CalendarEventsRequest): Observable<any> {
    return this.httpClient.post<CalendarEventsRequest>(API_URL + "move", req);
  }
}

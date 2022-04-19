import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SERVER_URL} from "./auth/token-storage.service";
import { Observable } from 'rxjs';

const API_URL = SERVER_URL + 'api/map/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<any> {
    return this.httpClient.get<any>(API_URL + "findAll", httpOptions);
  }
}

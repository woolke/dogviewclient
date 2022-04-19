import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SERVER_URL} from "./auth/token-storage.service";
import {Observable} from 'rxjs';
import {PolicyOcrFragment} from "../classes/policy/policy-ocr-fragment";
import {PolicyEditElement} from "../classes/policy/policy-edit-element";

const API_URL = SERVER_URL + 'api/policy/';
const httpOptions = {
  headers: new HttpHeaders({responseType: 'blob'})
};

@Injectable({
  providedIn: 'root'
})
export class PdfcanvaService {

  constructor(private httpClient: HttpClient) {
  }

  preview(formData: FormData): Observable<PolicyEditElement> {
    return this.httpClient.post<PolicyEditElement>(API_URL + "createPreview", formData);
  }
  ocrRead(fragment: PolicyOcrFragment): Observable<PolicyOcrFragment> {
    return this.httpClient.post<PolicyOcrFragment>(API_URL + "ocrFragment", fragment);
  }
}

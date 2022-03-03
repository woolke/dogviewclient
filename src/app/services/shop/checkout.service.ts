import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SERVER_URL} from "../auth/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = SERVER_URL + 'api/checkout/purchase';

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: any): Observable<any> {
    return this.httpClient.post<any>(this.purchaseUrl, purchase);
  }

}

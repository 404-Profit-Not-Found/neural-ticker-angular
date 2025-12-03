import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private http: HttpClient) { }

  getCandles(symbol: string) {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/market/${symbol}/candles`);
  }

  getInsight(symbol: string) {
    return this.http.get<any>(`${environment.apiBaseUrl}/insights/${symbol}`);
  }
}

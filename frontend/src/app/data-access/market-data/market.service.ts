import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private http = inject(HttpClient);

  getCandles(symbol: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any[]>(`${environment.apiBaseUrl}/market/${symbol}/candles`);
  }

  getInsight(symbol: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any>(`${environment.apiBaseUrl}/insights/${symbol}`);
  }
}

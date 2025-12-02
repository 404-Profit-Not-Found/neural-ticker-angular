import { Component, ElementRef, OnInit, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarketService } from '../../data-access/market-data/market.service';
import { createChart, ColorType } from 'lightweight-charts';
import { TilesModule } from 'carbon-components-angular';
import { TagModule } from 'carbon-components-angular';

@Component({
  selector: 'app-ticker-page',
  standalone: true,
  imports: [CommonModule, TilesModule, TagModule],
  templateUrl: './ticker-page.component.html',
  styleUrls: ['./ticker-page.component.scss']
})
export class TickerPageComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  route = inject(ActivatedRoute);
  marketService = inject(MarketService);

  symbol = '';
  insight: any = null;
  currentPrice: number | null = null;
  changePercent: number | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.symbol = params.get('symbol') || 'NVDA';
      this.loadData();
    });
  }

  loadData() {
    this.marketService.getCandles(this.symbol).subscribe(candles => {
      this.initChart(candles);
      if (candles.length > 0) {
        const last = candles[candles.length - 1];
        const prev = candles.length > 1 ? candles[candles.length - 2] : last;
        this.currentPrice = parseFloat(last.close);
        this.changePercent = ((this.currentPrice - parseFloat(prev.close)) / parseFloat(prev.close)) * 100;
      }
    });

    this.marketService.getInsight(this.symbol).subscribe(insight => {
      this.insight = insight;
    });
  }

  initChart(data: any[]) {
    if (!this.chartContainer) return;

    this.chartContainer.nativeElement.innerHTML = ''; // Clear previous chart

    const chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#161616' },
        textColor: '#d1d1d1',
      },
      grid: {
        vertLines: { color: '#333' },
        horzLines: { color: '#333' },
      },
    });

    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const formattedData = data.map(d => ({
      time: d.time.split('T')[0],
      open: parseFloat(d.open),
      high: parseFloat(d.high),
      low: parseFloat(d.low),
      close: parseFloat(d.close),
    }));

    candlestickSeries.setData(formattedData);
    chart.timeScale().fitContent();
  }
}

# 2. Frontend Architecture: Angular & IBM Carbon Design System

## 2.1 The Case for Angular in Financial Dashboards
For a complex, data-dense financial application, Angular (v20+) is selected over React or Vue due to its opinionated structure, strict TypeScript enforcement, and robust dependency injection system. Financial applications require precision in data handling; Angular’s built-in RxJS integration allows for sophisticated stream processing, which is essential when managing multiple WebSocket feeds for real-time stock tickers. The framework's ability to handle complex state via NgRx ensures that the "Neural-Ticker" dashboard remains performant even when processing thousands of state changes per minute.

## 2.2 IBM Carbon Design System Integration
The visual language of Neural-Ticker.com will be strictly governed by the IBM Carbon Design System. Carbon is chosen for its utilitarian, professional aesthetic that conveys trust and precision—attributes critical in fintech. Unlike consumer-focused design systems (e.g., Material Design), Carbon is optimized for complex data visualization and enterprise workflows.

### 2.2.1 Component Strategy and Monorepo Structure
The frontend will be architected as an Nx Monorepo, ensuring a clean separation of concerns between presentation layers and business logic. This structure facilitates code sharing and parallel build processes.

- `libs/ui-carbon`: A dedicated library wrapping IBM Carbon components. While Carbon provides `@carbon/charts-angular` and `carbon-components-angular`, we will create abstraction layers to inject custom "financial" theming (e.g., Red/Green profitability indicators) that aligns with the Carbon g100 (Dark Mode) theme.
- `libs/feature-dashboard`: Contains the "Smart Components" that connect to the NgRx store. This includes the `WatchlistWidget`, `StockAnalyzer`, and the `NeuralScoreGauge`.
- `libs/data-access`: The core infrastructure layer handling WebSocket connections, REST API calls via HTTP Interceptors, and NgRx state management (Actions, Reducers, Effects).

### 2.2.2 The Charting Dilemma: Carbon vs. specialized Financial Charts
A critical gap identified in the Carbon Design System is the lack of a native, high-performance Candlestick/OHLC chart component suitable for technical analysis. While Carbon excels at statistical data visualization (Area, Line, Donut), traders require interactive financial charts with indicators (RSI, MACD) and drawing tools.

**Architectural Decision**: We will implement a Hybrid Visualization Strategy.
- **Macro-Level Visualization (Carbon Charts)**: For portfolio performance, "Neural Score" trends, and sentiment analysis over time, we will use the native `@carbon/charts-angular` library. This ensures these metrics feel deeply integrated into the dashboard's design language.
- **Micro-Level Technical Analysis (TradingView Lightweight Charts)**: For the main stock price view, we will wrap the TradingView Lightweight Charts library within an Angular component. To maintain visual consistency, this wrapper will dynamically inject Carbon design tokens (fonts, colors from `@carbon/type` and `@carbon/themes`) into the TradingView chart configuration. This "Chart Adapter" pattern ensures the user perceives a unified interface.

## 2.3 Real-Time Data Handling with RxJS and NgRx
Financial dashboards are prone to "data thrashing," where rapid updates cause excessive DOM repaints, freezing the UI. To mitigate this, the frontend will employ a Throttled Reactivity Model.

- **WebSocket Ingestion**: The `SocketService` receives raw tick data.
- **Buffer Strategy**: Using RxJS operators `bufferTime(200)` or `throttleTime(100)`, incoming ticks are batched.
- **State Update**: The NgRx store processes updates in chunks.
- **Change Detection**: Components utilize `ChangeDetectionStrategy.OnPush`. The `async` pipe is used exclusively in templates to handle subscriptions, ensuring Angular only checks for changes when a new immutable reference is emitted by the store.

## 2.4 Folder Structure (Clean Architecture / Feature-Based)
Since we are using Angular 18, we ditch NgModule in favor of Standalone Components. The structure separates presentation (Carbon UI) from business logic (Agents/Data).

```text
src/
├── app/
│   ├── core/                  # Singleton services (Auth, HttpInterceptors, error handling)
│   │   ├── auth/
│   │   ├── interceptors/      # Catches 401/403, injects JWT
│   │   └── services/          # Global services (ThemeService, NotificationService)
│   ├── data-access/           # API Clients & State Management
│   │   ├── store/             # NgRx: Actions, Reducers, Selectors
│   │   │   ├── market-data/   # Handles real-time ticker updates
│   │   │   └── agent-jobs/    # Handles status of scraping jobs
│   │   └── api/               # Generated API Clients (OpenAPI)
│   ├── design-system/         # Wrappers for IBM Carbon Components
│   │   ├── carbon-charts/     # Wrappers for @carbon/charts-angular
│   │   ├── trading-view/      # Custom Wrapper for Candlestick charts (Carbon lacks this)
│   │   └── layouts/           # Shell, Header, Sidebar (matches Image 1)
│   ├── features/              # Lazy-loaded feature routes
│   │   ├── dashboard/         # (Image 1) Portfolio Performance, Pie Charts
│   │   ├── stock-analyzer/    # (Image 2) Deep Dive, Candle Chart, AI Insights
│   │   ├── watchlist/         # (Image 3) Watchlist Table, Edit Actions
│   │   └── news-hub/          # (Image 4) Breaking News, Research Reports
│   └── shared/                # Pipes, Directives, utility functions
│       └── pipes/             # ToonParserFormatterPipe (formats JSON blobs)
```

### 2.5 "The Missing Component": Carbon-Styled Candlestick Chart
**Problem**: The IBM Carbon Design System (`@carbon/charts`) does not natively support financial Candlestick/OHLC charts suitable for Image 2.
**Solution**: We will wrap TradingView Lightweight Charts and inject Carbon Design tokens to make it look native.

```typescript
// src/app/design-system/trading-view/carbon-candle-chart.component.ts
import { Component, ElementRef, input, viewChild, effect } from '@angular/core';
import { createChart, ColorType } from 'lightweight-charts';

// Using Angular Signals for input
export class CarbonCandleChartComponent {
  chartContainer = viewChild.required<ElementRef>('container');
  data = input.required<OHLCData>(); 
  
  // Carbon g100 Theme Colors
  private theme = {
    backgroundColor: '#161616', // Carbon g100 bg
    textColor: '#f4f4f4',       // Carbon text-01
    gridColor: '#393939',       // Carbon ui-03
    upColor: '#42be65',         // Carbon support-02 (Green)
    downColor: '#fa4d56',       // Carbon support-01 (Red)
  };

  constructor() {
    effect(() => {
      this.renderChart(this.data());
    });
  }
  //... implementation details to apply theme to chart instance
}
```

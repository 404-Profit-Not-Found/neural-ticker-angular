# API & DTO Model

## Overview
This document defines the Backend API endpoints (NestJS Controllers) and the Data Transfer Objects (DTOs) used to bridge the Angular Frontend and NestJS Backend.
It ensures that the full functional scope (Dashboard, Stock Detail, Research, Portfolio) is covered.

---

## 1. REST API Endpoints

### 1.1 Auth & User Context
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/auth/me` | Get current user profile and credits. |
| `GET` | `/api/v1/auth/keys` | List user's BYOK API keys. |
| `POST` | `/api/v1/auth/keys` | Add a new API key. |

### 1.2 Portfolio (Dashboard - Image 1)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/portfolio/summary` | Get aggregated portfolio value, day change, and allocation charts. |
| `GET` | `/api/v1/portfolio/positions` | Get list of all open positions with real-time P&L. |

### 1.3 Market Data & Stock Detail (Image 2)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/market/ticker/:symbol` | Get basic ticker info (Price, Sector, Market Cap). |
| `GET` | `/api/v1/market/candles/:symbol` | Get OHLCV history (supports `?interval=1d&limit=100`). |
| `GET` | `/api/v1/market/events/:symbol` | Get upcoming events for a specific ticker. |

### 1.4 AI Insights (Image 2 & 3)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/ai/insight/:symbol` | Get the latest "Neural Rating", sentiment, and generated summaries. |
| `POST` | `/api/v1/ai/analyze` | Trigger a new on-demand analysis job (uses credits). |

### 1.5 News & Research (Image 4)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/news/latest` | Get global breaking news. |
| `GET` | `/api/v1/news/ticker/:symbol` | Get news specific to a company. |

---

## 2. DTO Specifications

### 2.1 Shared Types (Enums)
```typescript
export enum TimeInterval {
  ONE_MINUTE = '1m',
  FIVE_MINUTE = '5m',
  ONE_HOUR = '1h',
  ONE_DAY = '1d',
  ONE_WEEK = '1wk'
}

export enum AnalysisDepth {
  LITE = 'lite',       // Quick technical scan
  DEEP = 'deep',       // Full web crawl + PDF report
  INSIDER = 'insider'  // Community sentiment scan
}
```

### 2.2 User & Auth DTOs
**File:** `user-profile.dto.ts`
```typescript
export class UserProfileDto {
  id: string;
  email: string;
  tier: 'free' | 'pro' | 'contributor';
  credits: number;
}
```

**File:** `api-key.dto.ts`
```typescript
export class ApiKeyDto {
  id: string;
  provider: string; // 'openai', 'finnhub'
  masked_key: string; // 'sk-....1234'
  is_active: boolean;
}
```

### 2.3 Portfolio DTOs
**File:** `portfolio-summary.dto.ts`
```typescript
export class PortfolioSummaryDto {
  total_value: number;
  day_change_amount: number;
  day_change_percent: number;

  allocation: {
    label: string; // Sector or Asset Class
    value: number; // Percentage 0-100
  }[];
}
```

**File:** `position.dto.ts`
```typescript
export class PositionDto {
  id: string;
  symbol: string;
  company_name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  market_value: number; // quantity * current_price
  unrealized_pl: number; // market_value - (quantity * avg_price)
  unrealized_pl_percent: number;
}
```

### 2.4 Market Data DTOs
**File:** `ticker-info.dto.ts`
```typescript
export class TickerInfoDto {
  symbol: string;
  company_name: string;
  price: number;
  change_percent: number;
  market_cap: number;
  pe_ratio: number;
  sector: string;
  rating: string; // 'Buy', 'Hold', 'Sell'
}
```

**File:** `candle.dto.ts`
```typescript
export class CandleDto {
  time: string; // ISO8601
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
```

### 2.5 AI Insight DTOs
**File:** `stock-insight.dto.ts`
```typescript
export class StockInsightDto {
  symbol: string;

  // The Gauge Score (0-100)
  neural_rating: number;

  // Sentiment (-1.0 to 1.0 converted to 0-100 scale if needed)
  sentiment_score: number;

  // Structured Text
  analyst_outlook: string; // "Bullish due to..."
  technical_signal: string; // "RSI indicates overbought..."
  smart_summary: string; // Merged news summary

  // Metadata
  last_updated: string; // ISO8601
}
```

**File:** `trigger-analysis.dto.ts`
```typescript
export class TriggerAnalysisDto {
  ticker: string;
  depth: AnalysisDepth;
  use_personal_keys?: boolean;
}
```

### 2.6 News & Events DTOs
**File:** `news-article.dto.ts`
```typescript
export class NewsArticleDto {
  id: string;
  title: string;
  source: string;
  published_at: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary_fragment: string; // Short preview
}
```

**File:** `corporate-event.dto.ts`
```typescript
export class CorporateEventDto {
  id: string;
  type: 'earnings' | 'dividend' | 'split';
  date: string;
  title: string;
  impact_level: number; // 1-10
}
```

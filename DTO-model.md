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
| `GET` | `/api/v1/market/ticker/:symbol` | Get **Elite Ticker DTO** (Full details). |
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

### 2.1 Elite Ticker DTO (Primary Payload)

```typescript
// --- Core enums -------------------------------------------------------------

export enum AssetClass {
  EQUITY = 'EQUITY',
  ETF = 'ETF',
  FUND = 'FUND',
  ADR = 'ADR',
  REIT = 'REIT',
  FIXED_INCOME = 'FIXED_INCOME',
  DERIVATIVE = 'DERIVATIVE',
  CRYPTO = 'CRYPTO',
  OTHER = 'OTHER',
}

export enum SecurityType {
  COMMON_STOCK = 'COMMON_STOCK',
  PREFERRED_STOCK = 'PREFERRED_STOCK',
  ADR = 'ADR',
  ETF = 'ETF',
  CLOSED_END_FUND = 'CLOSED_END_FUND',
  MUTUAL_FUND = 'MUTUAL_FUND',
  REIT = 'REIT',
  DEPOSITARY_RECEIPT = 'DEPOSITARY_RECEIPT',
  OTHER = 'OTHER',
}

export enum DividendFrequency {
  NONE = 'NONE',
  ANNUAL = 'ANNUAL',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
  IRREGULAR = 'IRREGULAR',
}

export enum TradingStatus {
  ACTIVE = 'ACTIVE',
  HALTED = 'HALTED',
  SUSPENDED = 'SUSPENDED',
  DELISTED = 'DELISTED',
  PRE_IPO = 'PRE_IPO',
}

export enum AnalystConsensusRating {
  STRONG_BUY = 'STRONG_BUY',
  BUY = 'BUY',
  HOLD = 'HOLD',
  SELL = 'SELL',
  STRONG_SELL = 'STRONG_SELL',
}

// --- Sub DTOs ---------------------------------------------------------------

export class TickerIdentifiersDto {
  /** Native exchange symbol, e.g. "AAPL" */
  symbol!: string;

  /** Primary exchange name, e.g. "NASDAQ" */
  exchange!: string;

  /** MIC code, e.g. "XNAS" */
  exchangeMic!: string;

  /** Country ISO-2 / ISO-3 of primary listing, e.g. "US" */
  listingCountry!: string;

  /** Trading currency ISO-4217, e.g. "USD" */
  currency!: string;

  /** International Securities Identification Number */
  isin?: string;

  /** CUSIP identifier (US) */
  cusip?: string;

  /** SEDOL identifier (UK) */
  sedol?: string;

  /** FIGI / composite FIGI if available */
  figi?: string;
  compositeFigi?: string;
  shareClassFigi?: string;

  /** SEC CIK where applicable */
  cik?: string;

  /** Alt-tickers (vendor-specific) */
  tickerYahoo?: string;
  tickerGoogle?: string;
  tickerBloomberg?: string;
}

export class TickerMetadataDto {
  /** Full legal company name */
  companyName!: string;

  /** Short display name / marketing name */
  companyShortName?: string;

  /** One-liner company description */
  descriptionShort?: string;

  /** Longer business description / profile */
  descriptionLong?: string;

  /** Company website */
  websiteUrl?: string;

  /** HQ city / country */
  headquartersCity?: string;
  headquartersCountry?: string;

  /** Country of incorporation / domicile */
  countryOfIncorporation?: string;
  countryOfDomicile?: string;

  /** Year founded / IPO date */
  foundedYear?: number;
  ipoDate?: string; // ISO date

  /** Employee count (latest reported) */
  employees?: number;

  /** Timezone of primary venue, e.g. "America/New_York" */
  primaryTimezone?: string;
}

export class TickerClassificationDto {
  assetClass!: AssetClass;
  securityType!: SecurityType;

  /** Share class, e.g. "A", "B", "ORD", etc. */
  shareClass?: string;

  /** High-level sector & industry (GICS/ICB/NAICS abstraction) */
  sector?: string;
  industry?: string;

  /** GICS breakdown if available */
  gicsSector?: string;
  gicsIndustryGroup?: string;
  gicsIndustry?: string;
  gicsSubIndustry?: string;

  /** NAICS / SIC codes if known */
  naicsCode?: string;
  sicCode?: string;

  /** Style box indication, e.g. "LARGE_GROWTH", "SMALL_VALUE" */
  styleBox?: string;

  /** Membership in major indices, e.g. ["SP500", "NASDAQ100"] */
  indexMemberships?: string[];
}

export class TickerQuoteDto {
  /** Last traded price on primary venue (regular session) */
  last!: number;

  /** Size of last trade (shares) */
  lastSize?: number;

  /** Timestamp (ISO 8601) of last trade */
  lastTimestamp!: string;

  /** Official open, high, low for current / last session */
  open?: number;
  high?: number;
  low?: number;

  /** Previous official close and date */
  prevClose?: number;
  prevCloseDate?: string;

  /** Best bid/ask and sizes */
  bid?: number;
  bidSize?: number;
  ask?: number;
  askSize?: number;

  /** Volume and average volumes */
  volume?: number;
  averageVolume10d?: number;
  averageVolume30d?: number;
  averageVolume90d?: number;

  /** Intraday VWAP (if available) */
  vwap?: number;

  /** 52-week range + dates */
  high52Week?: number;
  high52WeekDate?: string;
  low52Week?: number;
  low52WeekDate?: string;

  /** Absolute and % price moves vs previous close */
  changeAbs?: number;
  changePct?: number;

  /** YTD absolute and % moves vs last calendar year close */
  changeYtdAbs?: number;
  changeYtdPct?: number;

  /** Premarket / postmarket indications */
  preMarketPrice?: number;
  preMarketChangeAbs?: number;
  preMarketChangePct?: number;
  preMarketTimestamp?: string;

  afterHoursPrice?: number;
  afterHoursChangeAbs?: number;
  afterHoursChangePct?: number;
  afterHoursTimestamp?: string;

  /** Is this a delayed quote and by how many minutes */
  isDelayed?: boolean;
  delayMinutes?: number;
}

export class TickerPerformanceDto {
  /** Total return % including dividends, where available */
  totalReturn1d?: number;
  totalReturn5d?: number;
  totalReturn1m?: number;
  totalReturn3m?: number;
  totalReturn6m?: number;
  totalReturnYtd?: number;
  totalReturn1y?: number;
  totalReturn3yAnnualized?: number;
  totalReturn5yAnnualized?: number;
  totalReturn10yAnnualized?: number;
  totalReturnSinceIpoAnnualized?: number;
}

export class TickerTradingStatsDto {
  /** Shares outstanding (basic + potentially diluted) */
  sharesOutstanding?: number;
  freeFloatShares?: number;

  /** Market caps in trading currency */
  freeFloatMarketCap?: number;
  fullMarketCap?: number;

  /** Liquidity metrics */
  averageDailyValueTraded30d?: number;
  averageDailyValueTraded90d?: number;

  /** Short interest metrics */
  shortInterestShares?: number;
  shortInterestPctFloat?: number;
  shortInterestDaysToCover?: number;
  shortInterestAsOfDate?: string;

  /** Market microstructure */
  lotSize?: number;
  tickSize?: number;

  tradingStatus?: TradingStatus;
  tradingStatusReason?: string;
}

export class TickerFundamentalsDto {
  /** Valuation multiples */
  peTrailing12m?: number;
  peForward12m?: number;
  pegRatio?: number;
  priceToSalesTtm?: number;
  priceToSalesForward?: number;
  priceToBook?: number;
  priceToCashFlowTtm?: number;
  priceToFreeCashFlowTtm?: number;
  evToEbitdaTtm?: number;
  evToEbitTtm?: number;
  evToSalesTtm?: number;

  /** Per-share fundamentals */
  epsBasicTtm?: number;
  epsDilutedTtm?: number;
  epsForward12m?: number;
  bookValuePerShare?: number;
  tangibleBookValuePerShare?: number;
  cashPerShare?: number;

  /** Core P&L */
  revenueTtm?: number;
  revenueMostRecentFiscalYear?: number;
  ebitdaTtm?: number;
  operatingIncomeTtm?: number;
  netIncomeTtm?: number;

  /** Margins (T12M) */
  grossMarginPctTtm?: number;
  operatingMarginPctTtm?: number;
  netMarginPctTtm?: number;

  /** Balance sheet */
  totalAssets?: number;
  totalLiabilities?: number;
  totalDebt?: number;
  cashAndEquivalents?: number;
  netDebt?: number;
  debtToEquity?: number;
  netDebtToEbitda?: number;
  currentRatio?: number;
  quickRatio?: number;

  /** Returns */
  returnOnEquityPctTtm?: number;
  returnOnAssetsPctTtm?: number;
  returnOnInvestedCapitalPctTtm?: number;

  /** Growth metrics (CAGR) */
  revenueCagr3yPct?: number;
  revenueCagr5yPct?: number;
  epsCagr3yPct?: number;
  epsCagr5yPct?: number;

  /** Fiscal calendar metadata */
  fiscalYearEndMonth?: number; // 1-12
  fiscalYearEndDay?: number;   // usually 31, 30, etc.
}

export class TickerDividendProfileDto {
  hasDividend!: boolean;

  /** Indicated annualized dividend per share */
  indicatedAnnualDividendPerShare?: number;

  /** Trailing 12M dividend per share */
  trailing12mDividendPerShare?: number;

  /** Yields */
  forwardDividendYieldPct?: number;
  trailing12mDividendYieldPct?: number;
  buybackYieldPctTtm?: number; // shareholder yield component

  /** Payout ratio vs earnings and cash flow */
  payoutRatioEarningsPctTtm?: number;
  payoutRatioFreeCashFlowPctTtm?: number;

  /** Schedule + history */
  dividendFrequency?: DividendFrequency;
  exDividendDate?: string;
  lastDividendAmount?: number;
  lastDividendCurrency?: string;
  lastDividendDeclaredDate?: string;
  lastDividendPaymentDate?: string;

  /** Dividend growth history */
  dividendGrowth3yCagrPct?: number;
  dividendGrowth5yCagrPct?: number;
  consecutiveYearsOfDividendGrowth?: number;
}

export class TickerEarningsProfileDto {
  /** Most recent reported quarter/fiscal end */
  mostRecentQuarterEndDate?: string;
  mostRecentReportDate?: string;

  /** Next scheduled earnings date + session (BMO/AMC) */
  nextEarningsDate?: string;
  nextEarningsSession?: 'BMO' | 'AMC' | 'DURING_SESSION' | 'UNKNOWN';

  /** Last quarter earnings surprise metrics */
  lastQuarterEpsActual?: number;
  lastQuarterEpsConsensus?: number;
  lastQuarterEpsSurprisePct?: number;

  lastQuarterRevenueActual?: number;
  lastQuarterRevenueConsensus?: number;
  lastQuarterRevenueSurprisePct?: number;

  /** Forward guidance (if company provides) */
  guidanceEpsLow?: number;
  guidanceEpsHigh?: number;
  guidanceRevenueLow?: number;
  guidanceRevenueHigh?: number;
  guidanceFiscalPeriod?: string; // e.g. "FY2026", "Q3 2025"
}

export class TickerCorporateActionsDto {
  /** Splits */
  lastSplitDate?: string;
  lastSplitRatio?: string; // e.g. "4:1"
  upcomingSplitDate?: string;
  upcomingSplitRatio?: string;

  /** M&A / spinoffs (high-level flags) */
  lastMnaAnnouncementDate?: string;
  lastSpinoffAnnouncementDate?: string;

  /** Delisting / corporate events flags */
  isSpac?: boolean;
  isPostSpacMergedEntity?: boolean;
}

export class TickerRiskMetricsDto {
  /** Systematic risk */
  beta1y?: number;
  beta3y?: number;
  beta5y?: number;

  /** Realized volatility (annualized) */
  volatility30dPct?: number;
  volatility90dPct?: number;
  volatility180dPct?: number;
  volatility1yPct?: number;

  /** Risk/return profile (total return series-based) */
  sharpeRatio1y?: number;
  sharpeRatio3y?: number;
  sharpeRatio5y?: number;

  /** Tail risk */
  maxDrawdown1yPct?: number;
  maxDrawdown3yPct?: number;
  valueAtRisk1d95Pct?: number;
  valueAtRisk10d95Pct?: number;
  expectedShortfall1d95Pct?: number;
}

export class TickerOwnershipDto {
  /** Ownership structure */
  insiderOwnershipPct?: number;
  institutionalOwnershipPct?: number;
  publicFloatPct?: number;

  /** Trend in institutional / insider positions */
  insiderOwnershipPctChange3m?: number;
  institutionalOwnershipPctChange3m?: number;

  /** Holder stats */
  numberOfInstitutionalHolders?: number;
  top10InstitutionalOwnershipPct?: number;

  /** Insider transaction flows (net, last 3/12 months) */
  netInsiderBuyingUsd3m?: number;
  netInsiderBuyingUsd12m?: number;
}

export class TickerRatingsDto {
  /** Street view */
  consensusRating?: AnalystConsensusRating;
  /** Typically 1.0 (strong buy) – 5.0 (strong sell) */
  consensusRatingScore?: number;
  analystCoverageCount?: number;

  /** Price targets */
  priceTargetMean?: number;
  priceTargetMedian?: number;
  priceTargetHigh?: number;
  priceTargetLow?: number;
  priceTargetHorizonMonths?: number;
  priceTargetLastUpdated?: string;

  /** Implied upside/downside vs last price */
  impliedUpsideFromLastPricePct?: number;

  /** Credit ratings where applicable */
  creditRatingSp?: string;
  creditRatingMoodys?: string;
  creditRatingFitch?: string;

  /** Internal / house view rating */
  internalRating?: string;
}

export class TickerEsgDto {
  provider?: string;

  esgScoreOverall?: number;
  esgScoreEnvironment?: number;
  esgScoreSocial?: number;
  esgScoreGovernance?: number;

  /** 1–5, 1 = lowest controversy, 5 = highest */
  controversyLevel?: number;

  /** CO2 intensity metric */
  carbonIntensityTonsCo2ePerMRevenue?: number;

  /** % revenue from fossil fuels, arms, etc. */
  fossilFuelExposurePctRevenue?: number;
  weaponsExposurePctRevenue?: number;
}

// --- Top-level DTO ----------------------------------------------------------

export class TickerInfoDto {
  /** Identifiers & tickers across venues/providers */
  identifiers!: TickerIdentifiersDto;

  /** Basic static company metadata */
  metadata!: TickerMetadataDto;

  /** Sector/industry classification and style */
  classification!: TickerClassificationDto;

  /** Live quote and intraday market data */
  quote!: TickerQuoteDto;

  /** Periodic performance returns */
  performance!: TickerPerformanceDto;

  /** Liquidity, float, short interest, trading status */
  tradingStats!: TickerTradingStatsDto;

  /** Valuation, balance sheet, profitability, growth */
  fundamentals!: TickerFundamentalsDto;

  /** Dividend, buyback and income profile */
  dividendProfile!: TickerDividendProfileDto;

  /** Earnings, surprises and guidance */
  earnings!: TickerEarningsProfileDto;

  /** Splits, IPO, SPAC, spinoffs, etc. */
  corporateActions!: TickerCorporateActionsDto;

  /** Risk, volatility, drawdowns, VaR */
  risk!: TickerRiskMetricsDto;

  /** Ownership structure and flows */
  ownership!: TickerOwnershipDto;

  /** Analyst & credit ratings, targets, house view */
  ratings!: TickerRatingsDto;

  /** ESG profile (optional – not all tickers have it) */
  esg?: TickerEsgDto;

  /** Last full refresh timestamp of this DTO (ISO 8601) */
  lastUpdatedAt!: string;
}
```

### 2.2 Shared Types (Enums)
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

### 2.3 User & Auth DTOs
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

### 2.4 Portfolio DTOs
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

### 2.5 Market Data DTOs (Candles)
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

### 2.6 AI Insight DTOs
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

### 2.7 News & Events DTOs
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

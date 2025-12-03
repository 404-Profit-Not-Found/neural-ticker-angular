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

export class TickerIdentifiersDto {
  symbol!: string;
  exchange!: string;
  exchangeMic!: string;
  listingCountry!: string;
  currency!: string;
  isin?: string;
  cusip?: string;
  sedol?: string;
  figi?: string;
  compositeFigi?: string;
  shareClassFigi?: string;
  cik?: string;
  tickerYahoo?: string;
  tickerGoogle?: string;
  tickerBloomberg?: string;
}

export class TickerMetadataDto {
  companyName!: string;
  companyShortName?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  websiteUrl?: string;
  headquartersCity?: string;
  headquartersCountry?: string;
  countryOfIncorporation?: string;
  countryOfDomicile?: string;
  foundedYear?: number;
  ipoDate?: string;
  employees?: number;
  primaryTimezone?: string;
}

export class TickerClassificationDto {
  assetClass!: AssetClass;
  securityType!: SecurityType;
  shareClass?: string;
  sector?: string;
  industry?: string;
  gicsSector?: string;
  gicsIndustryGroup?: string;
  gicsIndustry?: string;
  gicsSubIndustry?: string;
  naicsCode?: string;
  sicCode?: string;
  styleBox?: string;
  indexMemberships?: string[];
}

export class TickerQuoteDto {
  last!: number;
  lastSize?: number;
  lastTimestamp!: string;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  prevCloseDate?: string;
  bid?: number;
  bidSize?: number;
  ask?: number;
  askSize?: number;
  volume?: number;
  averageVolume10d?: number;
  averageVolume30d?: number;
  averageVolume90d?: number;
  vwap?: number;
  high52Week?: number;
  high52WeekDate?: string;
  low52Week?: number;
  low52WeekDate?: string;
  changeAbs?: number;
  changePct?: number;
  changeYtdAbs?: number;
  changeYtdPct?: number;
  preMarketPrice?: number;
  preMarketChangeAbs?: number;
  preMarketChangePct?: number;
  preMarketTimestamp?: string;
  afterHoursPrice?: number;
  afterHoursChangeAbs?: number;
  afterHoursChangePct?: number;
  afterHoursTimestamp?: string;
  isDelayed?: boolean;
  delayMinutes?: number;
}

export class TickerPerformanceDto {
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
  sharesOutstanding?: number;
  freeFloatShares?: number;
  freeFloatMarketCap?: number;
  fullMarketCap?: number;
  averageDailyValueTraded30d?: number;
  averageDailyValueTraded90d?: number;
  shortInterestShares?: number;
  shortInterestPctFloat?: number;
  shortInterestDaysToCover?: number;
  shortInterestAsOfDate?: string;
  lotSize?: number;
  tickSize?: number;
  tradingStatus?: TradingStatus;
  tradingStatusReason?: string;
}

export class TickerFundamentalsDto {
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
  epsBasicTtm?: number;
  epsDilutedTtm?: number;
  epsForward12m?: number;
  bookValuePerShare?: number;
  tangibleBookValuePerShare?: number;
  cashPerShare?: number;
  revenueTtm?: number;
  revenueMostRecentFiscalYear?: number;
  ebitdaTtm?: number;
  operatingIncomeTtm?: number;
  netIncomeTtm?: number;
  grossMarginPctTtm?: number;
  operatingMarginPctTtm?: number;
  netMarginPctTtm?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  totalDebt?: number;
  cashAndEquivalents?: number;
  netDebt?: number;
  debtToEquity?: number;
  netDebtToEbitda?: number;
  currentRatio?: number;
  quickRatio?: number;
  returnOnEquityPctTtm?: number;
  returnOnAssetsPctTtm?: number;
  returnOnInvestedCapitalPctTtm?: number;
  revenueCagr3yPct?: number;
  revenueCagr5yPct?: number;
  epsCagr3yPct?: number;
  epsCagr5yPct?: number;
  fiscalYearEndMonth?: number;
  fiscalYearEndDay?: number;
}

export class TickerDividendProfileDto {
  hasDividend!: boolean;
  indicatedAnnualDividendPerShare?: number;
  trailing12mDividendPerShare?: number;
  forwardDividendYieldPct?: number;
  trailing12mDividendYieldPct?: number;
  buybackYieldPctTtm?: number;
  payoutRatioEarningsPctTtm?: number;
  payoutRatioFreeCashFlowPctTtm?: number;
  dividendFrequency?: DividendFrequency;
  exDividendDate?: string;
  lastDividendAmount?: number;
  lastDividendCurrency?: string;
  lastDividendDeclaredDate?: string;
  lastDividendPaymentDate?: string;
  dividendGrowth3yCagrPct?: number;
  dividendGrowth5yCagrPct?: number;
  consecutiveYearsOfDividendGrowth?: number;
}

export class TickerEarningsProfileDto {
  mostRecentQuarterEndDate?: string;
  mostRecentReportDate?: string;
  nextEarningsDate?: string;
  nextEarningsSession?: 'BMO' | 'AMC' | 'DURING_SESSION' | 'UNKNOWN';
  lastQuarterEpsActual?: number;
  lastQuarterEpsConsensus?: number;
  lastQuarterEpsSurprisePct?: number;
  lastQuarterRevenueActual?: number;
  lastQuarterRevenueConsensus?: number;
  lastQuarterRevenueSurprisePct?: number;
  guidanceEpsLow?: number;
  guidanceEpsHigh?: number;
  guidanceRevenueLow?: number;
  guidanceRevenueHigh?: number;
  guidanceFiscalPeriod?: string;
}

export class TickerCorporateActionsDto {
  lastSplitDate?: string;
  lastSplitRatio?: string;
  upcomingSplitDate?: string;
  upcomingSplitRatio?: string;
  lastMnaAnnouncementDate?: string;
  lastSpinoffAnnouncementDate?: string;
  isSpac?: boolean;
  isPostSpacMergedEntity?: boolean;
}

export class TickerRiskMetricsDto {
  beta1y?: number;
  beta3y?: number;
  beta5y?: number;
  volatility30dPct?: number;
  volatility90dPct?: number;
  volatility180dPct?: number;
  volatility1yPct?: number;
  sharpeRatio1y?: number;
  sharpeRatio3y?: number;
  sharpeRatio5y?: number;
  maxDrawdown1yPct?: number;
  maxDrawdown3yPct?: number;
  valueAtRisk1d95Pct?: number;
  valueAtRisk10d95Pct?: number;
  expectedShortfall1d95Pct?: number;
}

export class TickerOwnershipDto {
  insiderOwnershipPct?: number;
  institutionalOwnershipPct?: number;
  publicFloatPct?: number;
  insiderOwnershipPctChange3m?: number;
  institutionalOwnershipPctChange3m?: number;
  numberOfInstitutionalHolders?: number;
  top10InstitutionalOwnershipPct?: number;
  netInsiderBuyingUsd3m?: number;
  netInsiderBuyingUsd12m?: number;
}

export class TickerRatingsDto {
  consensusRating?: AnalystConsensusRating;
  consensusRatingScore?: number;
  analystCoverageCount?: number;
  priceTargetMean?: number;
  priceTargetMedian?: number;
  priceTargetHigh?: number;
  priceTargetLow?: number;
  priceTargetHorizonMonths?: number;
  priceTargetLastUpdated?: string;
  impliedUpsideFromLastPricePct?: number;
  creditRatingSp?: string;
  creditRatingMoodys?: string;
  creditRatingFitch?: string;
  internalRating?: string;
}

export class TickerEsgDto {
  provider?: string;
  esgScoreOverall?: number;
  esgScoreEnvironment?: number;
  esgScoreSocial?: number;
  esgScoreGovernance?: number;
  controversyLevel?: number;
  carbonIntensityTonsCo2ePerMRevenue?: number;
  fossilFuelExposurePctRevenue?: number;
  weaponsExposurePctRevenue?: number;
}

export class TickerInfoDto {
  identifiers!: TickerIdentifiersDto;
  metadata!: TickerMetadataDto;
  classification!: TickerClassificationDto;
  quote!: TickerQuoteDto;
  performance!: TickerPerformanceDto;
  tradingStats!: TickerTradingStatsDto;
  fundamentals!: TickerFundamentalsDto;
  dividendProfile!: TickerDividendProfileDto;
  earnings!: TickerEarningsProfileDto;
  corporateActions!: TickerCorporateActionsDto;
  risk!: TickerRiskMetricsDto;
  ownership!: TickerOwnershipDto;
  ratings!: TickerRatingsDto;
  esg?: TickerEsgDto;
  lastUpdatedAt!: string;
}

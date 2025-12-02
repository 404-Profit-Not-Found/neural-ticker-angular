# 5. Data Architecture and DBML Schema

## 5.1 Hybrid Storage Model: PostgreSQL + TimescaleDB
The diverse data requirements—relational user data, high-velocity time-series market data, and vector embeddings—necessitate a consolidated but potent database strategy. PostgreSQL serves as the foundation, augmented by TimescaleDB for time-series performance and `pgvector` for AI operations.

**Why TimescaleDB?**
TimescaleDB allows us to treat time-series data as standard SQL tables ("Hypertables") while offering massive performance benefits (1000x faster queries for aggregations) and automatic partitioning. It supports Continuous Aggregates, which pre-calculate expensive queries (e.g., "Daily High/Low from minute ticks") in the background, essential for the dashboard's load times.

## 5.2 DBML Schema Design
The following schema defines the core structures for the User/Subscription system, the BYOK credential vault, and the Time-Series market data.

```dbml
Project NeuralTicker {
  database_type: 'PostgreSQL'
  Note: 'Hybrid Schema: Relational + Time-Series + Vector'
}

// --------------------------------------------------------
// USER & ACCESS LAYER
// --------------------------------------------------------
Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar [unique, not null]
  tier varchar [default: 'free', note: 'free, pro, contributor']
  credits int [default: 0]
  created_at timestamp
}

Table user_api_keys {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  provider varchar [note: 'openai, gemini, alphavantage, finnhub']
  encrypted_key text
  key_iv text
  is_active boolean
}

// --------------------------------------------------------
// MARKET DATA LAYER (Reflecting Image 1 & 3 Columns)
// --------------------------------------------------------
Table tickers {
  symbol varchar [pk]
  company_name varchar
  sector varchar
  industry varchar
  market_cap decimal
  pe_ratio decimal
  dividend_yield decimal
  beta decimal
  growth_rank int [note: 'From Image 1 table']
  rating varchar
}

// TimescaleDB Hypertable for Image 2 (Candlestick Data)
Table market_candles {
  time timestamp [pk]
  symbol varchar [pk, ref: > tickers.symbol]
  open decimal
  high decimal
  low decimal
  close decimal
  volume bigint
  
  Note: 'Partitioned by time. Used for Charting.'
}

// --------------------------------------------------------
// AI AGENT LAYER (Reflecting Image 2 & 4)
// --------------------------------------------------------
Table ai_insights {
  id uuid [pk]
  symbol varchar [ref: > tickers.symbol]
  agent_type varchar [note: 'system, community']
  
  // Scores from Image 3
  neural_rating int [note: '0-100 gauge in Image 3']
  sentiment_score decimal [note: '0-100']
  
  // Structured Analysis from Image 2 (Bullet points)
  analyst_sentiment text
  technical_signal text
  news_summary text
  
  // Deep Research
  full_report_url text
  vector_embedding vector(1536) [note: 'For semantic search in News Hub']
  
  created_at timestamp
}

// --------------------------------------------------------
// PORTFOLIO LAYER (Image 1)
// --------------------------------------------------------
Table portfolios {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  name varchar [default: 'My Portfolio']
}

Table portfolio_positions {
  id uuid [pk]
  portfolio_id uuid [ref: > portfolios.id]
  symbol varchar [ref: > tickers.symbol]
  quantity decimal
  avg_buy_price decimal
  opened_at timestamp
}

// --------------------------------------------------------
// NEWS & EVENTS (Image 4)
// --------------------------------------------------------
Table events {
  id uuid [pk]
  symbol varchar [ref: > tickers.symbol]
  event_type varchar
  event_date timestamp
  impact_score int [note: 'High/Low impact']
  title varchar
}
```

## 5.3 Data Retention and Aggregation Policies
To manage storage costs effectively on the MVP infrastructure:
- **Raw Tick Data**: Retained for only 24 hours. Used solely for constructing the real-time chart.
- **1-Minute Aggregates**: Retained for 30 days.
- **Daily/Weekly Aggregates**: Retained indefinitely.
- **Compression**: TimescaleDB's native columnar compression is enabled for all data chunks older than 48 hours. This typically achieves 90-95% storage reduction, allowing terabytes of historical data to fit on modest SSDs.

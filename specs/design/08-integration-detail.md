# 8. Integration Detail: API Constraints & Strategies

## 8.1 Alpha Vantage Integration
- **Constraint**: The free tier allows 5 requests/minute.
- **Use Case**: This API is best suited for Daily/Weekly Historical Data. It is too slow for real-time ticker updates.
- **Agent Logic**: The Ingest Agent treats Alpha Vantage as a "Background Filler." When a user adds a stock to their portfolio, the agent schedules a job to fetch the 20-year history. This job runs at a low priority, respecting the 5 req/min limit, ensuring the user's key isn't exhausted for other tasks.

## 8.2 Twelve Data Integration
- **Constraint**: The free tier allows 8 requests/minute and 800/day.
- **Use Case**: Intraday Updates.
- **Agent Logic**: This is the primary source for the "Live Chart." The agent polls this API every 60 seconds (conservative) to update the candle.
- **Optimization**: If User A and User B both track "TSLA", the system only uses User A's key for the first minute, then User B's key for the second minute (if permitted by ToS), or simply caches User A's result and serves it to User B to save User B's quota. Note: Strict adherence to API Terms of Service regarding data redistribution is critical here. The safest approach is 1-to-1 fetching with caching acting as a fallback for the same user.

## 8.3 Finnhub Integration
- **Constraint**: Global limits, restricted endpoints on free tier.
- **Use Case**: Sentinel/Profile Data. Finnhub provides excellent company profiles (CEO, Sector, HQ). This data rarely changes.
- **Agent Logic**: Fetched once per month per symbol. Cached aggressively in Redis with a TTL of 30 days.

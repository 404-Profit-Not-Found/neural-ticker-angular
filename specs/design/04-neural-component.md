# 4. The "Neural" Component: AI Analysis Pipeline

## 4.1 Data Sourcing and Ingestion
To provide the "twist" of AI-driven insights, the platform requires a dedicated pipeline for unstructured data. This moves beyond price ticks into the realm of qualitative analysis.

- **Sources**: StockTwits streams, Reddit (r/wallstreetbets, r/investing), RSS feeds from major financial news outlets.
- **Ingestion**: The Toon-Parser is configured with "Watch Jobs" that periodically scrape these sources for specific ticker symbols present in the users' combined watchlists.

## 4.2 Analysis Engine (RAG + Sentiment)
We will employ a Retrieval-Augmented Generation (RAG) architecture for the AI analysis.

- **Vector Store**: Unstructured text is chunked and embedded (using sentence-transformers) and stored in `pgvector` (an extension for PostgreSQL), keeping the stack unified.
- **LLM Integration**: A locally hosted Small Language Model (SLM) like Mistral-7B or a cost-effective API (like OpenAI gpt-4o-mini) is used to summarize the retrieved chunks.
- **Scoring Algorithm**: The "Neural Score" (0-100) is a composite metric derived from:
    - **Sentiment Velocity**: Rate of change in positive/negative mentions.
    - **Fundamental Health**: Parsed from Finnhub metrics (P/E, EPS).
    - **Technical Divergence**: Comparison of price trend vs. volume trend.

## 4.3 Microservices & Agent Logic (The "Twist")

### 4.3.1 System vs. Community Agents
We will decouple the "Data Entry" into a dedicated Golang microservice because Go handles concurrent I/O (scraping 50 pages at once) much better than Node.js.

**Microservice**: `neural-agent-core` (Golang)
**Logic Flow**:
1. **Receive Job**: gRPC request from NestJS Gateway.
2. **Resource Check**: Does the user have a gemini or openai key stored in Vault? If yes, decrypt in memory.
3. **Toon-Parser Integration**:
    - We utilize your `toon-parser` library here. Instead of sending raw HTML to the LLM (which wastes tokens), we pass the HTML through `toon-parser`.
    - `toon-parser` strips boilerplate, ads, and navbars, converting the DOM into a compact JSON representation.
    - **Benefit**: Reduces LLM input token cost by ~40-60%.
4. **LLM Analysis**: Send "Tooned" JSON to the LLM (GPT-4o/Gemini) with a prompt: "Analyze this structured content for insider sentiment and technical flags."
5. **Store**: Save result to `ai_insights` table.

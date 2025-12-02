# 7. Infrastructure and Cost Analysis (MVP)

## 7.1 Cloud Provider Strategy: The "Hybrid-Free" Model
To sustain a $5/month subscription model with a low break-even point, we must aggressively minimize OpEx. We will utilize a multi-cloud strategy that exploits the "Always Free" tiers of major providers for compute, while paying for high-performance storage where it matters.

- **Compute (Oracle Cloud)**: Oracle Cloud Infrastructure (OCI) offers the most generous free tier in the industry: 4 ARM Ampere A1 Compute instances with 24 GB of RAM total. This is sufficient to run the entire microservices cluster (Gateway, Agents, Vault) for free.
- **Database (Hetzner Cloud)**: Database I/O is the bottleneck. Free tier databases (e.g., Heroku, Render) are too slow. We will provision a Hetzner CPX31 or CX32 VPS in Germany. Hetzner offers high-performance NVMe storage and bandwidth at a fraction of AWS/GCP costs.
- **Object Storage (Backblaze B2)**: For database backups and storing parsed HTML artifacts, Backblaze B2 is chosen ($6/TB/month) over AWS S3 ($23/TB/month) due to its pricing and S3-compatible API.
- **CDN & DNS (Cloudflare)**: Cloudflare provides free DDoS protection, DNS, and edge caching for the Angular frontend assets.

## 7.2 Containerization and Orchestration
- **Docker Compose (MVP)**: For the initial launch, a single powerful Oracle ARM instance running Docker Compose is sufficient.
- **Future (Kubernetes/K3s)**: As the agent pool grows, we will migrate to K3s (Lightweight Kubernetes) to orchestrate the scraping agents across multiple cheap VPS nodes.

## 7.3 Detailed Monthly Cost Breakdown (MVP)

**Table 3: Operational Expenditure (OpEx) Estimation**

| Component              | Service Provider   | Specification / Plan              | Monthly Cost     | Rationale                                         |
| ---------------------- | ------------------ | --------------------------------- | ---------------- | ------------------------------------------------- |
| Compute Cluster        | Oracle Cloud (OCI) | 4 vCPU ARM, 24GB RAM              | $0.00            | "Always Free" allocation covers Gateway & Agents. |
| Database Server        | Hetzner Cloud      | CX32 (4 vCPU, 8GB RAM, 80GB NVMe) | €16.90 (~$18.50) | Dedicated resources for TimescaleDB & Redis.      |
| Parsing Workers        | Render.com         | Background Worker (Starter)       | $7.00            | Isolated environment for unstable Python scripts. |
| Storage (Backups)      | Backblaze B2       | ~50GB Snapshot Storage            | ~$0.30           | Extremely low cost for cold storage.              |
| Domain Name            | Cloudflare         | Annual Registration               | $1.00            | Amortized monthly cost.                           |
| Frontend Hosting       | Cloudflare Pages   | Free Tier                         | $0.00            | Unlimited bandwidth for static assets.            |
| **Total Monthly OpEx** |                    |                                   | **~$26.80**      |                                                   |

**Financial Viability:**
- **Break-Even Point**: With an operational cost of ~$27/month, the platform requires only 6 subscribers at $5/month to cover infrastructure costs.
- **Margin Analysis**: At 100 subscribers ($500/month revenue), the platform generates ~$470 in gross profit, providing ample runway for scaling hardware or funding marketing.

# 6. Security Architecture: The Vault

## 6.1 The "Bring Your Own Key" Risk Profile
Storing user API keys creates a "Honeypot" risk. If the database is compromised, the attacker gains access to thousands of valid API credentials. While these keys don't grant access to bank accounts, their theft would lead to service bans for the users and reputational ruin for the platform.

## 6.2 Encryption Strategy: Envelope Encryption
We implement an Envelope Encryption strategy similar to AWS KMS, but self-hosted to save costs.
- **Data Encryption Key (DEK)**: Each API key is encrypted with a unique DEK generated at the time of entry.
- **Key Encryption Key (KEK)**: The DEK is encrypted using a Master Key (KEK).
- **Storage**: The database stores Encrypted_API_Key and Encrypted_DEK. It never stores the Master Key.
- **Runtime**: The Master Key is injected into the Vault Service memory via secure environment variables at boot time (e.g., via Kubernetes Secrets or Docker Compose .env).
- **Isolation**: Only the Vault Service possesses the logic to decrypt. The Ingest Agent sends a request: "I need to use Key ID X for User Y." The Vault does not return the key; instead, the architecture can be designed where the Vault signs the request or the Agent is the only trusted service allowed to receive the ephemeral decrypted key in memory for the duration of the HTTP request.

## 6.3 Compliance and Best Practices
- **Key Rotation**: Users are prompted to rotate keys every 90 days.
- **Leak Detection**: The system scans public GitHub repositories (using tools like GitGuardian logic) to check if Neural-Ticker's source code ever accidentally includes hardcoded secrets.
- **Access Control**: Strict Role-Based Access Control (RBAC) ensures that frontend clients cannot query the `user_api_keys` table directly.

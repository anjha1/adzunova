# ADR 014: Envelope Encryption & Isolated Token Vault

## Status
Accepted

## Context
OAuth access tokens grant sensitive administrative insights and must never be exposed, stored in plaintext, or included in general account list queries.

## Decision
1. **Isolated Storage**: Tokens and credentials reside strictly in `social_credentials`, segregated from `social_accounts`.
2. **Envelope Encryption**: Tokens are encrypted using AES-256-GCM with a 96-bit random initialization vector (nonce) and authenticated tag.
3. **Key Versioning**: Every encrypted record stores its `key_id` (e.g. `'v1'`) to facilitate seamless, zero-downtime key rotation.
4. **Log Scrubbing**: Automated regex interceptors redact `access_token=`, `EA...`, and client secrets from server logs, traces, and exception payloads. Paging URLs are sanitized before storage.

## Consequences
- Token decryption is restricted to backend sync worker processes.
- Client bundles and standard API responses never receive credential attributes.

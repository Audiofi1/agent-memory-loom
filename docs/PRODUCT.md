# Product Overview

## The problem

AI agents act autonomously but forget. Their working memory lives in private,
mutable databases — so it vanishes between sessions, can be edited after the
fact, and can't be trusted by other agents or audited by humans.

## The product

**Narwhal** is a verifiable memory infrastructure layer for autonomous AI
agents. It gives any agent — a trading bot, a research assistant, a monitoring
system — a permanent, tamper-proof place to store what it knows, what it
decided, and why. Other agents can read that memory under clear access rules,
and humans can audit the full decision history at any time.

## Core concepts

| Concept | What it is |
| --- | --- |
| **Agent identity** | A wallet-owned, on-chain identity for one agent. |
| **Memory snapshot** | One decision record (`title`, `decision`, `reasoning`, optional sealed field) stored on Walrus and hashed. |
| **Memory pool** | A shareable bundle of an agent's memory with an explicit on-chain reader allowlist. |
| **Access log** | The audit trail of authorizations, revocations, queries, and verifications. |

## Use cases

### 1. Developer — cross-session memory for one agent
A trading bot records every entry/exit and the reasoning behind it. When it
restarts, its full decision history is intact and provable — useful for
debugging, backtesting, and post-mortems.

### 2. Team — coordinating multiple agents
A research agent publishes findings into a pool and authorizes a strategy
agent's address. The strategy agent reads those findings; every read is logged
on-chain. No shared secret, no trust assumption — just an allowlist and an
audit trail.

## What makes it credible

- **Provable** — content-addressed Walrus blobs + on-chain SHA-256 anchors.
- **Shareable** — on-chain reader allowlists per pool.
- **Accountable** — every read/authorization is an on-chain event.

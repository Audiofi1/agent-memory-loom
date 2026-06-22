# Narwhal — Deploy everything (Sui testnet + Walrus)

This is the one-shot guide to: install the Sui CLI, get testnet/devnet gas,
publish the Move contract, and set up Walrus. Copy/paste top to bottom.

> Networks in short:
> - **devnet** — wiped frequently, newest features. Good for throwaway tests.
> - **testnet** — stable, what hackathons (Sui Overflow / Walrus track) expect. **Use testnet.**
> - **mainnet** — real money. Not for the demo.

---

## 1. Install the Sui CLI

macOS / Linux (Homebrew):
```bash
brew install sui
sui --version
```

Or download a release binary from https://github.com/MystenLabs/sui/releases
(pick the `testnet` build for your OS) and put `sui` on your PATH.

---

## 2. Create a wallet + point it at testnet

```bash
# creates ~/.sui/sui_config and a new keypair on first run
sui client

# add + switch to the testnet RPC
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet

# show your active address (you'll fund THIS)
sui client active-address
```

Keep the recovery phrase it prints somewhere safe. This address is your
agents' on-chain identity.

---

## 3. Get testnet gas (free SUI)

**Option A — CLI faucet (easiest):**
```bash
sui client faucet
# specify an address explicitly if needed:
# sui client faucet --address <YOUR_ADDRESS>
```

**Option B — Web / Discord faucet:**
- Web: https://faucet.sui.io/  (select **Testnet**, paste your address)
- Discord: the Sui Discord `#testnet-faucet` channel → `!faucet <address>`

**Devnet gas** (only if you also test on devnet):
```bash
sui client switch --env devnet   # create it first if missing:
# sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443
sui client faucet
sui client switch --env testnet  # switch back for the real deploy
```

Confirm you have gas:
```bash
sui client gas
```

---

## 4. Publish the Move contract

The contract lives in `move/narwhal`.

```bash
cd move/narwhal
sui move build          # compiles; fixes any toolchain issues early
sui client publish --gas-budget 100000000
```

From the publish output, copy these two values:

- **`packageId`** — under `Published Objects` (a `0x…` address).
- The `Clock` object is the shared system clock at the fixed address
  **`0x6`** — you'll pass it into time-stamped calls. No need to copy it.

---

## 5. Wire the package id into the app

Open `src/lib/sui-config.ts` and set:

```ts
export const NARWHAL_PACKAGE_ID = "0x...";   // packageId from step 4
export const SUI_CLOCK_OBJECT_ID = "0x6";    // shared system clock
```

The dashboard builds its transactions against `NARWHAL_PACKAGE_ID`, so once
this is set the on-chain calls (`register_agent`, `create_memory_pool`,
`authorize_reader`, `anchor_snapshot`, `log_access`) go live.

---

## 6. Walrus setup (decentralized blob storage)

You do **not** need to run a node for the demo. Narwhal uses the public
Walrus **testnet** HTTP publisher + aggregator (already configured in
`src/lib/sui-config.ts`):

```
Publisher  (write blobs):  https://publisher.walrus-testnet.walrus.space
Aggregator (read blobs):   https://aggregator.walrus-testnet.walrus.space
```

Quick smoke test from your terminal:
```bash
# store a blob
echo "hello narwhal" | curl -X PUT \
  "https://publisher.walrus-testnet.walrus.space/v1/blobs?epochs=5" \
  --upload-file -

# the response JSON contains a blobId — read it back:
curl "https://aggregator.walrus-testnet.walrus.space/v1/blobs/<BLOB_ID>"
```

**Optional — Walrus CLI (only if you want to publish from your machine or host a Walrus Site):**
```bash
# install the walrus binary (see docs.wal.app), then:
walrus get-wal           # swap testnet SUI -> WAL (storage token)
walrus store ./file.json --epochs 5
walrus read <BLOB_ID>
```
- **WAL** is the token that pays for storage; `walrus get-wal` exchanges
  testnet SUI for testnet WAL. The public publisher above sponsors storage
  for you, so for the in-app demo you don't need WAL yourself.
- Docs: https://docs.wal.app/docs/getting-started

---

## 7. Verify on-chain (judging path)

After registering an agent and writing a snapshot in the dashboard:

```bash
# inspect your agent object
sui client object <AGENT_OBJECT_ID>

# anchoring emits a SnapshotAnchored event with blob_id + content_hash.
# View the tx on the explorer:
#   https://suiscan.xyz/testnet/tx/<TX_DIGEST>
#   https://suiexplorer.com/txblock/<TX_DIGEST>?network=testnet
```

The "Verify on Walrus" button in the snapshot detail screen re-fetches the
blob from the aggregator and re-hashes it, proving the on-chain
`content_hash` still matches — live, in front of the judges.

---

## TL;DR deploy in one block

```bash
# 1. wallet + testnet
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
sui client faucet
# 2. publish
cd move/narwhal && sui move build && sui client publish --gas-budget 100000000
# 3. paste packageId into src/lib/sui-config.ts (NARWHAL_PACKAGE_ID)
```

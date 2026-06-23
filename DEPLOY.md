# Deploying Narwhal to Sui Testnet — step by step

You don't need to know Sui internals. Copy-paste each block in order.
Total time: ~10 minutes. You only do this once.

The smart contract is already written for you at:
`move/narwhal/sources/narwhal.move`

---

## Step 1 — Install the Sui command line tool

**macOS** (needs [Homebrew](https://brew.sh)):
```bash
brew install sui
```

**Windows**: open **PowerShell** and run:
```powershell
winget install MystenLabs.Sui
```

**Linux / Ubuntu**:
```bash
curl -fLJO https://github.com/MystenLabs/sui/releases/latest/download/sui-ubuntu-x86_64.tgz
tar -xzf sui-ubuntu-x86_64.tgz && sudo mv sui /usr/local/bin/
```

Check it worked:
```bash
sui --version
```
You should see a version number. If "command not found", close and reopen the terminal.

---

## Step 2 — Point the CLI at testnet

```bash
sui client
```
The first time it asks some questions. Answer like this:
- `Connect to a Sui Full node server?` → press **Enter** (yes)
- Full node URL → type: `https://fullnode.testnet.sui.io:443`
- Environment alias → type: `testnet`
- Key scheme → type `0` (ed25519)

This creates a new wallet address for the CLI. Copy the address it prints
(starts with `0x...`). You'll fund it next.

If it didn't ask, force testnet:
```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

See your CLI address any time:
```bash
sui client active-address
```

---

## Step 3 — Get free testnet SUI into the CLI address

The CLI wallet (Step 2) is a NEW address — separate from your Slush wallet.
Fund THIS one so it can pay the publish gas:

```bash
sui client faucet
```

Wait ~30 seconds, then check the balance:
```bash
sui client gas
```
You need at least one gas coin listed. If empty, also try the web faucet at
https://faucet.sui.io (select **Testnet**, paste your `active-address`).

---

## Step 4 — Publish the contract

From the project root:
```bash
cd move/narwhal
sui client publish --gas-budget 100000000
```

When it succeeds, scroll the output to **Object Changes → Published Objects**
and copy the **PackageID** (a long `0x...` string).

Example line:
```
PackageID: 0x9f2c....abcd
```

---

## Step 5 — Wire the Package ID into the app

Open `src/lib/sui-config.ts` and paste your PackageID:
```ts
export const NARWHAL_PACKAGE_ID = "0x9f2c....abcd"; // <- your real id
```

Save. That's it — the dashboard can now register agents and anchor
snapshots on-chain.

---

## Optional — use your Slush wallet address instead of the CLI one

If you want the contract owned by the SAME address that holds your Slush
testnet SUI, import the Slush key into the CLI:

1. In Slush: Settings → Export Private Key (a string starting `suiprivkey...`)
2. ```bash
   sui keytool import "<suiprivkey...>" ed25519
   sui client switch --address <that address>
   ```
3. Re-run Step 4.

⚠️ Never paste a private key anywhere except your own terminal. Never send it
to me or anyone else.

---

## Troubleshooting
- **`No gas coins found`** → repeat Step 3 (faucet is rate-limited; wait a minute).
- **`Dependency resolution failed`** → run `sui client publish` again; testnet
  framework downloads can be flaky on first try.
- **Publish says insufficient gas** → raise the budget: `--gas-budget 200000000`.

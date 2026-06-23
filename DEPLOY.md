


1. Open the app and click **Connect Wallet** → choose **Slush**.
2. Make sure your Slush wallet is on **Testnet** and has some testnet SUI
   (get free coins at https://faucet.sui.io — paste your Slush address).
3. Go to the **dashboard**. At the top you'll see **"Deploy the on-chain
   contract"** → click **Deploy to testnet**.
4. Slush pops up asking you to approve the publish transaction. Approve it.
5. Done. The app reads the new package id from the result, saves it, and the
   banner turns green with a link to view it on Suiscan.

After that, every action is real on-chain:
- **Register agent** → creates an `AgentIdentity` object you own.
- **Create pool** → creates a `MemoryPool` object.
- **Authorize / revoke reader** → on-chain allowlist updates.
- **Write snapshot** → stored on Walrus, and (if the agent has a pool)
  anchored on-chain with its blob id + content hash.

The contract was compiled from `move/narwhal/sources/narwhal.move` and the
resulting bytecode lives in `src/lib/narwhal-bytecode.json`. If you ever change
the Move source, recompile and replace that file (see the CLI section below).

---

## Advanced — recompile the contract yourself (optional)

Only needed if you edit the Move source.

```bash
# install the Sui CLI (macOS)
brew install sui
# build + dump bytecode
cd move/narwhal
sui move build --dump-bytecode-as-base64
```

Copy the `modules` and `dependencies` arrays from the output into
`src/lib/narwhal-bytecode.json`, then redeploy with the one-click button.

To publish from the CLI instead:
```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
sui client faucet
cd move/narwhal && sui client publish --gas-budget 200000000
```
Copy the **PackageID** and paste it into `src/lib/sui-config.ts`
(`NARWHAL_PACKAGE_ID`). The in-app deploy and this both work; the app prefers
whatever was last deployed from the button.



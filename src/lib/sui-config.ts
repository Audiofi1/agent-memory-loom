import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import { createNetworkConfig } from "@mysten/dapp-kit";

// Narwhal runs on Sui + Walrus testnet.
// After you publish the Move contract (see DEPLOY.md), paste the package id
// below to enable on-chain agent registration & snapshot anchoring.
export const NARWHAL_PACKAGE_ID = ""; // e.g. "0xabc...": set after `sui client publish`
export const NARWHAL_MODULE = "narwhal";
// Sui's shared system clock — required by time-stamped entry functions.
export const SUI_CLOCK_OBJECT_ID = "0x6";

export const ACTIVE_NETWORK = "testnet" as const;

export const { networkConfig } = createNetworkConfig({
  testnet: { network: "testnet", url: getJsonRpcFullnodeUrl("testnet") },
  mainnet: { network: "mainnet", url: getJsonRpcFullnodeUrl("mainnet") },
});

// Public Walrus testnet HTTP endpoints (no key required) used for blob
// storage + retrieval. See https://docs.wal.app/docs/getting-started
export const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space";
export const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";

export const SUI_EXPLORER = "https://suiscan.xyz/testnet";

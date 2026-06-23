import { useCallback } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";

import { NARWHAL_MODULE, SUI_CLOCK_OBJECT_ID } from "./sui-config";
import { getPackageId, setPackageId, findPublishedPackageId, findCreatedObjectId } from "./chain";
import bytecode from "./narwhal-bytecode.json";

/**
 * React hook exposing real on-chain Narwhal actions, all signed and paid for by
 * the user's connected Sui wallet (Slush). No private keys ever touch the app.
 */
export function useNarwhal() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  /** Wait for finality and return the parsed object changes for a digest. */
  const resolve = useCallback(
    async (digest: string) => {
      const res = await client.waitForTransaction({
        digest,
        options: { showObjectChanges: true, showEffects: true },
      });
      return res;
    },
    [client],
  );

  /** Publish the compiled Narwhal package. Returns the new package id. */
  const publish = useCallback(async (): Promise<string> => {
    if (!account) throw new Error("Connect your wallet first");
    const tx = new Transaction();
    const [upgradeCap] = tx.publish({
      modules: (bytecode as any).modules,
      dependencies: (bytecode as any).dependencies,
    });
    tx.transferObjects([upgradeCap], account.address);
    tx.setGasBudget(200_000_000);

    const { digest } = await signAndExecute({ transaction: tx });
    const res = await resolve(digest);
    const pkg = findPublishedPackageId(res.objectChanges as any[]);
    if (!pkg) throw new Error("Could not read package id from publish result");
    setPackageId(pkg);
    return pkg;
  }, [account, signAndExecute, resolve]);

  /** register_agent — creates an AgentIdentity owned by the wallet. Returns its object id. */
  const registerAgent = useCallback(
    async (name: string, kind: string): Promise<{ objectId: string; digest: string }> => {
      const pkg = getPackageId();
      if (!pkg) throw new Error("Contract not deployed yet");
      const tx = new Transaction();
      tx.moveCall({
        target: `${pkg}::${NARWHAL_MODULE}::register_agent`,
        arguments: [tx.pure.string(name), tx.pure.string(kind), tx.object(SUI_CLOCK_OBJECT_ID)],
      });
      const { digest } = await signAndExecute({ transaction: tx });
      const res = await resolve(digest);
      const objectId = findCreatedObjectId(res.objectChanges as any[], "::narwhal::AgentIdentity");
      if (!objectId) throw new Error("Agent object id not found in result");
      return { objectId, digest };
    },
    [signAndExecute, resolve],
  );

  /** create_memory_pool — needs the agent object. Returns the pool object id. */
  const createPool = useCallback(
    async (agentObjectId: string, name: string): Promise<{ objectId: string; digest: string }> => {
      const pkg = getPackageId();
      if (!pkg) throw new Error("Contract not deployed yet");
      const tx = new Transaction();
      tx.moveCall({
        target: `${pkg}::${NARWHAL_MODULE}::create_memory_pool`,
        arguments: [tx.object(agentObjectId), tx.pure.string(name)],
      });
      const { digest } = await signAndExecute({ transaction: tx });
      const res = await resolve(digest);
      const objectId = findCreatedObjectId(res.objectChanges as any[], "::narwhal::MemoryPool");
      if (!objectId) throw new Error("Pool object id not found in result");
      return { objectId, digest };
    },
    [signAndExecute, resolve],
  );

  const authorizeReader = useCallback(
    async (poolObjectId: string, reader: string): Promise<string> => {
      const pkg = getPackageId();
      if (!pkg) throw new Error("Contract not deployed yet");
      const tx = new Transaction();
      tx.moveCall({
        target: `${pkg}::${NARWHAL_MODULE}::authorize_reader`,
        arguments: [tx.object(poolObjectId), tx.pure.address(reader)],
      });
      const { digest } = await signAndExecute({ transaction: tx });
      await resolve(digest);
      return digest;
    },
    [signAndExecute, resolve],
  );

  const revokeReader = useCallback(
    async (poolObjectId: string, reader: string): Promise<string> => {
      const pkg = getPackageId();
      if (!pkg) throw new Error("Contract not deployed yet");
      const tx = new Transaction();
      tx.moveCall({
        target: `${pkg}::${NARWHAL_MODULE}::revoke_reader`,
        arguments: [tx.object(poolObjectId), tx.pure.address(reader)],
      });
      const { digest } = await signAndExecute({ transaction: tx });
      await resolve(digest);
      return digest;
    },
    [signAndExecute, resolve],
  );

  /** anchor_snapshot — binds a Walrus blob id + content hash on-chain. */
  const anchorSnapshot = useCallback(
    async (
      agentObjectId: string,
      poolObjectId: string,
      blobId: string,
      contentHash: string,
      hasPrivate: boolean,
    ): Promise<string> => {
      const pkg = getPackageId();
      if (!pkg) throw new Error("Contract not deployed yet");
      const tx = new Transaction();
      tx.moveCall({
        target: `${pkg}::${NARWHAL_MODULE}::anchor_snapshot`,
        arguments: [
          tx.object(agentObjectId),
          tx.object(poolObjectId),
          tx.pure.string(blobId),
          tx.pure.string(contentHash),
          tx.pure.bool(hasPrivate),
          tx.object(SUI_CLOCK_OBJECT_ID),
        ],
      });
      const { digest } = await signAndExecute({ transaction: tx });
      await resolve(digest);
      return digest;
    },
    [signAndExecute, resolve],
  );

  return { publish, registerAgent, createPool, authorizeReader, revokeReader, anchorSnapshot, account };
}

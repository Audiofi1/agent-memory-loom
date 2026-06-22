import { useEffect, useState } from "react";

/** Re-renders the subtree whenever the local Tusk index changes. */
export function useTuskSync() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("tusk:update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("tusk:update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
}

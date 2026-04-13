import { useCallback, useState } from "react";
import { getPNRStatus, lookupPublicPNRStatus } from "@/api/pnr.api";
import type { APIError, PNRStatusResult } from "@/types";

export function usePNRStatus() {
  const [data, setData] = useState<PNRStatusResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const lookup = useCallback(async (pnr: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPNRStatus(pnr);
      setData(result);
      return result;
    } catch (err) {
      setError(err as APIError);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lookupPublic = useCallback(async (pnr: string, lastName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await lookupPublicPNRStatus(pnr, lastName);
      setData(result);
      return result;
    } catch (err) {
      setError(err as APIError);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    lookup,
    lookupPublic,
  };
}

export default usePNRStatus;

import { useCallback, useEffect, useState } from "react";
import { searchFlights } from "@/api/flights.api";
import type { Flight, FlightSearchParams, APIError } from "@/types";

export function useFlights(initialParams?: FlightSearchParams) {
  const [data, setData] = useState<Flight[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<APIError | null>(null);
  const [params, setParams] = useState<FlightSearchParams>(initialParams ?? {});

  const fetch = useCallback(
    async (overrideParams?: FlightSearchParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await searchFlights(overrideParams ?? params);
        setData(res);
      } catch (err) {
        setError(err as APIError);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [params],
  );

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
    setParams,
  };
}

export default useFlights;

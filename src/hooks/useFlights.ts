import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchFlights } from "@/api/flights.api";
import type { FlightSearchParams } from "@/types";

export const FLIGHTS_QUERY_KEY = "flights";

export function useFlights(initialParams?: FlightSearchParams) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [FLIGHTS_QUERY_KEY, initialParams],
    queryFn: () => searchFlights(initialParams ?? {}),
    staleTime: 60 * 1000,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [FLIGHTS_QUERY_KEY] });

  return {
    data: data ?? null,
    isLoading,
    error,
    refetch,
    invalidate,
    // kept for API compatibility — no-op since params are now part of query key
    setParams: () => {},
  };
}

export default useFlights;
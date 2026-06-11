import { useQuery } from "@tanstack/react-query";

export function useAsyncValue<T>(
  loader: () => Promise<T>,
  queryKey: unknown[] = [],
  staleTime: number = 60 * 1000,
) {
  const { data, isLoading, error, refetch } = useQuery<T>({
    queryKey,
    queryFn: loader,
    staleTime,
  });

  return {
    data: data ?? null,
    isLoading,
    error,
    refetch: async () => {
      const result = await refetch();
      return result.data ?? null;
    },
  };
}

export default useAsyncValue;
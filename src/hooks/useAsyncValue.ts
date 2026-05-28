import { useCallback, useEffect, useState } from "react";

export function useAsyncValue<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextData = await loader();
      setData(nextData);
      return nextData;
    } catch (nextError) {
      setError(nextError);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

export default useAsyncValue;

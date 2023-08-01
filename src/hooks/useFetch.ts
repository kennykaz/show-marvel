import { useState, useEffect } from "react";

interface Response<T> {
    data: T,
    isPending: boolean,
    error: string | null,
}

export const useFetch = <T>(url: string, isEnabled: boolean): Response<T> => {
  const [data, setData] = useState<T>();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEnabled) {
        const fetchData = async () => {
        setIsPending(true);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(response.statusText);
            const json = await response.json();
            setIsPending(false);
            setData(json);
            setError(null);
        } catch (error) {
            setError(`${error} Could not Fetch Data`);
            setIsPending(false);
        }
        };
        fetchData();
    }
  }, [url, isEnabled]);
  
  return { data: data as T, isPending, error };
};
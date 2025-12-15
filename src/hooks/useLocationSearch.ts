import { useEffect, useState } from "react";
import { fetchLocations } from "../api/location";
import type { Location } from "../types/location";

export function useLocationSearch(query: string) {
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const search = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchLocations(query);
        setResults(data);
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        )
          return;

        console.error(err);
        setError("Failed to search locations");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [query]);

  return { results, loading, error };
}
import { useEffect, useState, useCallback } from "react";

type Options = {
  withSeconds?: boolean;
};

export const useFormattedDate = (options?: Options) => {
  const format = useCallback(() => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: options?.withSeconds ? "2-digit" : undefined,
      hour12: false,
    });

    return `${now.toLocaleDateString("en-US", { weekday: "long" })}, ${time}`;
  }, [options?.withSeconds]);

  const [formattedDate, setFormattedDate] = useState<string>(format);

  useEffect(() => {
    const interval = setInterval(
      () => setFormattedDate(format()),
      options?.withSeconds ? 1000 : 60_000
    );

    return () => clearInterval(interval);
  }, [options?.withSeconds, format]);

  return formattedDate;
};
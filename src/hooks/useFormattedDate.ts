import { useEffect, useState } from "react";

type Options = {
  withSeconds?: boolean;
};

export const useFormattedDate = (options?: Options) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const format = () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    const ss = now.getSeconds().toString().padStart(2, "0");

    return options?.withSeconds
      ? `${days[now.getDay()]}, ${hh}:${mm}:${ss}`
      : `${days[now.getDay()]}, ${hh}:${mm}`;
  };

  const [formattedDate, setFormattedDate] = useState<string>(format);

  useEffect(() => {
    const interval = setInterval(
      () => setFormattedDate(format()),
      options?.withSeconds ? 1000 : 60_000
    );

    return () => clearInterval(interval);
  }, [options?.withSeconds]);

  return formattedDate;
};
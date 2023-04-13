"use client";
import { useEffect, useState } from "react";

export default function useMinWidth(size: number) {
  const [match, setMatch] = useState(false);

  function handle() {
    setMatch(window.innerWidth < size);
  }

  useEffect(() => {
    handle();

    window.addEventListener("resize", handle);
  }, [size]);

  return match;
}

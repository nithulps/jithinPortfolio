"use client";

import { useEffect, useState } from "react";

export default function RotatingText({
  phrases,
  wrapperClass,
  itemClass,
}: {
  phrases: string[];
  wrapperClass: string;
  itemClass: string;
}) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);

  useEffect(() => {
    if (!phrases || phrases.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => {
        setPrev(i);
        return (i + 1) % phrases.length;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [phrases]);

  if (!phrases || phrases.length === 0) return null;

  return (
    <span className={wrapperClass}>
      {phrases.map((p, i) => (
        <span
          key={i}
          className={`${itemClass}${i === index ? " active" : i === prev ? " exit" : ""}`}
        >
          {p}
        </span>
      ))}
    </span>
  );
}
